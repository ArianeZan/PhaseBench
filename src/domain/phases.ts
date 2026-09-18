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
] as const;

export type DevelopmentPhase = (typeof developmentPhases)[number];
