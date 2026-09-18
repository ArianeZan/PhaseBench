import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { BrandMark } from "@/components/brand-mark";
import {
  ProductNavigation,
  ProductNavigationFallback,
} from "@/components/product-navigation";
import { ThemeControl } from "@/components/theme-control";
import { Container } from "@/components/ui/container";

type AppShellProps = Readonly<{
  children: ReactNode;
}>;

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border bg-background/95">
        <Container className="flex min-h-20 flex-wrap items-center gap-4 py-4">
          <Link
            aria-label="PhaseBench dashboard"
            className="rounded-control focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            href="/"
          >
            <BrandMark />
          </Link>
          <Suspense fallback={<ProductNavigationFallback />}>
            <ProductNavigation />
          </Suspense>
          <div className="ml-auto md:ml-0">
            <ThemeControl />
          </div>
        </Container>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border">
        <Container className="text-label flex flex-col gap-2 py-6 text-text-muted sm:flex-row sm:items-center sm:justify-between">
          <span>PhaseBench · Synthetic benchmark data</span>
          <span>Debate · Plan · Build</span>
        </Container>
      </footer>
    </div>
  );
}
