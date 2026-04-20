import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PayButtons } from "./pay";
import { CheckoutSummary } from "./summary";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/auth/login?next=/checkout");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Checkout</h1>
        <p className="text-sm text-muted-foreground">Address + payment + summary.</p>
      </div>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Delivery address</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Placeholder. Next step: save addresses per user and validate phone.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <CheckoutSummary />
            <Separator />
            <PayButtons />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

