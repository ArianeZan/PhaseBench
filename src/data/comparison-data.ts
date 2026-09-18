import { getBenchmarkRepository } from "./repository";
import type { DailyModelSummary } from "@/domain/metrics";
import type { AiModel } from "@/domain/models";
import { developmentPhases, type DevelopmentPhase } from "@/domain/phases";
import type { RecommendationPriority } from "@/domain/priorities";
import { rankModels } from "@/domain/ranking";
import type { RankedModel } from "@/domain/recommendations";
import type { Provider } from "@/domain/providers";

export type ComparisonRow = Readonly<{
  phase: DevelopmentPhase;
  model: AiModel;
  provider: Provider;
  summary: DailyModelSummary;
  ranking: RankedModel;
  isWinner: boolean;
}>;
export type ComparisonData = Readonly<{
  date: string;
  priority: RecommendationPriority;
  rows: readonly ComparisonRow[];
}>;

export async function loadComparisonData(
  priority: RecommendationPriority,
): Promise<ComparisonData> {
  const repository = getBenchmarkRepository();
  const [catalog, snapshot] = await Promise.all([
    repository.getCatalog(),
    repository.getDailySnapshot(),
  ]);
  const rows = developmentPhases.flatMap((phase) =>
    rankModels(
      snapshot.filter((summary) => summary.phaseId === phase.id),
      priority,
    ).flatMap((ranking) => {
      const model = catalog.models.find((item) => item.id === ranking.modelId);
      const provider = catalog.providers.find(
        (item) => item.id === model?.providerId,
      );
      const summary = snapshot.find(
        (item) => item.phaseId === phase.id && item.modelId === ranking.modelId,
      );
      return model && provider && summary
        ? [
            {
              phase,
              model,
              provider,
              summary,
              ranking,
              isWinner: ranking.rank === 1,
            },
          ]
        : [];
    }),
  );
  return { date: snapshot[0]?.date ?? "", priority, rows };
}
