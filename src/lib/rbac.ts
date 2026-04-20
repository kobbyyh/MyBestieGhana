import type { NextRequest } from "next/server";

import { requireAuthedUser } from "@/lib/server-auth";

export async function requireRole(req: NextRequest, roles: Array<"CUSTOMER" | "VENDOR" | "ADMIN">) {
  const user = await requireAuthedUser(req);
  if (!user) return { ok: false as const, status: 401 as const };
  if (!user.role || !roles.includes(user.role)) return { ok: false as const, status: 403 as const };
  return { ok: true as const, user };
}

