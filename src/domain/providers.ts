export type ProviderId = string;

export type Provider = Readonly<{
  id: ProviderId;
  name: string;
  shortName: string;
}>;

export const providers = [
  { id: "openai", name: "OpenAI", shortName: "OA" },
  { id: "anthropic", name: "Anthropic", shortName: "AN" },
  { id: "google", name: "Google", shortName: "GO" },
  { id: "mistral", name: "Mistral", shortName: "MI" },
] as const satisfies readonly Provider[];
