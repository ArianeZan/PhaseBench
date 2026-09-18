import type { ComponentProps } from "react";

import { classNames } from "@/lib/class-names";

type VisuallyHiddenProps = ComponentProps<"span">;

export function VisuallyHidden({ className, ...props }: VisuallyHiddenProps) {
  return (
    <span
      className={classNames(
        "absolute size-px overflow-hidden whitespace-nowrap [clip-path:inset(50%)]",
        className,
      )}
      {...props}
    />
  );
}
