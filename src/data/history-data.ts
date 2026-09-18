import { getBenchmarkRepository } from "./repository";
import {
  buildHistorySeries,
  getHistoryDateRange,
  type HistoryMetric,
  type HistoryRangeDays,
  type HistorySeries,
} from "@/domain/history-series";
import type { AiModel } from "@/domain/models";
import type { PhaseId } from "@/domain/phases";

export type HistoryData = Readonly<{
  models: readonly AiModel[];
  series: HistorySeries;
}>;

export async function loadHistoryData(options: {
  phaseId: PhaseId;
  metric: HistoryMetric;
  rangeDays: HistoryRangeDays;
  to: string;
}): Promise<HistoryData> {
  const repository = getBenchmarkRepository();
  const models = await repository.getModels({ statuses: ["active"] });
  const history = await repository.getHistory({
    ...getHistoryDateRange(options.to, options.rangeDays),
    phaseIds: [options.phaseId],
    modelIds: models.map((model) => model.id),
  });

  return {
    models,
    series: buildHistorySeries(history, {
      ...options,
      modelIds: models.map((model) => model.id),
    }),
  };
}
