import type { DevelopmentPhase } from "@/domain/phases";

type PhaseCardProps = {
  index: number;
  phase: DevelopmentPhase;
};

export function PhaseCard({ index, phase }: PhaseCardProps) {
  return (
    <article className="rounded-card border border-border bg-surface p-5 shadow-card sm:p-6">
      <div className="mb-8 flex items-center justify-between">
        <span className="text-label font-mono text-text-muted">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
      </div>
      <h2 className="text-heading font-semibold">{phase.name}</h2>
      <p className="text-body mt-2 text-text-muted">{phase.description}</p>
    </article>
  );
}
