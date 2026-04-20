import { NextResponse } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";

const Schema = z.object({
  q: z.string().min(1).max(120),
});

export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = Schema.safeParse({ q: url.searchParams.get("q") ?? "" });
  if (!parsed.success) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const q = parsed.data.q;

  const [products, services, jobs] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
      },
      select: { id: true, name: true, priceGHS: true, category: true, images: true },
      take: 12,
    }),
    prisma.service.findMany({
      where: {
        isActive: true,
        OR: [{ name: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
      },
      select: { id: true, name: true, priceGHS: true, category: true, images: true },
      take: 12,
    }),
    prisma.job.findMany({
      where: {
        isActive: true,
        OR: [{ title: { contains: q, mode: "insensitive" } }, { description: { contains: q, mode: "insensitive" } }],
      },
      select: { id: true, title: true, company: true, location: true, type: true },
      take: 12,
    }),
  ]);

  return NextResponse.json({ products, services, jobs });
}

