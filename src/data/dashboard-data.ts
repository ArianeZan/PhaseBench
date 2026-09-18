import type { BenchmarkCatalog } from "./benchmark-repository";
import { getBenchmarkRepository } from "./repository";
import type { DailyModelSummary } from "@/domain/metrics";
import type { AiModel } from "@/domain/models";
import { developmentPhases, type DevelopmentPhase } from "@/domain/phases";
import type { RecommendationPriority } from "@/domain/priorities";
import {
  calculateRecommendationChange,
  type RecommendationChange,
} from "@/domain/recommendation-change";
import { recommendByPhase } from "@/domain/recommendation-engine";
import type {
  PhaseRecommendation,
  RecommendedStack,
  StackPhaseEstimate,
} from "@/domain/recommendations";
import { calculateRecommendedStack } from "@/domain/stack";
import type { Provider } from "@/domain/providers";

export type DashboardRecommendation = Readonly<{
  phase: DevelopmentPhase;
  model: AiModel;
  provider: Provider;
  recommendation: PhaseRecommendation;
  summary: DailyModelSummary;
  change: RecommendationChange;
}>;

export type DashboardStackPhase = Readonly<{
  phase: DevelopmentPhase;
  model: AiModel;
  provider: Provider;
  estimate: StackPhaseEstimate;
}>;

export type DashboardData = Readonly<{
  date: string;
  priority: RecommendationPriority;
  catalog: BenchmarkCatalog;
  snapshot: readonly DailyModelSummary[];
  recommendations: readonly PhaseRecommendation[];
  recommendationViews: readonly DashboardRecommendation[];
  stack: RecommendedStack;
  stackViews: readonly DashboardStackPhase[];
}>;

export async function loadDashboardData(
  priority: RecommendationPriority,
): Promise<DashboardData> {
  const repository = getBenchmarkRepository();
  const [catalog, snapshot] = await Promise.all([
    repository.getCatalog(),
    repository.getDailySnapshot(),
  ]);
  const previousDate = shiftDate(snapshot[0]?.date, -1);
  const previousSnapshot = previousDate
    ? await repository.getDailySnapshot({ date: previousDate })
    : [];

  const recommendations = recommendByPhase(snapshot, priority);
  const previousRecommendations = recommendByPhase(previousSnapshot, priority);
  const recommendationViews = recommendations.flatMap((recommendation) => {
    const phase = developmentPhases.find(
      (item) => item.id === recommendation.phaseId,
    );
    const model = catalog.models.find(
      (item) => item.id === recommendation.winner.modelId,
    );
    const provider = catalog.providers.find(
      (item) => item.id === model?.providerId,
    );
    const summary = snapshot.find(
      (item) =>
        item.phaseId === recommendation.phaseId && item.modelId === model?.id,
    );
    return phase && model && provider && summary
      ? [
          {
            phase,
            model,
            provider,
            recommendation,
            summary,
            change: calculateRecommendationChange(
              recommendation,
              previousRecommendations.find(
                (item) => item.phaseId === recommendation.phaseId,
              ),
            ),
          },
        ]
      : [];
  });
  const stack = calculateRecommendedStack(snapshot, priority);
  const stackViews = stack.phases.flatMap((estimate) => {
    const phase = developmentPhases.find(
      (item) => item.id === estimate.phaseId,
    );
    const model = catalog.models.find((item) => item.id === estimate.modelId);
    const provider = catalog.providers.find(
      (item) => item.id === model?.providerId,
    );

    return phase && model && provider
      ? [{ phase, model, provider, estimate }]
      : [];
  });

  return {
    date: snapshot[0]?.date ?? "",
    priority,
    catalog,
    snapshot,
    recommendations,
    recommendationViews,
    stack,
    stackViews,
  };
}

function shiftDate(
  date: string | undefined,
  dayDelta: number,
): string | undefined {
  if (!date) return undefined;
  return new Date(Date.parse(`${date}T00:00:00.000Z`) + dayDelta * 86_400_000)
    .toISOString()
    .slice(0, 10);
}
