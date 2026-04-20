"use client";

import { useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  quantity: number;
  product: { priceGHS: number };
};

export function CheckoutSummary() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) {
        setLoaded(true);
        return;
      }
      const data = (await res.json()) as { items: CartItem[] };
      setItems(data.items);
      setLoaded(true);
    })();
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity * it.product.priceGHS, 0),
    [items]
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span className="font-medium">{loaded ? `GHS ${subtotal}` : "—"}</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Delivery</span>
        <span className="font-medium">GHS 0</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">Total</span>
        <span className="text-base font-semibold">{loaded ? `GHS ${subtotal}` : "—"}</span>
      </div>
    </div>
  );
}

