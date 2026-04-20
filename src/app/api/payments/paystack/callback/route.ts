import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("reference") ?? req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.redirect(new URL("/checkout?pay=missing_ref", req.url));

  // In production: verify transaction via Paystack verify endpoint.
  // For now: mark order as PAID if it exists.
  await prisma.order.updateMany({
    where: { paymentRef: ref },
    data: { status: "PAID" },
  });

  return NextResponse.redirect(new URL(`/dashboard?paid=1&ref=${encodeURIComponent(ref)}`, req.url));
}

