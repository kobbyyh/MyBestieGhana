import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  pickupLocation: z.string().min(2),
  deliveryLocation: z.string().min(2),
  itemType: z.string().min(1),
  weightKg: z.number().positive(),
  speed: z.enum(["standard", "express"]).default("standard"),
});

function estimateDistanceKm(a: string, b: string) {
  // Mock distance estimator: deterministic-ish from strings.
  const n = Math.abs(a.trim().length - b.trim().length);
  return Math.max(2, Math.min(30, 5 + n));
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const { pickupLocation, deliveryLocation, weightKg, speed } = parsed.data;
  const distanceKm = estimateDistanceKm(pickupLocation, deliveryLocation);

  const base = 18;
  const distanceFee = Math.round(distanceKm * 2.2);
  const weightFee = Math.round(Math.max(0, weightKg - 1) * 6);
  const speedFee = speed === "express" ? 15 : 0;
  const priceGHS = base + distanceFee + weightFee + speedFee;

  return NextResponse.json({ priceGHS, breakdown: { base, distanceFee, weightFee, speedFee } });
}

