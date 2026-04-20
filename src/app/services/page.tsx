import Link from "next/link";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { mockServices } from "@/lib/mock-data";

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div>
        <h1 className="text-2xl font-semibold">Services</h1>
        <p className="text-sm text-muted-foreground">Book trusted service providers.</p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {mockServices.map((s) => (
          <Link key={s.id} href={`/services/${s.id}`}>
            <Card className="h-full overflow-hidden hover:bg-accent">
              <div className="relative aspect-[3/2] bg-muted">
                <Image
                  src={s.images[0]}
                  alt={s.name}
                  fill
                  sizes="(max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
              <CardContent className="space-y-2 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="font-medium">{s.name}</div>
                  <Badge variant="secondary">GHS {s.priceGHS}</Badge>
                </div>
                <div className="line-clamp-2 text-sm text-muted-foreground">{s.description}</div>
                <div className="text-xs text-muted-foreground">
                  {s.category} · {s.provider}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

