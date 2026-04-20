"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { sonner } from "@/lib/sonner";

export function PayButtons() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const res = await fetch("/api/payments/paystack/init", { method: "POST" });
          setLoading(false);
          if (!res.ok) return sonner.error("Unable to start Paystack payment");
          const data = (await res.json()) as { authorizationUrl: string };
          window.location.href = data.authorizationUrl;
        }}
      >
        Pay with Paystack
      </Button>
      <Button
        variant="secondary"
        disabled
        title="Structured for MoMo (coming next)"
      >
        Pay with Mobile Money (MTN/Vodafone/AirtelTigo)
      </Button>
    </div>
  );
}

