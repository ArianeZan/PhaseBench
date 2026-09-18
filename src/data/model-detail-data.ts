import { getBenchmarkRepository } from "./repository";
import type { AiModel, ModelId } from "@/domain/models";
import type { Provider } from "@/domain/providers";
import type { BenchmarkRun, BenchmarkSuite } from "@/domain/benchmarks";
import type { DailyModelSummary } from "@/domain/metrics";
import { developmentPhases, type DevelopmentPhase } from "@/domain/phases";
import { rankModels } from "@/domain/ranking";

export type ModelIdentity = Readonly<{ model: AiModel; provider: Provider }>;
export type ModelPhaseProfile = Readonly<{
  phase: DevelopmentPhase;
  summary: DailyModelSummary;
  balancedRank: number | null;
  qualityChange: number | null;
}>;
export type ModelRunProfile = Readonly<{
  run: BenchmarkRun;
  suite: BenchmarkSuite;
  averageQuality: number | null;
  totalCostUsd: number;
  totalDurationMs: number;
}>;
export type ModelProfile = ModelIdentity &
  Readonly<{
    updatedOn: string;
    phases: readonly ModelPhaseProfile[];
    recentRuns: readonly ModelRunProfile[];
  }>;

export async function loadModelIdentity(
  modelId: ModelId,
): Promise<ModelIdentity | null> {
  const repository = getBenchmarkRepository();
  const [model, catalog] = await Promise.all([
    repository.getModelById(modelId),
    repository.getCatalog(),
  ]);
  if (!model) return null;
  const provider = catalog.providers.find(
    (item) => item.id === model.providerId,
  );
  return provider ? { model, provider } : null;
}

export async function listModelIds(): Promise<readonly ModelId[]> {
  return (await getBenchmarkRepository().getModels()).map((model) => model.id);
}

export async function loadModelProfile(
  modelId: ModelId,
): Promise<ModelProfile | null> {
  const repository = getBenchmarkRepository();
  const [identity, catalog, snapshot, recentRuns] = await Promise.all([
    loadModelIdentity(modelId),
    repository.getCatalog(),
    repository.getDailySnapshot(),
    repository.getBenchmarkRuns({ modelIds: [modelId], limit: 3 }),
  ]);
  if (!identity) return null;
  const updatedOn = snapshot[0]?.date ?? "";
  const from = updatedOn ? shiftDate(updatedOn, -29) : "";
  const history = updatedOn
    ? await repository.getHistory({ from, to: updatedOn, modelIds: [modelId] })
    : [];
  const phases = developmentPhases.flatMap((phase) => {
    const summary = snapshot.find(
      (item) => item.modelId === modelId && item.phaseId === phase.id,
    );
    if (!summary) return [];
    const ranking = rankModels(
      snapshot.filter((item) => item.phaseId === phase.id),
      "balanced",
    ).find((item) => item.modelId === modelId);
    const phaseHistory = history
      .filter((item) => item.phaseId === phase.id)
      .toSorted((a, b) => a.date.localeCompare(b.date));
    const first = phaseHistory[0]?.metrics.qualityScore;
    const last = phaseHistory.at(-1)?.metrics.qualityScore;
    return [
      {
        phase,
        summary,
        balancedRank: ranking?.rank ?? null,
        qualityChange:
          first === null ||
          first === undefined ||
          last === null ||
          last === undefined
            ? null
            : Math.round((last - first) * 100) / 100,
      },
    ];
  });
  const runs = recentRuns.flatMap((run) => {
    const suite = catalog.suites.find((item) => item.id === run.suiteId);
    if (!suite) return [];
    return [
      {
        run,
        suite,
        averageQuality: run.results.length
          ? run.results.reduce((sum, result) => sum + result.qualityScore, 0) /
            run.results.length
          : null,
        totalCostUsd: run.results.reduce(
          (sum, result) => sum + result.costUsd,
          0,
        ),
        totalDurationMs: run.results.reduce(
          (sum, result) => sum + result.latencyMs,
          0,
        ),
      },
    ];
  });
  return { ...identity, updatedOn, phases, recentRuns: runs };
}

function shiftDate(date: string, days: number): string {
  return new Date(Date.parse(`${date}T00:00:00.000Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}
