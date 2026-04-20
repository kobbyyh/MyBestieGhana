"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sonner } from "@/lib/sonner";

export function ApplyDialog({ jobId }: { jobId: string }) {
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Apply</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Apply to job</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Full name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Phone (optional)</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Cover letter (optional)</Label>
            <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label>Upload CV (placeholder)</Label>
            <Input type="file" disabled />
            <div className="text-xs text-muted-foreground">
              For production, store files in S3/Cloudinary/UploadThing and save the URL.
            </div>
          </div>
          <Button
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const res = await fetch("/api/jobs/apply", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ jobId, fullName, email, phone, coverLetter }),
              });
              setLoading(false);
              if (!res.ok) return sonner.error("Please log in to apply.");
              sonner.success("Application submitted");
              setOpen(false);
            }}
          >
            {loading ? "Submitting..." : "Submit application"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

