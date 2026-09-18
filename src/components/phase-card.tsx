import type { DevelopmentPhase } from "@/domain/phases";

type PhaseCardProps = {
  index: number;
  phase: DevelopmentPhase;
};

export function PhaseCard({ index, phase }: PhaseCardProps) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
      <div className="mb-8 flex items-center justify-between">
        <span className="font-mono text-xs text-slate-500">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span aria-hidden="true" className="size-2 rounded-full bg-cyan-300" />
      </div>
      <h2 className="text-xl font-semibold">{phase.name}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">
        {phase.description}
      </p>
    </article>
  );
}
