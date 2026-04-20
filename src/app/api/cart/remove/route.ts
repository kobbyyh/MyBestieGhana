import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAuthedUser } from "@/lib/server-auth";

const Schema = z.object({
  productId: z.string().min(1),
});

export async function POST(req: NextRequest) {
  const user = await requireAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const cart = await prisma.cart.findUnique({
    where: { userId: user.userId },
    select: { id: true },
  });
  if (!cart) return NextResponse.json({ ok: true });

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id, productId: parsed.data.productId },
  });

  return NextResponse.json({ ok: true });
}

