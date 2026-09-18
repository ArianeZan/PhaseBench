import { BrandMark } from "@/components/brand-mark";
import { PhaseCard } from "@/components/phase-card";
import { developmentPhases } from "@/domain/phases";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <BrandMark />
        <span className="rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-400">
          Foundation in progress
        </span>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-5 py-16 sm:px-8 sm:py-24 lg:px-10">
        <section aria-labelledby="hero-title" className="max-w-4xl">
          <p className="mb-5 font-mono text-xs font-semibold tracking-[0.22em] text-cyan-300 uppercase sm:text-sm">
            AI model intelligence for software teams
          </p>
          <h1
            id="hero-title"
            className="max-w-3xl text-5xl leading-[0.98] font-semibold tracking-[-0.045em] text-balance sm:text-7xl lg:text-8xl"
          >
            The right AI model for every phase.
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg sm:leading-8">
            PhaseBench turns reproducible benchmarks into daily recommendations
            for every stage of AI-assisted development.
          </p>
        </section>

        <section
          aria-label="Development phases"
          className="mt-14 grid gap-3 sm:mt-20 sm:grid-cols-3"
        >
          {developmentPhases.map((phase, index) => (
            <PhaseCard
              key={phase.name}
              index={index}
              phase={phase}
            />
          ))}
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-6xl items-center justify-between border-t border-slate-800 px-5 py-5 text-xs text-slate-500 sm:px-8 lg:px-10">
        <span>PhaseBench</span>
        <span>Debate · Plan · Build</span>
      </footer>
    </div>
  );
}
