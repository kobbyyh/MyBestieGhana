"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { sonner } from "@/lib/sonner";

type WishlistItem = {
  id: string;
  product: { id: string; name: string; priceGHS: number; images: string[]; category: string };
};

export default function WishlistPage() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/wishlist", { cache: "no-store" });
    setLoading(false);
    if (!res.ok) return setItems([]);
    const data = (await res.json()) as { items: WishlistItem[] };
    setItems(data.items);
  }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Wishlist</h1>
        <p className="text-sm text-muted-foreground">Saved products.</p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card className="sm:col-span-2 lg:col-span-3">
            <CardContent className="p-6 text-sm text-muted-foreground">
              Nothing saved yet. Browse{" "}
              <Link className="underline" href="/shop">
                shop
              </Link>
              .
            </CardContent>
          </Card>
        ) : (
          items.map((it) => (
            <Card key={it.id} className="overflow-hidden">
              <div className="relative aspect-[3/2] bg-muted">
                <Image
                  src={it.product.images[0] ?? "/placeholders/placeholder.svg"}
                  alt={it.product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <CardContent className="space-y-2 p-4">
                <div className="font-medium">{it.product.name}</div>
                <div className="text-sm text-muted-foreground">{it.product.category}</div>
                <div className="text-sm font-semibold">GHS {it.product.priceGHS}</div>
                <div className="flex gap-2">
                  <Button asChild size="sm" variant="secondary">
                    <Link href={`/product/${it.product.id}`}>View</Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      const res = await fetch("/api/wishlist/toggle", {
                        method: "POST",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ productId: it.product.id }),
                      });
                      if (!res.ok) return sonner.error("Could not update wishlist");
                      load();
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

