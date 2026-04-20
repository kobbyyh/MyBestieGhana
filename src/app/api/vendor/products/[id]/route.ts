import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/rbac";

const UpdateSchema = z.object({
  name: z.string().min(2).max(120).optional(),
  description: z.string().min(10).max(4000).optional(),
  priceGHS: z.number().int().min(1).optional(),
  category: z.string().min(2).max(80).optional(),
  images: z.array(z.string().min(1)).optional(),
  isActive: z.boolean().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["VENDOR", "ADMIN"]);
  if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: auth.status });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = UpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const existing = await prisma.product.findUnique({ where: { id }, select: { vendorId: true } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (auth.user.role !== "ADMIN" && existing.vendorId !== auth.user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const updated = await prisma.product.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ product: updated });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireRole(req, ["VENDOR", "ADMIN"]);
  if (!auth.ok) return NextResponse.json({ error: "Forbidden" }, { status: auth.status });

  const { id } = await params;
  const existing = await prisma.product.findUnique({ where: { id }, select: { vendorId: true } });
  if (!existing) return NextResponse.json({ ok: true });
  if (auth.user.role !== "ADMIN" && existing.vendorId !== auth.user.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}

