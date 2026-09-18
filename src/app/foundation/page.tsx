import type { Metadata } from "next";

import { ProviderBadge } from "@/components/provider-badge";
import { ThemeControl } from "@/components/theme-control";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { providers } from "@/domain/providers";

export const metadata: Metadata = {
  title: "Interface foundation — PhaseBench",
  description: "PhaseBench interface primitives and visual foundations.",
};

export default function FoundationPage() {
  return (
    <main className="py-section min-h-screen bg-background text-foreground">
      <Container>
        <div className="flex items-center justify-between gap-4">
          <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
            M0 interface foundation
          </p>
          <ThemeControl />
        </div>
        <h1 className="text-display mt-4 max-w-3xl font-semibold text-balance">
          Reusable, accessible building blocks.
        </h1>
        <p className="text-body-lg mt-6 max-w-2xl text-text-muted">
          This route is a lightweight visual fixture for the primitives used by
          PhaseBench.
        </p>

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          <Card as="section" className="p-6" aria-labelledby="actions-title">
            <h2 id="actions-title" className="text-heading font-semibold">
              Actions and status
            </h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button>Primary action</Button>
              <Button variant="secondary">Secondary action</Button>
              <Button disabled>Unavailable</Button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Badge>Balanced</Badge>
              <Badge className="border-success text-success">Reliable</Badge>
              <Badge className="border-warning text-warning">Review</Badge>
            </div>
          </Card>

          <Card as="section" className="p-6" aria-labelledby="providers-title">
            <h2 id="providers-title" className="text-heading font-semibold">
              Provider identities
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {providers.map((provider) => (
                <ProviderBadge key={provider.id} provider={provider} />
              ))}
            </div>
          </Card>
        </div>
      </Container>
    </main>
  );
}
