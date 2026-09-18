export const providers = [
  { id: "openai", name: "OpenAI", shortName: "OA" },
  { id: "anthropic", name: "Anthropic", shortName: "AN" },
  { id: "google", name: "Google", shortName: "GO" },
  { id: "generic", name: "Other providers", shortName: "OT" },
] as const;

export type Provider = (typeof providers)[number];
export type ProviderId = Provider["id"];
