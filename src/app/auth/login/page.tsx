"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sonner } from "@/lib/sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identifier">Email or phone</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
          <Button
            className="w-full"
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              const res = await signIn("credentials", {
                redirect: false,
                identifier,
                password,
                callbackUrl: next,
              });
              setLoading(false);
              if (!res?.ok) return sonner.error("Invalid login details");
              window.location.href = res.url ?? next;
            }}
          >
            {loading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="text-sm text-muted-foreground">
            No account?{" "}
            <Link className="text-foreground underline" href="/auth/signup">
              Create one
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

