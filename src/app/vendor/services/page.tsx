"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sonner } from "@/lib/sonner";

type Service = {
  id: string;
  name: string;
  description: string;
  priceGHS: number;
  category: string;
  location: string | null;
  isActive: boolean;
};

export default function VendorServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/vendor/services", { cache: "no-store" });
    setLoading(false);
    if (!res.ok) return setServices([]);
    const data = (await res.json()) as { services: Service[] };
    setServices(data.services);
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
          <h1 className="text-2xl font-semibold">Vendor Services</h1>
          <p className="text-sm text-muted-foreground">Manage your service listings.</p>
        </div>
        <CreateService onCreated={load} />
      </div>

      <div className="mt-6 grid gap-3">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">Loading…</CardContent>
          </Card>
        ) : services.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground">No services yet.</CardContent>
          </Card>
        ) : (
          services.map((s) => (
            <Card key={s.id}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">{s.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm text-muted-foreground">
                  {s.category} · GHS {s.priceGHS} · {s.location ?? "—"} ·{" "}
                  {s.isActive ? "Active" : "Hidden"}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={async () => {
                      const res = await fetch(`/api/vendor/services/${s.id}`, {
                        method: "PATCH",
                        headers: { "content-type": "application/json" },
                        body: JSON.stringify({ isActive: !s.isActive }),
                      });
                      if (!res.ok) return sonner.error("Could not update");
                      load();
                    }}
                  >
                    {s.isActive ? "Hide" : "Publish"}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={async () => {
                      const res = await fetch(`/api/vendor/services/${s.id}`, { method: "DELETE" });
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

function CreateService({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [priceGHS, setPriceGHS] = useState(10);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add service</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>New service</DialogTitle>
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
            <Label>Location (optional)</Label>
            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Accra, Kumasi…" />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const res = await fetch("/api/vendor/services", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name, category, priceGHS, description, location: location || undefined }),
              });
              setLoading(false);
              if (!res.ok) return sonner.error("Could not create service");
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

