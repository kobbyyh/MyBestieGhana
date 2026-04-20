# MyBestie Ghana

Multi-purpose **e-commerce + services + logistics + jobs** platform.

## Tech stack

- Next.js (App Router) + React + Tailwind CSS + ShadCN UI
- PostgreSQL + Prisma ORM
- NextAuth (Credentials) + role-based access control (Customer/Vendor/Admin)
- Paystack integration (init + callback stub), with MoMo structure placeholder

## Folder structure (high level)

```txt
mybestie-ghana/
  src/
    app/                       # App Router pages + API routes
      api/
        auth/                  # NextAuth + signup + OTP mock
        cart/                  # Cart endpoints
        bookings/              # Service bookings
        logistics/             # Quote + book logistics
        payments/paystack/     # Paystack init + callback stub
        jobs/                  # Job applications
      (routes)/                # /, /shop, /product/[id], /services, /logistics, /jobs, /dashboard, /vendor, /admin, /checkout
    components/
      site/                    # Navbar/footer
      ui/                      # ShadCN components
    lib/
      auth.ts                  # NextAuth options
      prisma.ts                # Prisma singleton
      server-auth.ts           # JWT token helper (API)
      mock-data.ts             # UI mock data (also seeded into DB)
  prisma/
    schema.prisma              # DB models
    seed.ts                    # Seed script
  docker-compose.yml           # Local Postgres
  .env / .env.example          # Environment variables
```

## Local setup (Windows)

### 1) Install prerequisites

- Node.js LTS
- Docker Desktop (for Postgres)

### 2) Install dependencies

```bash
cd mybestie-ghana
npm install
```

### 3) Start Postgres

```bash
docker compose up -d
```

### 4) Configure env

Copy `.env.example` → `.env` and adjust if needed.

### 5) Migrate + seed

```bash
npm run prisma:migrate
npm run db:seed
```

### 6) Run the app

```bash
npm run dev
```

Open `http://localhost:3000`.

## Test accounts (seeded)

- **Admin**: `admin@mybestie.local` / `password123`
- **Vendor**: `vendor@mybestie.local` / `password123`
- **Customer**: `customer@mybestie.local` / `password123`

## Notes

- Some UI uses mock lists (for fast iteration). The seed script inserts matching IDs so API routes work with Prisma.
- Paystack is **mocked** unless `PAYSTACK_SECRET_KEY` is provided.
- CV upload is a placeholder (for production, store files in S3/Cloudinary/etc and save `cvUrl`).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
