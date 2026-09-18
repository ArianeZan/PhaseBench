import type { ComponentProps } from "react";

import { classNames } from "@/lib/class-names";

type CardElement = "article" | "div" | "section";

type CardProps = ComponentProps<"div"> & {
  as?: CardElement;
};

export function Card({
  as: Component = "div",
  className,
  ...props
}: CardProps) {
  return (
    <Component
      className={classNames(
        "rounded-card border border-border bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}
