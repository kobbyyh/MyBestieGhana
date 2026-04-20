import Link from "next/link";

import { Separator } from "@/components/ui/separator";

export function SiteFooter() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <div className="text-sm font-semibold">MyBestie Ghana</div>
            <p className="text-sm text-muted-foreground">
              Everything you need, one bestie away.
            </p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-semibold">Company</div>
            <div className="grid gap-1">
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                About
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Contact
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Terms
              </Link>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-semibold">Explore</div>
            <div className="grid gap-1">
              <Link className="text-muted-foreground hover:text-foreground" href="/shop">
                Shop
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="/services"
              >
                Services
              </Link>
              <Link
                className="text-muted-foreground hover:text-foreground"
                href="/jobs"
              >
                Jobs
              </Link>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="font-semibold">Socials</div>
            <div className="grid gap-1">
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                Instagram
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                X (Twitter)
              </Link>
              <Link className="text-muted-foreground hover:text-foreground" href="#">
                TikTok
              </Link>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} MyBestie Ghana. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

