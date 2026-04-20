"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { sonner } from "@/lib/sonner";

type CartItem = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    priceGHS: number;
    images: string[];
    category: string;
  };
};

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    const res = await fetch("/api/cart", { cache: "no-store" });
    setLoading(false);
    if (!res.ok) {
      setItems([]);
      return;
    }
    const data = (await res.json()) as { items: CartItem[] };
    setItems(data.items);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (cancelled) return;
      setLoading(false);
      if (!res.ok) {
        setItems([]);
        return;
      }
      const data = (await res.json()) as { items: CartItem[] };
      setItems(data.items);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, it) => sum + it.quantity * it.product.priceGHS, 0),
    [items]
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Cart</h1>
          <p className="text-sm text-muted-foreground">Review items and proceed to checkout.</p>
        </div>
        <Button asChild disabled={items.length === 0}>
          <Link href="/checkout">Checkout</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {loading ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent>
            </Card>
          ) : items.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-muted-foreground">
                Your cart is empty.{" "}
                <Link className="underline" href="/shop">
                  Go shopping
                </Link>
                .
              </CardContent>
            </Card>
          ) : (
            items.map((it) => (
              <Card key={it.id}>
                <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                  <div className="relative h-20 w-28 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={it.product.images[0] ?? "/placeholders/placeholder.svg"}
                      alt={it.product.name}
                      fill
                      className="object-cover"
                      sizes="112px"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{it.product.name}</div>
                    <div className="text-xs text-muted-foreground">{it.product.category}</div>
                    <div className="mt-1 text-sm font-semibold">GHS {it.product.priceGHS}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      max={99}
                      value={it.quantity}
                      onChange={async (e) => {
                        const q = Math.max(1, Math.min(99, Number(e.target.value)));
                        setItems((prev) =>
                          prev.map((p) => (p.id === it.id ? { ...p, quantity: q } : p))
                        );
                        const res = await fetch("/api/cart/update", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ productId: it.product.id, quantity: q }),
                        });
                        if (!res.ok) sonner.error("Could not update cart");
                      }}
                      className="w-24"
                    />
                    <Button
                      variant="ghost"
                      onClick={async () => {
                        const res = await fetch("/api/cart/remove", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ productId: it.product.id }),
                        });
                        if (!res.ok) return sonner.error("Could not remove item");
                        sonner.success("Removed");
                        refresh();
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </section>

        <aside>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">GHS {subtotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="font-medium">GHS 0</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Total</span>
                <span className="text-base font-semibold">GHS {subtotal}</span>
              </div>
              <Button className="w-full" asChild disabled={items.length === 0}>
                <Link href="/checkout">Continue to checkout</Link>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

