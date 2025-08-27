import { PrismaClient } from "../../generated/prisma/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Ensure JWT_SECRET is available
const JWT_SECRET =
  process.env.JWT_SECRET || "fallback-secret-key-change-in-production";

const prisma = new PrismaClient().$extends({
  model: {
    user: {
      async findByCredentials(email: string, password_to_check: string) {
        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });
        if (!user) {
          throw new Error("Invalid email or password");
        }
        const isMatch = await bcrypt.compare(password_to_check, user.password);
        if (!isMatch) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
      async generateAuthToken(userId: string) {
        if (!userId) {
          throw new Error("User not found");
        }

        // Fetch user to get role
        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true },
        });

        if (!user) {
          throw new Error("User not found");
        }

        const token = jwt.sign({ id: userId, role: user.role }, JWT_SECRET, {
          expiresIn: "1h",
        });
        await prisma.user.update({
          where: { id: userId },
          data: { tokens: { push: token } },
        });

        return token;
      },
      async getCurrentUser(userId: string) {
        if (!userId) {
          throw new Error("User ID is required");
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            tokens: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        return user;
      },
    },
  },
  query: {
    user: {
      async $allOperations({ operation, args, query }) {
        // Hash password before create or update operations
        if (operation === 'create' || operation === 'update') {
          if (args.data && typeof args.data === 'object' && 'password' in args.data) {
            const password = args.data.password;
            if (typeof password === 'string' && password.length > 0) {
              // Only hash if password is not already hashed (check if it doesn't start with $2b$)
              if (!password.startsWith('$2b$')) {
                const saltRounds = 8;
                args.data.password = await bcrypt.hash(password, saltRounds);
              }
            }
          }
        }
        
        return query(args);
      },
    },
  },
});

export default prisma;
