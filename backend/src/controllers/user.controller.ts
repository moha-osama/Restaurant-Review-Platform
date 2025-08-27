import type { Request, Response } from "express";
import prisma from "../lib/client.js";

// Consistent cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production", // false for localhost, true for production
  sameSite: "strict" as const, // Consistent across all functions
  maxAge: 24 * 60 * 60 * 1000, // 1 day
  path: "/",
};

// login/signup/logout a user
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await prisma.user.findByCredentials(email, password);
    const token = await prisma.user.generateAuthToken(String(user.id));

    req.user = user;

    const { email: userEmail, name, role, createdAt } = user;
    res
      .cookie("auth_token", token, cookieOptions)
      .status(200)
      .json({
        user: { email: userEmail, name, role, createdAt },
      });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Login failed";
    res.status(400).json({ error: errorMessage });
  }
};

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password) {
      return res
        .status(400)
        .json({ error: "Email, name, and password are required" });
    }
    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }


    const user = await prisma.user.create({
      data: {
        email,
        password,
        name,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Signup failed";
    res.status(400).json({ error: errorMessage });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const currentToken = req.cookies.auth_token; // Get token from cookies, not req.token
    if (!currentToken) {
      return res.status(400).json({ error: "No token found" });
    }

    // Get current user from database
    const dbUser = await prisma.user.getCurrentUser(user.id);
    const updatedTokens = dbUser.tokens.filter(
      (token: string) => token !== currentToken
    );

    await prisma.user.update({
      where: { id: user.id },
      data: { tokens: updatedTokens },
    });

    // Clear the cookie
    res
      .clearCookie("auth_token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to logout user";
    res.status(500).json({ error: errorMessage });
  }
};

export const logoutAllUser = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user || !user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { tokens: [] },
    });

    // Clear the cookie
    res
      .clearCookie("auth_token", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
      })
      .status(200)
      .json({ message: "User logged out successfully" });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to logout user";
    res.status(500).json({ error: errorMessage });
  }
};

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// get user by id
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Get current logged-in user profile
export const getCurrentUserProfile = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user || !user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userProfile = await prisma.user.getCurrentUser(user.id);

    // Remove tokens from response for security
    const { tokens, ...profileWithoutTokens } = userProfile;
    res.status(200).json(profileWithoutTokens);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch user profile";
    res.status(500).json({ error: errorMessage });
  }
};
