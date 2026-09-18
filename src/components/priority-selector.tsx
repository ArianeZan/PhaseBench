import Link from "next/link";

import { priorities, type RecommendationPriority } from "@/domain/priorities";
import { classNames } from "@/lib/class-names";

type PrioritySelectorProps = Readonly<{
  selectedPriority: RecommendationPriority;
  pathname?: string;
}>;

export function PrioritySelector({
  selectedPriority,
  pathname = "/",
}: PrioritySelectorProps) {
  return (
    <nav aria-label="Recommendation priority">
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {priorities.map((priority) => {
          const selected = priority.id === selectedPriority;
          return (
            <li key={priority.id}>
              <Link
                aria-current={selected ? "true" : undefined}
                className={classNames(
                  "rounded-control flex min-h-14 h-full flex-col justify-center border px-3 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  selected
                    ? "border-accent bg-accent text-accent-foreground"
                    : "border-border bg-surface text-foreground hover:bg-surface-muted",
                )}
                href={{ pathname, query: { priority: priority.id } }}
              >
                <span className="text-body font-semibold">{priority.name}</span>
                <span
                  className={classNames(
                    "text-label mt-0.5",
                    selected ? "text-accent-foreground/80" : "text-text-muted",
                  )}
                >
                  {priority.id === "balanced" ? "All outcomes" : priority.id}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
