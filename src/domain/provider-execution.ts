import type { ModelId } from "./models";
import type { PhaseId } from "./phases";

export type ProviderMessageRole = "system" | "user" | "assistant";

export type ProviderMessage = Readonly<{
  role: ProviderMessageRole;
  content: string;
}>;

export type ModelExecutionConfiguration = Readonly<{
  temperature: number;
  maxOutputTokens: number;
  stopSequences?: readonly string[];
}>;

export type ModelExecutionRequest = Readonly<{
  modelId: ModelId;
  phaseId: PhaseId;
  messages: readonly ProviderMessage[];
  configuration: ModelExecutionConfiguration;
  timeoutMs: number;
  signal?: AbortSignal;
  requestMetadata?: Readonly<Record<string, string>>;
}>;

export type ModelExecutionFinishReason =
  "completed" | "length" | "content-filter" | "cancelled";

export type ModelExecutionUsage = Readonly<{
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}>;

export type ModelExecutionResponse = Readonly<{
  content: string;
  finishReason: ModelExecutionFinishReason;
  usage: ModelExecutionUsage;
  latencyMs: number;
  attemptCount: number;
  providerRequestId?: string;
  providerMetadata?: Readonly<Record<string, string>>;
}>;

export interface ModelExecutor {
  execute(request: ModelExecutionRequest): Promise<ModelExecutionResponse>;
}
