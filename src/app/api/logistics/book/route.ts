import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAuthedUser } from "@/lib/server-auth";

const Schema = z.object({
  pickupLocation: z.string().min(2),
  deliveryLocation: z.string().min(2),
  itemType: z.string().min(1),
  weightKg: z.number().positive(),
  sizeNote: z.string().max(500).optional(),
  notes: z.string().max(2000).optional(),
  speed: z.enum(["standard", "express"]).default("standard"),
  priceGHS: z.number().int().positive(),
});

function makeTrackingCode() {
  return `MBG-${Math.random().toString(16).slice(2, 6).toUpperCase()}-${Date.now()
    .toString()
    .slice(-6)}`;
}

export async function POST(req: NextRequest) {
  const user = await requireAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const trackingCode = makeTrackingCode();

  await prisma.logisticsRequest.create({
    data: {
      userId: user.userId,
      pickupLocation: parsed.data.pickupLocation,
      deliveryLocation: parsed.data.deliveryLocation,
      itemType: parsed.data.itemType,
      weightKg: parsed.data.weightKg,
      sizeNote: [parsed.data.sizeNote, parsed.data.notes].filter(Boolean).join(" | ") || undefined,
      speed: parsed.data.speed,
      priceGHS: parsed.data.priceGHS,
      trackingCode,
    },
  });

  return NextResponse.json({ ok: true, trackingCode });
}

