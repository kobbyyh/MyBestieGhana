import bcrypt from "bcryptjs";

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@mybestie.local" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@mybestie.local",
      passwordHash,
      role: "ADMIN",
      cart: { create: {} },
    },
  });

  const vendor = await prisma.user.upsert({
    where: { email: "vendor@mybestie.local" },
    update: {},
    create: {
      name: "Bestie Vendor",
      email: "vendor@mybestie.local",
      passwordHash,
      role: "VENDOR",
      cart: { create: {} },
    },
  });

  await prisma.user.upsert({
    where: { email: "customer@mybestie.local" },
    update: {},
    create: {
      name: "Bestie Customer",
      email: "customer@mybestie.local",
      passwordHash,
      role: "CUSTOMER",
      cart: { create: {} },
    },
  });

  await prisma.product.upsert({
    where: { id: "p-1" },
    update: {},
    create: {
      id: "p-1",
      vendorId: vendor.id,
      name: "Air Fryer (4L)",
      description: "Crispy meals with less oil. Energy efficient.",
      priceGHS: 850,
      category: "Kitchen",
      images: ["/placeholders/placeholder.svg"],
      ratingAvg: 4.6,
      ratingCount: 12,
    },
  });

  await prisma.product.upsert({
    where: { id: "p-2" },
    update: {},
    create: {
      id: "p-2",
      vendorId: vendor.id,
      name: "Smartwatch Pro",
      description: "Health tracking, calls, and notifications.",
      priceGHS: 420,
      category: "Tech",
      images: ["/placeholders/placeholder.svg"],
      ratingAvg: 4.3,
      ratingCount: 21,
    },
  });

  await prisma.product.upsert({
    where: { id: "p-3" },
    update: {},
    create: {
      id: "p-3",
      vendorId: vendor.id,
      name: "Cleaning Starter Kit",
      description: "All-in-one home cleaning bundle.",
      priceGHS: 190,
      category: "Cleaning",
      images: ["/placeholders/placeholder.svg"],
      ratingAvg: 4.2,
      ratingCount: 7,
    },
  });

  await prisma.service.upsert({
    where: { id: "s-1" },
    update: {},
    create: {
      id: "s-1",
      vendorId: vendor.id,
      name: "Home Deep Cleaning",
      description: "2–4 hours professional cleaning with supplies included.",
      priceGHS: 250,
      category: "Cleaning",
      images: ["/placeholders/placeholder.svg"],
      location: "Accra",
      ratingAvg: 4.7,
      ratingCount: 18,
    },
  });

  await prisma.service.upsert({
    where: { id: "s-2" },
    update: {},
    create: {
      id: "s-2",
      vendorId: vendor.id,
      name: "Laptop Repair & Tune-up",
      description: "Diagnostics, fixes, and performance boost.",
      priceGHS: 180,
      category: "Tech",
      images: ["/placeholders/placeholder.svg"],
      location: "Accra",
      ratingAvg: 4.4,
      ratingCount: 25,
    },
  });

  await prisma.service.upsert({
    where: { id: "s-3" },
    update: {},
    create: {
      id: "s-3",
      vendorId: vendor.id,
      name: "Event MC Booking",
      description: "Professional MC for weddings, corporate and parties.",
      priceGHS: 600,
      category: "Events",
      images: ["/placeholders/placeholder.svg"],
      location: "Accra",
      ratingAvg: 4.5,
      ratingCount: 11,
    },
  });

  await prisma.job.upsert({
    where: { id: "j-1" },
    update: {},
    create: {
      id: "j-1",
      employerId: vendor.id,
      title: "Customer Support Representative",
      company: "Bestie Logistics",
      location: "Accra",
      type: "FULL_TIME",
      description: "Handle customer inquiries, track orders, and resolve issues.",
      isActive: true,
    },
  });

  await prisma.job.upsert({
    where: { id: "j-2" },
    update: {},
    create: {
      id: "j-2",
      employerId: vendor.id,
      title: "Frontend Developer (Next.js)",
      company: "GhanaTech Studio",
      location: "Remote",
      type: "REMOTE",
      description: "Build scalable UI with Next.js App Router and Tailwind.",
      isActive: true,
    },
  });

  console.log("Seed complete:", { admin: admin.email, vendor: vendor.email });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

