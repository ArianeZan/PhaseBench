const phases = [
  {
    name: "Debate",
    description: "Critical thinking, counterarguments, and alternatives.",
  },
  {
    name: "Plan",
    description: "Architecture, decomposition, clarity, and risk management.",
  },
  {
    name: "Build",
    description: "Implementation, repository changes, testing, and debugging.",
  },
] as const;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-cyan-300 font-mono text-sm font-black text-slate-950"
          >
            PB
          </span>
          <span className="text-sm font-semibold tracking-[0.18em] uppercase">
            PhaseBench
          </span>
        </div>
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
          {phases.map((phase, index) => (
            <article
              key={phase.name}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="font-mono text-xs text-slate-500">
                  0{index + 1}
                </span>
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full bg-cyan-300"
                />
              </div>
              <h2 className="text-xl font-semibold">{phase.name}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {phase.description}
              </p>
            </article>
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
