"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sonner } from "@/lib/sonner";

export function AddToCart({ productId }: { productId: string }) {
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex items-center gap-2">
        <div className="text-sm text-muted-foreground">Qty</div>
        <Input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
          className="w-24"
        />
      </div>
      <Button
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const res = await fetch("/api/cart/add", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ productId, quantity: qty }),
          });
          setLoading(false);
          if (!res.ok) return sonner.error("Please log in to add to cart.");
          sonner.success("Added to cart");
        }}
      >
        Add to cart
      </Button>
      <Button
        variant="secondary"
        disabled={loading}
        onClick={async () => {
          setLoading(true);
          const res = await fetch("/api/cart/add", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ productId, quantity: qty }),
          });
          setLoading(false);
          if (!res.ok) return sonner.error("Please log in to continue.");
          window.location.href = "/checkout";
        }}
      >
        Buy now
      </Button>
    </div>
  );
}

