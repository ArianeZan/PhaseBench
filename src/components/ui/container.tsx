import type { ComponentProps } from "react";

import { classNames } from "@/lib/class-names";

type ContainerProps = ComponentProps<"div">;

export function Container({ className, ...props }: ContainerProps) {
  return (
    <div
      className={classNames("px-page mx-auto w-full max-w-6xl", className)}
      {...props}
    />
  );
}
