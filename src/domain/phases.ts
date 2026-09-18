export const phaseIds = ["debate", "plan", "build"] as const;

export type PhaseId = (typeof phaseIds)[number];

export type DevelopmentPhase = Readonly<{
  id: PhaseId;
  name: string;
  description: string;
}>;

export const developmentPhases = [
  {
    id: "debate",
    name: "Debate",
    description: "Critical thinking, counterarguments, and alternatives.",
  },
  {
    id: "plan",
    name: "Plan",
    description: "Architecture, decomposition, clarity, and risk management.",
  },
  {
    id: "build",
    name: "Build",
    description: "Implementation, repository changes, testing, and debugging.",
  },
] as const satisfies readonly DevelopmentPhase[];
