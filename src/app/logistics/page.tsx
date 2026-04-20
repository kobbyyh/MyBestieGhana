"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sonner } from "@/lib/sonner";

export default function LogisticsPage() {
  const [pickupLocation, setPickupLocation] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [itemType, setItemType] = useState("");
  const [weightKg, setWeightKg] = useState(1);
  const [sizeNote, setSizeNote] = useState("");
  const [notes, setNotes] = useState("");
  const [speed, setSpeed] = useState<"standard" | "express">("standard");
  const [quoteGHS, setQuoteGHS] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const canQuote = useMemo(
    () => pickupLocation.trim() && deliveryLocation.trim() && itemType.trim() && weightKg > 0,
    [pickupLocation, deliveryLocation, itemType, weightKg]
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Logistics</h1>
        <p className="text-sm text-muted-foreground">
          Request delivery/errands. Pricing & tracking are basic (mock).
        </p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Request a delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Pickup location</Label>
              <Input value={pickupLocation} onChange={(e) => setPickupLocation(e.target.value)} placeholder="Eg. Osu, Accra" />
            </div>
            <div className="space-y-2">
              <Label>Delivery location</Label>
              <Input value={deliveryLocation} onChange={(e) => setDeliveryLocation(e.target.value)} placeholder="Eg. East Legon, Accra" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Item type</Label>
              <Input value={itemType} onChange={(e) => setItemType(e.target.value)} placeholder="Documents, food, parcel…" />
            </div>
            <div className="space-y-2">
              <Label>Weight (kg)</Label>
              <Input
                type="number"
                min={0.1}
                step={0.1}
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(0.1, Number(e.target.value)))}
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Delivery speed</Label>
              <Select
                value={speed}
                onValueChange={(v) => setSpeed(v === "express" ? "express" : "standard")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="express">Express</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Size note (optional)</Label>
              <Input value={sizeNote} onChange={(e) => setSizeNote(e.target.value)} placeholder="Fragile, big box, etc" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Extra instructions (optional)</Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Gate code, landmark, call on arrival…" />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="secondary"
              disabled={!canQuote || loading}
              onClick={async () => {
                setLoading(true);
                const res = await fetch("/api/logistics/quote", {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ pickupLocation, deliveryLocation, itemType, weightKg, speed }),
                });
                setLoading(false);
                if (!res.ok) return sonner.error("Could not calculate quote");
                const data = (await res.json()) as { priceGHS: number };
                setQuoteGHS(data.priceGHS);
              }}
            >
              {loading ? "Calculating..." : "Get price"}
            </Button>

            <div className="text-sm">
              <span className="text-muted-foreground">Estimated price:</span>{" "}
              <span className="font-semibold">{quoteGHS ? `GHS ${quoteGHS}` : "—"}</span>
            </div>
          </div>

          <Button
            className="w-full"
            disabled={!quoteGHS || loading}
            onClick={async () => {
              if (!quoteGHS) return;
              setLoading(true);
              const res = await fetch("/api/logistics/book", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  pickupLocation,
                  deliveryLocation,
                  itemType,
                  weightKg,
                  speed,
                  sizeNote,
                  notes,
                  priceGHS: quoteGHS,
                }),
              });
              setLoading(false);
              if (!res.ok) return sonner.error("Please log in to request delivery.");
              const data = (await res.json()) as { trackingCode: string };
              sonner.success("Request created", `Tracking: ${data.trackingCode}`);
              window.location.href = "/dashboard";
            }}
          >
            Request delivery
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

