import { HistoryVisualLoader } from "@/components/history-visual-loader";
import type { HistoryData } from "@/data/history-data";

const colors = [
  "var(--pb-color-provider-openai)",
  "var(--pb-color-provider-anthropic)",
  "var(--pb-color-provider-google)",
  "var(--pb-color-provider-generic)",
];

export function HistoryChart({ data }: Readonly<{ data: HistoryData }>) {
  const rows = data.series.dates.map((date, index) =>
    Object.fromEntries([
      ["date", date],
      ...data.series.models.map((series) => [
        series.modelId,
        series.points[index]?.value ?? null,
      ]),
    ]),
  );
  const names = new Map(data.models.map((model) => [model.id, model.name]));
  return (
    <>
      <HistoryVisualLoader
        label={`${data.series.metric} history from ${data.series.from} to ${data.series.to}`}
        models={data.models.map(({ id, name }) => ({ id, name }))}
        rows={rows}
        series={data.series.models.map(({ modelId }) => ({ modelId }))}
        unit={data.series.unit}
      />
      <ul
        className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-label"
        aria-label="Chart legend"
      >
        {data.series.models.map((series, index) => (
          <li key={series.modelId} className="flex items-center gap-2">
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
              aria-hidden="true"
            />
            {names.get(series.modelId)}
          </li>
        ))}
      </ul>
      <details className="mt-5 border-t border-border pt-4">
        <summary className="cursor-pointer font-semibold">
          View values as a table
        </summary>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-max text-left text-label">
            <thead>
              <tr>
                <th className="p-2">Date</th>
                {data.models.map((model) => (
                  <th className="p-2" key={model.id}>
                    {model.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr className="border-t border-border" key={String(row.date)}>
                  <th className="p-2 font-normal">{String(row.date)}</th>
                  {data.series.models.map((series) => (
                    <td className="p-2 font-mono" key={series.modelId}>
                      {row[series.modelId] === null
                        ? "No data"
                        : formatHistoryValue(
                            Number(row[series.modelId]),
                            data.series.unit,
                          )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

export function formatHistoryValue(value: number, unit: string) {
  return unit === "USD"
    ? `$${value.toFixed(4)}`
    : unit === "milliseconds"
      ? `${Math.round(value)} ms`
      : unit === "percent"
        ? `${value.toFixed(1)}%`
        : value.toFixed(1);
}
