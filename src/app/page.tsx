import Link from "next/link";
import { ArrowRight, Briefcase, Clock, Package, ShieldCheck, Truck } from "lucide-react";

export default function Home() {
  return (
    <div className="bg-background">
      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5" />
            Marketplace + services + logistics + jobs
          </div>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Everything You Need, One Bestie Away
          </h1>
          <p className="max-w-xl text-pretty text-muted-foreground">
            Shop products, book trusted services, request deliveries, and apply for jobs — all
            in one place.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground hover:opacity-95"
            >
              Shop Now <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium hover:bg-accent"
            >
              Book a Service
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-3 text-xs text-muted-foreground">
            <div className="rounded-xl border p-3">
              <div className="font-medium text-foreground">Paystack</div>
              Payments ready
            </div>
            <div className="rounded-xl border p-3">
              <div className="font-medium text-foreground">MoMo</div>
              Structured support
            </div>
            <div className="rounded-xl border p-3">
              <div className="font-medium text-foreground">RBAC</div>
              Customer/Vendor/Admin
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <Link href="/shop" className="group rounded-2xl border p-5 hover:bg-accent">
            <div className="flex items-center gap-2 font-medium">
              <Package className="h-4 w-4" /> Shop Products
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Discover deals from vendors across Ghana.
            </div>
          </Link>
          <Link href="/services" className="group rounded-2xl border p-5 hover:bg-accent">
            <div className="flex items-center gap-2 font-medium">
              <Clock className="h-4 w-4" /> Book Services
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Cleaning, tech, events, home care, and more.
            </div>
          </Link>
          <Link href="/logistics" className="group rounded-2xl border p-5 hover:bg-accent">
            <div className="flex items-center gap-2 font-medium">
              <Truck className="h-4 w-4" /> Logistics
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Request deliveries and track status (mock).
            </div>
          </Link>
          <Link href="/jobs" className="group rounded-2xl border p-5 hover:bg-accent">
            <div className="flex items-center gap-2 font-medium">
              <Briefcase className="h-4 w-4" /> Job Hub
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Post jobs and apply with CV upload (placeholder).
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-12">
        <h2 className="text-lg font-semibold">Categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            "Logistics",
            "Jobs",
            "Tech",
            "Travel",
            "Cleaning",
            "Kitchen",
            "Events",
            "Home Care",
            "Health",
          ].map((c) => (
            <div key={c} className="rounded-2xl border p-4 text-sm font-medium">
              {c}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="text-lg font-semibold">How it works</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { title: "Choose", body: "Browse products, services, jobs, or logistics." },
            { title: "Book/Buy", body: "Checkout securely (Paystack-ready)."},
            { title: "Get Delivered", body: "Track orders and requests in your dashboard."},
          ].map((s) => (
            <div key={s.title} className="rounded-2xl border p-5">
              <div className="font-medium">{s.title}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
