import type { ButtonHTMLAttributes } from "react";

import { classNames } from "@/lib/class-names";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: "border-accent bg-accent text-accent-foreground hover:opacity-90",
  secondary: "border-border bg-surface text-foreground hover:bg-surface-muted",
};

export function Button({
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        "text-body rounded-control inline-flex min-h-11 items-center justify-center border px-4 py-2 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-50",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
