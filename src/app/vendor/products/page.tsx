"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sonner } from "@/lib/sonner";

type Product = {
  id: string;
  name: string;
  description: string;
  priceGHS: number;
  category: string;
  isActive: boolean;
};

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/vendor/products", { cache: "no-store" });
    setLoading(false);
    if (!res.ok) return setProducts([]);
    const data = (await res.json()) as { products: Product[] };
    setProducts(data.products);
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
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Vendor Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog.</p>
        </div>
        <CreateProduct onCreated={load} />
      </div>

      <div className="mt-6 grid gap-3">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent>
          </Card>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">
              No products yet.
            </CardContent>
          </Card>
        ) : (
          products.map((p) => (
            <Card key={p.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{p.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {p.category} · GHS {p.priceGHS} · {p.isActive ? "Active" : "Hidden"}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      const res = await fetch(`/api/vendor/products/${p.id}`, {
                        method: "PATCH",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ isActive: !p.isActive }),
                      });
                      if (!res.ok) return sonner.error("Could not update");
                      load();
                    }}
                  >
                    {p.isActive ? "Hide" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      const res = await fetch(`/api/vendor/products/${p.id}`, { method: "DELETE" });
                      if (!res.ok) return sonner.error("Could not delete");
                      sonner.success("Deleted");
                      load();
                    }}
                  >
                    Delete
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

function CreateProduct({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [priceGHS, setPriceGHS] = useState(10);
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New product</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Price (GHS)</Label>
              <Input
                type="number"
                min={1}
                value={priceGHS}
                onChange={(e) => setPriceGHS(Math.max(1, Number(e.target.value)))}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const res = await fetch("/api/vendor/products", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name, category, priceGHS, description }),
              });
              setLoading(false);
              if (!res.ok) return sonner.error("Could not create product");
              sonner.success("Created");
              setOpen(false);
              onCreated();
            }}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

