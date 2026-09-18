import type { ProviderId } from "./providers";

export type ModelId = string;

export type ModelStatus = "active" | "preview" | "retired";

export type AiModel = Readonly<{
  id: ModelId;
  providerId: ProviderId;
  name: string;
  version: string;
  status: ModelStatus;
  releasedOn?: string;
}>;
