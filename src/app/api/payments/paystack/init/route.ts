import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { requireAuthedUser } from "@/lib/server-auth";

function makeRef() {
  return `mbg_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

type PaystackInitResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
  };
};

export async function POST(req: NextRequest) {
  const user = await requireAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const u = await prisma.user.findUnique({
    where: { id: user.userId },
    select: { email: true, phone: true, name: true },
  });
  if (!u?.email) {
    return NextResponse.json(
      { error: "Add an email to your profile for Paystack payments." },
      { status: 400 }
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: user.userId },
    select: {
      items: {
        select: {
          quantity: true,
          product: { select: { id: true, priceGHS: true } },
        },
      },
    },
  });

  const subtotalGHS =
    cart?.items.reduce((sum, it) => sum + it.quantity * it.product.priceGHS, 0) ?? 0;

  if (subtotalGHS <= 0) {
    return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
  }

  const deliveryGHS = 0;
  const totalGHS = subtotalGHS + deliveryGHS;
  const paymentRef = makeRef();

  const order = await prisma.order.create({
    data: {
      userId: user.userId,
      status: "PENDING",
      subtotalGHS,
      deliveryGHS,
      totalGHS,
      addressLine1: "TODO",
      city: "TODO",
      phone: u.phone ?? "TODO",
      paymentRef,
      paymentProvider: "paystack",
      items: {
        create: cart!.items.map((it) => ({
          productId: it.product.id,
          unitPriceGHS: it.product.priceGHS,
          quantity: it.quantity,
        })),
      },
    },
    select: { id: true },
  });

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    // Mock for local dev when Paystack isn't configured.
    const url = new URL("/checkout", req.url);
    url.searchParams.set("mockPaystack", "1");
    url.searchParams.set("orderId", order.id);
    return NextResponse.json({ authorizationUrl: url.toString() });
  }

  const callbackUrl = new URL("/api/payments/paystack/callback", req.url);
  callbackUrl.searchParams.set("ref", paymentRef);

  const resp = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: u.email,
      amount: totalGHS * 100, // pesewas
      currency: "GHS",
      reference: paymentRef,
      callback_url: callbackUrl.toString(),
      metadata: { orderId: order.id, platform: "MyBestie Ghana" },
    }),
  });

  if (!resp.ok) {
    const text = await resp.text().catch(() => "");
    return NextResponse.json({ error: "Paystack init failed", details: text }, { status: 502 });
  }

  const data = (await resp.json()) as PaystackInitResponse;
  const authorizationUrl = data.data?.authorization_url;
  if (!authorizationUrl) {
    return NextResponse.json({ error: "Paystack init returned no authorization URL" }, { status: 502 });
  }
  return NextResponse.json({ authorizationUrl });
}

