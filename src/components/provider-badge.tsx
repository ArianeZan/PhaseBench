import type { Provider, ProviderId } from "@/domain/providers";

const markerClasses: Record<ProviderId, string> = {
  openai: "rounded-full bg-provider-openai",
  anthropic: "rotate-45 rounded-[0.2rem] bg-provider-anthropic",
  google: "rounded-full border-2 border-provider-google bg-transparent",
  generic: "rounded-none bg-provider-generic",
};

type ProviderBadgeProps = {
  provider: Provider;
};

export function ProviderBadge({ provider }: ProviderBadgeProps) {
  return (
    <span className="rounded-control inline-flex items-center gap-2.5 border border-border bg-surface px-3 py-2 shadow-card">
      <span
        aria-hidden="true"
        className={`size-2.5 shrink-0 ${markerClasses[provider.id]}`}
      />
      <span className="text-label font-mono text-text-muted">
        {provider.shortName}
      </span>
      <span className="text-body font-medium text-foreground">
        {provider.name}
      </span>
    </span>
  );
}
