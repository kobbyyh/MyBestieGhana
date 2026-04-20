"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { sonner } from "@/lib/sonner";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "VENDOR">("CUSTOMER");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create your account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or phone</Label>
            <Input
              id="identifier"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              placeholder="you@email.com or +233..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v === "VENDOR" ? "VENDOR" : "CUSTOMER")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CUSTOMER">Customer</SelectItem>
                <SelectItem value="VENDOR">Vendor / Service Provider</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            className="w-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name, identifier: emailOrPhone, password, role }),
              });
              setLoading(false);

              if (!res.ok) {
                const data = (await res.json().catch(() => null)) as
                  | { error?: string }
                  | null;
                return sonner.error(data?.error ?? "Signup failed");
              }
              sonner.success("Account created", "You can now log in.");
              window.location.href = "/auth/login";
            }}
          >
            {loading ? "Creating..." : "Create account"}
          </Button>

          <div className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link className="text-foreground underline" href="/auth/login">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

