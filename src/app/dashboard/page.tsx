import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  const role = session.user.role ?? "CUSTOMER";

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back, {session.user.name ?? session.user.email ?? "Bestie"}.
          </p>
        </div>
        <Badge variant="secondary">{role}</Badge>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Profile</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Email: {session.user.email ?? "—"}
            <br />
            Phone: {session.user.phone ?? "—"}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Coming soon (Prisma-backed orders list).
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Bookings</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Coming soon (Prisma-backed bookings list).
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            In-app notifications placeholder.
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Wallet</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">Placeholder.</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Shortcuts</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link className="underline" href="/checkout">
              Checkout
            </Link>
            {role === "VENDOR" || role === "ADMIN" ? (
              <Link className="underline" href="/vendor">
                Vendor
              </Link>
            ) : null}
            {role === "ADMIN" ? (
              <Link className="underline" href="/admin">
                Admin
              </Link>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

