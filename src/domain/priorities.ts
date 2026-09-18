export const priorityIds = [
  "quality",
  "value",
  "speed",
  "reliability",
  "balanced",
] as const;

export type RecommendationPriority = (typeof priorityIds)[number];

export type PriorityDefinition = Readonly<{
  id: RecommendationPriority;
  name: string;
  description: string;
}>;

export const priorities = [
  {
    id: "quality",
    name: "Best quality",
    description: "Prioritize the strongest task outcomes.",
  },
  {
    id: "value",
    name: "Best value",
    description: "Prioritize quality delivered for the estimated cost.",
  },
  {
    id: "speed",
    name: "Fastest",
    description: "Prioritize the shortest end-to-end response time.",
  },
  {
    id: "reliability",
    name: "Most reliable",
    description: "Prioritize repeatable results and successful runs.",
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Balance quality, value, speed, and reliability.",
  },
] as const satisfies readonly PriorityDefinition[];
