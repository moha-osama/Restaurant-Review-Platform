import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL as string;

interface LoginData {
  email: string;
  password: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  role: "user" | "owner";
}

interface User {
  id: string;
  email: string;
  name: string;
  profilePicture?: string;
  createdAt: string;
  role: string;

  // Add other user properties as needed
}

interface LoginResponse {
  user: User;
  token?: string;
  message: string;
}

interface SignupResponse {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

// Custom hook for authentication
export const useAuth = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await fetch(`${BASE_API_URL}users/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          setIsLoggedIn(true);
        } else {
          // User is not logged in
          setUser(null);
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        setUser(null);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, [isLoggedIn]);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginData): Promise<LoginResponse> => {
      const response = await fetch(`${BASE_API_URL}users/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Login failed");
      }

      return response.json();
    },
    onSuccess: (data: LoginResponse) => {
      setUser(data.user);
      setIsLoggedIn(true);

      queryClient.invalidateQueries({ queryKey: ["user"] });
      window.location.href = "/";
    },
    onError: (error: Error) => {
      console.error("Login error:", error.message);
      setUser(null);
      setIsLoggedIn(false);
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupData): Promise<SignupResponse> => {
      const response = await fetch(`${BASE_API_URL}users`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || "Signup failed"
        );
      }

      return response.json();
    },
    onSuccess: (data: SignupResponse) => {
      console.log("Signup successful:", data);
      // After successful signup, automatically log the user in
      loginMutation.mutate({
        email: data.email,
        password: signupMutation.variables?.password || "",
      });
    },
    onError: (error: Error) => {
      console.error("Signup error:", error.message);
    },
  });

  const logout = async () => {
    try {
      const response = await fetch(`${BASE_API_URL}users/logout`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        setIsLoggedIn(false);
        queryClient.clear();
        navigate("/auth");
        window.location.href = "/";
      } else {
        throw new Error("Failed to sign out");
      }
    } catch (error) {
      console.error("Error signing out:", error);
      // setUser(null);
      // setIsLoggedIn(false);
      // queryClient.clear();
      // navigate("/auth");
      // window.location.href = "/";
    }
  };

  const resetLoginError = () => {
    loginMutation.reset();
  };

  const resetSignupError = () => {
    signupMutation.reset();
  };

  return {
    user,
    isLoggedIn,
    isLoading,
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    isLoginPending: loginMutation.isPending,
    loginError: loginMutation.error,
    resetLoginError,
    signup: signupMutation.mutate,
    signupAsync: signupMutation.mutateAsync,
    isSignupPending: signupMutation.isPending,
    signupError: signupMutation.error,
    resetSignupError,
    logout,
  };
};
