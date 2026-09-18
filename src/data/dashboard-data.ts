import type { BenchmarkCatalog } from "./benchmark-repository";
import { getBenchmarkRepository } from "./repository";
import type { DailyModelSummary } from "@/domain/metrics";
import type { AiModel } from "@/domain/models";
import { developmentPhases, type DevelopmentPhase } from "@/domain/phases";
import type { RecommendationPriority } from "@/domain/priorities";
import { recommendByPhase } from "@/domain/recommendation-engine";
import type {
  PhaseRecommendation,
  RecommendedStack,
} from "@/domain/recommendations";
import { calculateRecommendedStack } from "@/domain/stack";
import type { Provider } from "@/domain/providers";

export type DashboardRecommendation = Readonly<{
  phase: DevelopmentPhase;
  model: AiModel;
  provider: Provider;
  recommendation: PhaseRecommendation;
  summary: DailyModelSummary;
}>;

export type DashboardData = Readonly<{
  date: string;
  priority: RecommendationPriority;
  catalog: BenchmarkCatalog;
  snapshot: readonly DailyModelSummary[];
  recommendations: readonly PhaseRecommendation[];
  recommendationViews: readonly DashboardRecommendation[];
  stack: RecommendedStack;
}>;

export async function loadDashboardData(
  priority: RecommendationPriority,
): Promise<DashboardData> {
  const repository = getBenchmarkRepository();
  const [catalog, snapshot] = await Promise.all([
    repository.getCatalog(),
    repository.getDailySnapshot(),
  ]);

  const recommendations = recommendByPhase(snapshot, priority);
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
      ? [{ phase, model, provider, recommendation, summary }]
      : [];
  });

  return {
    date: snapshot[0]?.date ?? "",
    priority,
    catalog,
    snapshot,
    recommendations,
    recommendationViews,
    stack: calculateRecommendedStack(snapshot, priority),
  };
}
