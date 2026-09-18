import { getBenchmarkRepository } from "./repository";
import type { AiModel, ModelId } from "@/domain/models";
import type { Provider } from "@/domain/providers";

export type ModelIdentity = Readonly<{ model: AiModel; provider: Provider }>;

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
