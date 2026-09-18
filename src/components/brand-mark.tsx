export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="rounded-control grid size-9 place-items-center bg-accent font-mono text-sm font-black text-accent-foreground"
      >
        PB
      </span>
      <span className="text-sm font-semibold tracking-[0.18em] uppercase">
        PhaseBench
      </span>
    </div>
  );
}
