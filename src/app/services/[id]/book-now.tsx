"use client";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { sonner } from "@/lib/sonner";

export function BookNow({ serviceId }: { serviceId: string }) {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("10:00");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const scheduledAtIso = useMemo(() => {
    if (!date) return null;
    const [h, m] = time.split(":").map((x) => Number(x));
    const dt = new Date(date);
    dt.setHours(h || 0, m || 0, 0, 0);
    return dt.toISOString();
  }, [date, time]);

  return (
    <div className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="text-sm font-medium">Date</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium">Time</div>
          <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Notes (optional)</div>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special instructions?" />
      </div>

      <Button
        className="w-full sm:w-auto"
        disabled={!scheduledAtIso || loading}
        onClick={async () => {
          if (!scheduledAtIso) return;
          setLoading(true);
          const res = await fetch("/api/bookings", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ serviceId, scheduledAt: scheduledAtIso, notes }),
          });
          setLoading(false);
          if (!res.ok) return sonner.error("Please log in to book.");
          sonner.success("Booking requested");
          window.location.href = "/dashboard";
        }}
      >
        {loading ? "Booking..." : "Book now"}
      </Button>
    </div>
  );
}

