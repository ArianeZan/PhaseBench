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

export type HistoryVisualProps = Readonly<{
  label: string;
  models: readonly { id: string; name: string }[];
  rows: readonly Record<string, string | number | null>[];
  series: readonly { modelId: string }[];
  unit: string;
}>;
const colors = [
  "var(--pb-color-provider-openai)",
  "var(--pb-color-provider-anthropic)",
  "var(--pb-color-provider-google)",
  "var(--pb-color-provider-generic)",
];

export function HistoryVisualChart(props: HistoryVisualProps) {
  const names = new Map(props.models.map((model) => [model.id, model.name]));
  const unit =
    props.unit === "percent"
      ? "%"
      : props.unit === "USD"
        ? "$"
        : props.unit === "milliseconds"
          ? "ms"
          : "";
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={props.rows}
        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
      >
        <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => String(value).slice(5)}
          minTickGap={24}
        />
        <YAxis unit={unit} width={64} />
        <Tooltip
          labelFormatter={(value) => String(value)}
          formatter={(value, name) => [
            formatHistoryValue(Number(value), props.unit),
            names.get(String(name)) ?? name,
          ]}
        />
        {props.series.map((series, index) => (
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
  );
}

function formatHistoryValue(value: number, unit: string) {
  return unit === "USD"
    ? `$${value.toFixed(4)}`
    : unit === "milliseconds"
      ? `${Math.round(value)} ms`
      : unit === "percent"
        ? `${value.toFixed(1)}%`
        : value.toFixed(1);
}
