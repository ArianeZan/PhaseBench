import type { ComponentProps } from "react";

import { classNames } from "@/lib/class-names";

type BadgeProps = ComponentProps<"span">;

export function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={classNames(
        "text-label rounded-control inline-flex items-center border border-border bg-surface px-2.5 py-1 font-medium",
        className,
      )}
      {...props}
    />
  );
}
