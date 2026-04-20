import crypto from "crypto";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

async function readRawBody(req: Request) {
  const ab = await req.arrayBuffer();
  return Buffer.from(ab);
}

function verifyPaystackSignature(rawBody: Buffer, signature: string, secret: string) {
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}

export async function POST(req: Request) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "PAYSTACK_SECRET_KEY not configured" }, { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature") ?? "";
  const raw = await readRawBody(req);

  if (!signature || !verifyPaystackSignature(raw, signature, secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(raw.toString("utf-8")) as unknown;
  const evt = event as { event?: string; data?: { reference?: string } };
  const eventType = evt.event;

  // Expecting charge.success; reference lives at data.reference
  if (eventType === "charge.success") {
    const reference = evt.data?.reference;
    if (reference) {
      await prisma.order.updateMany({
        where: { paymentRef: reference },
        data: { status: "PAID" },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

