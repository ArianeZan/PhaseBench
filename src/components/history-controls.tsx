import Link from "next/link";

import { historyMetrics, historyRanges } from "@/domain/history-series";
import { developmentPhases, type PhaseId } from "@/domain/phases";
import type { RecommendationPriority } from "@/domain/priorities";

type Props = Readonly<{
  phase: PhaseId;
  metric: string;
  range: number;
  priority: RecommendationPriority;
}>;

export function HistoryControls({ phase, metric, range, priority }: Props) {
  const link = (updates: Record<string, string>) =>
    `/?${new URLSearchParams({ priority, phase, metric, range: String(range), ...updates })}`;
  return (
    <div className="mt-5 grid gap-4 lg:grid-cols-3">
      <Control label="Phase">
        {developmentPhases.map((item) => (
          <Choice
            key={item.id}
            href={link({ phase: item.id })}
            selected={phase === item.id}
          >
            {item.name}
          </Choice>
        ))}
      </Control>
      <Control label="Metric">
        {historyMetrics.map((item) => (
          <Choice
            key={item.key}
            href={link({ metric: item.key })}
            selected={metric === item.key}
          >
            {item.label}
          </Choice>
        ))}
      </Control>
      <Control label="Range">
        {historyRanges.map((days) => (
          <Choice
            key={days}
            href={link({ range: String(days) })}
            selected={range === days}
          >
            {days} days
          </Choice>
        ))}
      </Control>
    </div>
  );
}

function Control({
  label,
  children,
}: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <fieldset>
      <legend className="text-label mb-2 font-mono text-text-muted uppercase">
        {label}
      </legend>
      <div className="flex flex-wrap gap-2">{children}</div>
    </fieldset>
  );
}

function Choice({
  href,
  selected,
  children,
}: Readonly<{ href: string; selected: boolean; children: React.ReactNode }>) {
  return (
    <Link
      href={href}
      aria-current={selected ? "true" : undefined}
      className={`rounded-control min-h-11 border px-3 py-2 text-label font-medium transition-colors ${selected ? "border-accent bg-accent text-accent-foreground" : "border-border bg-surface hover:bg-surface-muted"}`}
    >
      {children}
    </Link>
  );
}
