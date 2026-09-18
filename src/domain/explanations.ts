import type { MetricKey, ModelMetrics } from "./metrics";
import type { RecommendationPriority } from "./priorities";
import type { MetricUnit, RecommendationReason } from "./recommendations";

const priorityMetrics: Readonly<
  Record<RecommendationPriority, readonly MetricKey[]>
> = {
  quality: [
    "qualityScore",
    "taskPassRate",
    "judgeScore",
    "automatedTestPassRate",
  ],
  value: ["costUsd", "qualityScore", "taskPassRate", "automatedTestPassRate"],
  speed: ["latencyMs", "qualityScore", "stabilityScore"],
  reliability: ["stabilityScore", "taskPassRate", "averageAttempts"],
  balanced: ["qualityScore", "costUsd", "latencyMs", "stabilityScore"],
};

const metricUnits: Readonly<Record<MetricKey, MetricUnit>> = {
  qualityScore: "score",
  taskPassRate: "percent",
  automatedTestPassRate: "percent",
  judgeScore: "score",
  costUsd: "USD",
  latencyMs: "milliseconds",
  inputTokens: "tokens",
  outputTokens: "tokens",
  averageAttempts: "attempts",
  stabilityScore: "score",
};

export function explainRecommendation(
  metrics: ModelMetrics,
  priority: RecommendationPriority,
): readonly RecommendationReason[] {
  const reasons = priorityMetrics[priority].flatMap((metric) => {
    const value = metrics[metric];
    return value === null
      ? []
      : [
          {
            metric,
            value,
            unit: metricUnits[metric],
            message: message(metric, value),
          },
        ];
  });

  if (reasons.length < 2) {
    throw new Error("A recommendation needs at least two verifiable metrics.");
  }

  return reasons.slice(0, 3);
}

function message(metric: MetricKey, value: number): string {
  switch (metric) {
    case "qualityScore":
      return `Quality score: ${format(value)}/100.`;
    case "taskPassRate":
      return `Task pass rate: ${format(value)}%.`;
    case "automatedTestPassRate":
      return `Automated-test pass rate: ${format(value)}%.`;
    case "judgeScore":
      return `AI judge score: ${format(value)}/100.`;
    case "costUsd":
      return `Estimated cost per task: $${format(value, 4)}.`;
    case "latencyMs":
      return `End-to-end latency: ${format(value, 0)} ms.`;
    case "inputTokens":
      return `Input size: ${format(value, 0)} tokens.`;
    case "outputTokens":
      return `Output size: ${format(value, 0)} tokens.`;
    case "averageAttempts":
      return `Average attempts: ${format(value)}.`;
    case "stabilityScore":
      return `Stability score: ${format(value)}/100.`;
  }
}

function format(value: number, maximumDecimals = 2): string {
  return value.toLocaleString("en-US", {
    maximumFractionDigits: maximumDecimals,
    minimumFractionDigits: 0,
    useGrouping: false,
  });
}
