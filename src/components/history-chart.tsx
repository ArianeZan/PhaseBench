"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
      <div
        className="mt-6 h-80 min-w-0"
        role="img"
        aria-label={`${data.series.metric} history from ${data.series.from} to ${data.series.to}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={rows}
            margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) => String(value).slice(5)}
              minTickGap={24}
            />
            <YAxis unit={unitSuffix(data.series.unit)} width={64} />
            <Tooltip
              labelFormatter={(value) => String(value)}
              formatter={(value, name) => [
                formatValue(Number(value), data.series.unit),
                names.get(String(name)) ?? name,
              ]}
            />
            {data.series.models.map((series, index) => (
              <Line
                key={series.modelId}
                dataKey={series.modelId}
                name={series.modelId}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                connectNulls={false}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
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
                        : formatValue(
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

function unitSuffix(unit: string) {
  return unit === "percent"
    ? "%"
    : unit === "USD"
      ? "$"
      : unit === "milliseconds"
        ? "ms"
        : "";
}
function formatValue(value: number, unit: string) {
  return unit === "USD"
    ? `$${value.toFixed(4)}`
    : unit === "milliseconds"
      ? `${Math.round(value)} ms`
      : unit === "percent"
        ? `${value.toFixed(1)}%`
        : value.toFixed(1);
}
