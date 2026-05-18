import { db } from "@/server/db";
import NextAuth, { type DefaultSession, type Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import fs from "fs";
import path from "path";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      hasAccess: boolean;
      role: string;
      isAdmin: boolean;
    } & DefaultSession["user"];
  }

  interface User {
    hasAccess: boolean;
    role: string;
  }
}

interface JsonUser {
  email: string;
  name: string;
  password: string;
  role: string;
  hasAccess: boolean;
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.hasAccess = user.hasAccess;
        token.name = user.name;
        token.image = user.image;
        token.picture = user.image;
        token.role = user.role;
        token.isAdmin = user.role === "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.hasAccess = token.hasAccess as boolean;
      session.user.role = token.role as string;
      session.user.isAdmin = token.role === "ADMIN";
      return session;
    },
  },
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const usersPath = path.join(process.cwd(), "data", "users.json");
          const fileContents = fs.readFileSync(usersPath, "utf-8");
          const users: JsonUser[] = JSON.parse(fileContents);

          const user = users.find(
            (u) =>
              u.email === credentials.email &&
              u.password === credentials.password,
          );

          if (!user) {
            return null;
          }

          const dbUser = await db.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              role: user.role as "ADMIN" | "USER",
              hasAccess: user.hasAccess,
            },
            create: {
              email: user.email,
              name: user.name,
              role: user.role as "ADMIN" | "USER",
              hasAccess: user.hasAccess,
            },
          });

          return {
            id: dbUser.id,
            email: dbUser.email ?? user.email,
            name: dbUser.name ?? user.name,
            role: dbUser.role,
            hasAccess: dbUser.hasAccess,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
});
