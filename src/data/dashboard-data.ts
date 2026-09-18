import type { BenchmarkCatalog } from "./benchmark-repository";
import { getBenchmarkRepository } from "./repository";
import type { DailyModelSummary } from "@/domain/metrics";
import type { RecommendationPriority } from "@/domain/priorities";
import { recommendByPhase } from "@/domain/recommendation-engine";
import type {
  PhaseRecommendation,
  RecommendedStack,
} from "@/domain/recommendations";
import { calculateRecommendedStack } from "@/domain/stack";

export type DashboardData = Readonly<{
  date: string;
  priority: RecommendationPriority;
  catalog: BenchmarkCatalog;
  snapshot: readonly DailyModelSummary[];
  recommendations: readonly PhaseRecommendation[];
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

  return {
    date: snapshot[0]?.date ?? "",
    priority,
    catalog,
    snapshot,
    recommendations: recommendByPhase(snapshot, priority),
    stack: calculateRecommendedStack(snapshot, priority),
  };
}
