import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authOptions } from "@/lib/auth";

export default async function VendorPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Vendor Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Manage products, services, orders/bookings, and earnings (mock).
        </p>
      </div>

      <Tabs defaultValue="products" className="mt-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="orders">Orders & Bookings</TabsTrigger>
          <TabsTrigger value="earnings">Earnings</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manage products</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>List, create, update, and delete products.</div>
                <Button asChild size="sm">
                  <Link href="/vendor/products">Open products</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Manage services</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>List, create, update, and delete services.</div>
                <Button asChild size="sm">
                  <Link href="/vendor/services">Open services</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Orders & bookings</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Vendor-side order/booking view placeholder.
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earnings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Earnings</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Mock analytics placeholder (charts later).
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Availability scheduling</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Placeholder. We’ll store provider availability blocks per service.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

