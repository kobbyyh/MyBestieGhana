import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { mockProducts } from "@/lib/mock-data";

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const sp = await searchParams;
  const q = (sp.q ?? "").toLowerCase();
  const category = sp.category ?? "";

  const products = mockProducts.filter((p) => {
    const hitQ = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
    const hitC = !category || p.category === category;
    return hitQ && hitC;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Shop</h1>
          <p className="text-sm text-muted-foreground">Browse products from vendors.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-2 text-sm font-semibold">Filters</CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Search</div>
                <form>
                  <Input name="q" defaultValue={sp.q ?? ""} placeholder="Search products…" />
                </form>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Category</div>
                <div className="flex flex-wrap gap-2">
                  {Array.from(new Set(mockProducts.map((p) => p.category))).map((c) => (
                    <Link
                      key={c}
                      href={{ pathname: "/shop", query: { ...(q ? { q } : {}), category: c } }}
                    >
                      <Badge variant={c === category ? "default" : "secondary"}>{c}</Badge>
                    </Link>
                  ))}
                  {category ? (
                    <Link href={{ pathname: "/shop", query: q ? { q } : {} }}>
                      <Badge variant="outline">Clear</Badge>
                    </Link>
                  ) : null}
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground">Price</div>
                <div className="text-sm text-muted-foreground">
                  Coming soon (min/max, rating filters).
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        <section>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <Link key={p.id} href={`/product/${p.id}`}>
                <Card className="h-full overflow-hidden hover:bg-accent">
                  <div className="relative aspect-[3/2] w-full bg-muted">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes="(max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="space-y-2 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="font-medium">{p.name}</div>
                      <Badge variant="secondary">GHS {p.priceGHS}</Badge>
                    </div>
                    <div className="line-clamp-2 text-sm text-muted-foreground">
                      {p.description}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {p.category} · {p.ratingAvg.toFixed(1)}★
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {products.length === 0 ? (
            <div className="mt-10 rounded-2xl border p-6 text-sm text-muted-foreground">
              No products match your filters.
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}

