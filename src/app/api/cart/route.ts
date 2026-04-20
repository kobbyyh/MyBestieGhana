import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAuthedUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const user = await requireAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cart = await prisma.cart.findUnique({
    where: { userId: user.userId },
    select: {
      id: true,
      items: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          quantity: true,
          product: {
            select: {
              id: true,
              name: true,
              priceGHS: true,
              images: true,
              category: true,
            },
          },
        },
      },
    },
  });

  const items = cart?.items ?? [];
  const subtotalGHS = items.reduce((sum, it) => sum + it.quantity * it.product.priceGHS, 0);

  return NextResponse.json({ items, subtotalGHS });
}

