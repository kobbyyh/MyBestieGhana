import { NextResponse } from "next/server";
import { z } from "zod";

const Schema = z.object({
  identifier: z.string().min(3),
  otp: z.string().min(4),
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const ok = parsed.data.otp === "123456";
  return NextResponse.json({ ok });
}

