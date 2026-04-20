import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireAuthedUser } from "@/lib/server-auth";

const Schema = z.object({
  jobId: z.string().min(1),
  fullName: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional(),
  coverLetter: z.string().max(4000).optional(),
});

export async function POST(req: NextRequest) {
  const user = await requireAuthedUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid input" }, { status: 400 });

  const job = await prisma.job.findUnique({ where: { id: parsed.data.jobId }, select: { id: true } });
  if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });

  await prisma.application.upsert({
    where: { jobId_userId: { jobId: job.id, userId: user.userId } },
    update: {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      coverLetter: parsed.data.coverLetter,
    },
    create: {
      jobId: job.id,
      userId: user.userId,
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      coverLetter: parsed.data.coverLetter,
    },
  });

  return NextResponse.json({ ok: true });
}

