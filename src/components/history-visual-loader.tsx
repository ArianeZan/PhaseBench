"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { HistoryVisualProps } from "@/components/history-visual-chart";

export function HistoryVisualLoader(props: HistoryVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [Visual, setVisual] =
    useState<ComponentType<HistoryVisualProps> | null>(null);
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const load = () =>
      import("@/components/history-visual-chart").then(
        ({ HistoryVisualChart }) => setVisual(() => HistoryVisualChart),
      );
    if (!("IntersectionObserver" in window)) {
      void load();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void load();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={containerRef}
      className="mt-6 h-80 min-w-0"
      role="img"
      aria-label={props.label}
    >
      {Visual ? (
        <Visual {...props} />
      ) : (
        <div
          className="h-full rounded-card bg-surface-muted"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
