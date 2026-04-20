import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const Schema = z.object({
  name: z.string().min(2).max(80),
  identifier: z.string().min(3).max(120),
  password: z.string().min(6).max(200),
  role: z.enum(["CUSTOMER", "VENDOR"]).default("CUSTOMER"),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { name, identifier, password, role } = parsed.data;
  const isEmail = identifier.includes("@");
  const email = isEmail ? identifier.toLowerCase() : null;
  const phone = isEmail ? null : identifier;

  const existing = await prisma.user.findFirst({
    where: { OR: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])] },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "Account already exists" }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      name,
      email: email ?? undefined,
      phone: phone ?? undefined,
      passwordHash,
      role,
      cart: { create: {} },
    },
  });

  return NextResponse.json({ ok: true });
}

