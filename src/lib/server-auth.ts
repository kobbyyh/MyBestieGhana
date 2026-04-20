import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export type AuthedUser = {
  userId: string;
  role?: "CUSTOMER" | "VENDOR" | "ADMIN";
};

export async function requireAuthedUser(req: NextRequest): Promise<AuthedUser | null> {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const userId = token?.sub;
  if (!userId) return null;
  const role = token.role as AuthedUser["role"];
  return { userId, role };
}

