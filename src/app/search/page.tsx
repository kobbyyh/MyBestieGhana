"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

type SearchResult = {
  products: Array<{ id: string; name: string; priceGHS: number; category: string; images: string[] }>;
  services: Array<{ id: string; name: string; priceGHS: number; category: string; images: string[] }>;
  jobs: Array<{ id: string; title: string; company: string; location: string; type: string }>;
};

export default function SearchPage() {
  const sp = useSearchParams();
  const initialQ = sp.get("q") ?? "";

  const [q, setQ] = useState(initialQ);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<SearchResult | null>(null);

  async function run(query: string) {
    const trimmed = query.trim();
    if (!trimmed) {
      setData(null);
      return;
    }
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { cache: "no-store" });
    setLoading(false);
    if (!res.ok) return setData({ products: [], services: [], jobs: [] });
    setData((await res.json()) as SearchResult);
  }

  useEffect(() => {
    run(initialQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Search</h1>
        <p className="text-sm text-muted-foreground">Products, services, and jobs.</p>
      </div>

      <div className="mt-6 flex gap-2">
        <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
        <Button onClick={() => run(q)} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {data ? (
        <div className="mt-8 grid gap-6">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Products</h2>
              <Badge variant="secondary">{data.products.length}</Badge>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((p) => (
                <Link key={p.id} href={`/product/${p.id}`}>
                  <Card className="overflow-hidden hover:bg-accent">
                    <div className="relative aspect-[3/2] bg-muted">
                      <Image
                        src={p.images[0] ?? "/placeholders/placeholder.svg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardContent className="space-y-1 p-4">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-sm text-muted-foreground">{p.category}</div>
                      <div className="text-sm font-semibold">GHS {p.priceGHS}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {data.products.length === 0 ? (
                <div className="rounded-2xl border p-5 text-sm text-muted-foreground">
                  No product matches.
                </div>
              ) : null}
            </div>
          </section>

          <Separator />

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Services</h2>
              <Badge variant="secondary">{data.services.length}</Badge>
            </div>
            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.services.map((s) => (
                <Link key={s.id} href={`/services/${s.id}`}>
                  <Card className="overflow-hidden hover:bg-accent">
                    <div className="relative aspect-[3/2] bg-muted">
                      <Image
                        src={s.images[0] ?? "/placeholders/placeholder.svg"}
                        alt={s.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                    <CardContent className="space-y-1 p-4">
                      <div className="font-medium">{s.name}</div>
                      <div className="text-sm text-muted-foreground">{s.category}</div>
                      <div className="text-sm font-semibold">GHS {s.priceGHS}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
              {data.services.length === 0 ? (
                <div className="rounded-2xl border p-5 text-sm text-muted-foreground">
                  No service matches.
                </div>
              ) : null}
            </div>
          </section>

          <Separator />

          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Jobs</h2>
              <Badge variant="secondary">{data.jobs.length}</Badge>
            </div>
            <div className="mt-3 grid gap-4 lg:grid-cols-2">
              {data.jobs.map((j) => (
                <Card key={j.id}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">{j.title}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {j.company} · {j.location}
                    </div>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground">
                    <Badge variant="secondary">{j.type.replace("_", " ")}</Badge>
                  </CardContent>
                </Card>
              ))}
              {data.jobs.length === 0 ? (
                <div className="rounded-2xl border p-5 text-sm text-muted-foreground">
                  No job matches.
                </div>
              ) : null}
            </div>
          </section>
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border p-6 text-sm text-muted-foreground">
          Enter a search term to begin.
        </div>
      )}
    </div>
  );
}

