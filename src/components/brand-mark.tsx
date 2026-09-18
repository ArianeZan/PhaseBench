export function BrandMark() {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className="text-body rounded-control grid size-9 place-items-center bg-accent font-mono font-black text-accent-foreground"
      >
        PB
      </span>
      <span className="text-body font-semibold tracking-[0.18em] uppercase">
        PhaseBench
      </span>
    </div>
  );
}
