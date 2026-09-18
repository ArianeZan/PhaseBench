import type { ComparisonRow } from "@/data/comparison-data";

export function ComparisonTable({
  rows,
}: Readonly<{ rows: readonly ComparisonRow[] }>) {
  return (
    <div className="mt-6 overflow-x-auto rounded-card border border-border">
      <table className="w-full min-w-[64rem] border-collapse text-left text-label">
        <caption className="sr-only">
          Daily model comparison by development phase
        </caption>
        <thead className="bg-surface-muted text-text-muted">
          <tr>
            {[
              "Phase",
              "Rank",
              "Model",
              "Provider",
              "Score",
              "Quality",
              "Cost / task",
              "Latency",
              "Reliability",
            ].map((heading) => (
              <th
                key={heading}
                className="border-b border-border px-4 py-3 font-semibold"
              >
                {heading}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={`${row.phase.id}:${row.model.id}`}
              className={row.isWinner ? "bg-surface-muted" : "bg-surface"}
            >
              <th
                scope="row"
                className="border-b border-border px-4 py-4 font-semibold"
              >
                {row.phase.name}
              </th>
              <td className="border-b border-border px-4 py-4">
                <span className="font-mono">#{row.ranking.rank}</span>
                {row.isWinner && (
                  <span className="ml-2 rounded-control bg-success px-2 py-1 text-[0.7rem] font-semibold text-white uppercase">
                    Winner
                  </span>
                )}
              </td>
              <td className="border-b border-border px-4 py-4 font-semibold">
                {row.model.name}
              </td>
              <td className="border-b border-border px-4 py-4">
                {row.provider.name}
              </td>
              <Metric value={row.ranking.score.toFixed(1)} />
              <Metric
                value={format(row.summary.metrics.qualityScore, "/100")}
              />
              <Metric value={format(row.summary.metrics.costUsd, "", "$", 4)} />
              <Metric
                value={format(row.summary.metrics.latencyMs, " ms", "", 0)}
              />
              <Metric
                value={format(row.summary.metrics.stabilityScore, "/100")}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
function Metric({ value }: Readonly<{ value: string }>) {
  return (
    <td className="border-b border-border px-4 py-4 font-mono tabular-nums">
      {value}
    </td>
  );
}
function format(
  value: number | null,
  suffix: string,
  prefix = "",
  decimals = 1,
) {
  return value === null
    ? "No data"
    : `${prefix}${value.toFixed(decimals)}${suffix}`;
}
