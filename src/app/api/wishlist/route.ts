import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAuthedUser } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
  const user = await requireAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const items = await prisma.wishlistItem.findMany({
    where: { userId: user.userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      product: {
        select: { id: true, name: true, priceGHS: true, images: true, category: true },
      },
    },
  });

  return NextResponse.json({ items });
}

