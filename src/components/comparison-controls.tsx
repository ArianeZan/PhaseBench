import type { Provider } from "@/domain/providers";
import { developmentPhases } from "@/domain/phases";
import type { RecommendationPriority } from "@/domain/priorities";
import {
  comparisonSorts,
  type ComparisonSort,
  type SortDirection,
} from "@/data/comparison-data";

type Props = Readonly<{
  priority: RecommendationPriority;
  providers: readonly Provider[];
  phaseId?: string;
  providerId?: string;
  sort: ComparisonSort;
  direction: SortDirection;
}>;

export function ComparisonControls(props: Props) {
  return (
    <form
      action="/comparison"
      className="mt-6 grid gap-4 rounded-card border border-border bg-surface-muted p-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      <input type="hidden" name="priority" value={props.priority} />
      <Select label="Phase" name="phase" value={props.phaseId ?? ""}>
        <option value="">All phases</option>
        {developmentPhases.map((phase) => (
          <option key={phase.id} value={phase.id}>
            {phase.name}
          </option>
        ))}
      </Select>
      <Select label="Provider" name="provider" value={props.providerId ?? ""}>
        <option value="">All providers</option>
        {props.providers.map((provider) => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </Select>
      <Select label="Sort by" name="sort" value={props.sort}>
        {comparisonSorts.map((sort) => (
          <option key={sort} value={sort}>
            {sort[0]?.toUpperCase()}
            {sort.slice(1)}
          </option>
        ))}
      </Select>
      <Select label="Direction" name="direction" value={props.direction}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </Select>
      <button
        className="rounded-control bg-accent px-4 py-3 font-semibold text-accent-foreground sm:col-span-2 lg:col-span-4"
        type="submit"
      >
        Apply comparison
      </button>
    </form>
  );
}
function Select({
  label,
  name,
  value,
  children,
}: Readonly<{
  label: string;
  name: string;
  value: string;
  children: React.ReactNode;
}>) {
  return (
    <label className="text-label font-semibold">
      {label}
      <select
        className="mt-2 min-h-11 w-full rounded-control border border-border bg-surface px-3 py-3 text-foreground"
        name={name}
        defaultValue={value}
      >
        {children}
      </select>
    </label>
  );
}
