import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const CreateSchema = z.object({
  name: z.string().min(2).max(120),
  description: z.string().min(10).max(4000),
  priceGHS: z.number().int().min(1),
  category: z.string().min(2).max(80),
  images: z.array(z.string().min(1)).default(["/placeholders/placeholder.svg"]),
  isActive: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  const auth = await requireRole(req, ["VENDOR", "ADMIN"]);
  if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: auth.status });

  const products = await prisma.product.findMany({
    where: auth.user.role === "ADMIN" ? {} : { vendorId: auth.user.userId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
  const auth = await requireRole(req, ["VENDOR", "ADMIN"]);
  if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: auth.status });

  const body = await req.json().catch(() => null);
  const parsed = CreateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const p = await prisma.product.create({
    data: {
      vendorId: auth.user.userId,
      ...parsed.data,
    },
  });

  return NextResponse.json({ product: p });
}

