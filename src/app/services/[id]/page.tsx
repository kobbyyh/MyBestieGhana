import { notFound } from "next/navigation";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { mockServices } from "@/lib/mock-data";
import { BookNow } from "./book-now";

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = mockServices.find((s) => s.id === id);
  if (!service) return notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="relative aspect-[4/3] bg-muted">
            <Image
              src={service.images[0]}
              alt={service.name}
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
              <Badge variant="secondary">{service.category}</Badge>
              <Badge variant="outline">{service.provider}</Badge>
            </div>
            <h1 className="text-3xl font-semibold">{service.name}</h1>
            <div className="text-xl font-semibold">GHS {service.priceGHS}</div>
            <p className="text-sm text-muted-foreground">{service.description}</p>
          </div>

          <Separator />
          <Card>
            <CardContent className="space-y-3 p-5">
              <div className="font-medium">Book this service</div>
              <BookNow serviceId={service.id} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-2 p-5">
              <div className="font-medium">Reviews</div>
              <div className="text-sm text-muted-foreground">
                Coming soon (ratings + reviews for services).
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

