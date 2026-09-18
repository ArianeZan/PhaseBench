"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

const subscribe = () => () => {};

export function ThemeControl() {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  return (
    <Button
      aria-label={mounted ? label : "Theme control loading"}
      className="size-11 shrink-0 px-0"
      disabled={!mounted}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      title={mounted ? label : undefined}
      variant="secondary"
    >
      {mounted && isDark ? <SunIcon /> : <MoonIcon />}
      <VisuallyHidden>
        {mounted ? label : "Theme control loading"}
      </VisuallyHidden>
    </Button>
  );
}

function MoonIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <path
        d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
      <circle
        cx="12"
        cy="12"
        r="3.5"
        stroke="currentColor"
        strokeWidth="1.75"
      />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.75"
      />
    </svg>
  );
}
