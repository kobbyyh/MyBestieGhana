import { notFound } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockProducts } from "@/lib/mock-data";
import { AddToCart } from "./add-to-cart";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = mockProducts.find((p) => p.id === id);
  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/3] bg-muted">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{product.category}</Badge>
              <div className="text-xs text-muted-foreground">
                {product.ratingAvg.toFixed(1)}★
              </div>
            </div>
            <h1 className="text-3xl font-semibold">{product.name}</h1>
            <div className="text-xl font-semibold">GHS {product.priceGHS}</div>
            <p className="text-sm text-muted-foreground">{product.description}</p>
          </div>

          <Separator />
          <AddToCart productId={product.id} />

          <Separator />
          <Card>
            <CardContent className="space-y-2 p-5">
              <div className="font-medium">Reviews</div>
              <div className="text-sm text-muted-foreground">
                Coming soon (ratings + reviews for products).
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

