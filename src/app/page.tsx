import { BrandMark } from "@/components/brand-mark";
import { PhaseCard } from "@/components/phase-card";
import { ProviderBadge } from "@/components/provider-badge";
import { developmentPhases } from "@/domain/phases";
import { providers } from "@/domain/providers";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <header className="px-page mx-auto flex w-full max-w-6xl items-center justify-between py-6">
        <BrandMark />
        <span className="text-label rounded-control border border-border px-3 py-1.5 font-medium text-text-muted">
          Foundation in progress
        </span>
      </header>

      <main className="px-page py-section mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center">
        <section aria-labelledby="hero-title" className="max-w-4xl">
          <p className="text-label mb-5 font-mono font-semibold tracking-[0.22em] text-accent uppercase">
            AI model intelligence for software teams
          </p>
          <h1
            id="hero-title"
            className="text-display max-w-3xl font-semibold text-balance"
          >
            The right AI model for every phase.
          </h1>
          <p className="text-body-lg mt-7 max-w-2xl text-text-muted">
            PhaseBench turns reproducible benchmarks into daily recommendations
            for every stage of AI-assisted development.
          </p>
        </section>

        <section
          aria-label="Development phases"
          className="mt-14 grid gap-3 sm:mt-20 sm:grid-cols-3"
        >
          {developmentPhases.map((phase, index) => (
            <PhaseCard key={phase.name} index={index} phase={phase} />
          ))}
        </section>

        <section aria-labelledby="provider-heading" className="mt-10">
          <h2
            id="provider-heading"
            className="text-label font-mono font-semibold tracking-[0.16em] text-text-muted uppercase"
          >
            Initial provider coverage
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {providers.map((provider) => (
              <ProviderBadge key={provider.id} provider={provider} />
            ))}
          </div>
        </section>
      </main>

      <footer className="text-label px-page mx-auto flex w-full max-w-6xl items-center justify-between border-t border-border py-5 text-text-muted">
        <span>PhaseBench</span>
        <span>Debate · Plan · Build</span>
      </footer>
    </div>
  );
}
