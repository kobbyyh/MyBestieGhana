import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAuthedUser } from "@/lib/server-auth";

const Schema = z.object({
  serviceId: z.string().min(1),
  scheduledAt: z.string().datetime(),
  notes: z.string().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const user = await requireAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const service = await prisma.service.findUnique({
    where: { id: parsed.data.serviceId },
    select: { id: true, priceGHS: true, currency: true },
  });
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });

  await prisma.booking.create({
    data: {
      userId: user.userId,
      serviceId: service.id,
      scheduledAt: new Date(parsed.data.scheduledAt),
      notes: parsed.data.notes,
      priceGHS: service.priceGHS,
      currency: service.currency,
    },
  });

  return NextResponse.json({ ok: true });
}

