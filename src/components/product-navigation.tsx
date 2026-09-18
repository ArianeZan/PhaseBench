"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { classNames } from "@/lib/class-names";

const destinations = [
  { href: "/", label: "Dashboard" },
  { href: "/comparison", label: "Comparison" },
  { href: "/runs", label: "Runs" },
] as const;

export function ProductNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="order-3 w-full md:order-none md:w-auto"
    >
      <ul className="flex gap-1 rounded-control bg-surface-muted p-1">
        {destinations.map((destination) => {
          const active =
            destination.href === "/"
              ? pathname === "/"
              : pathname.startsWith(destination.href);

          return (
            <li className="flex-1" key={destination.href}>
              <Link
                aria-current={active ? "page" : undefined}
                className={classNames(
                  "text-label rounded-control flex min-h-11 items-center justify-center px-3 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                  active
                    ? "bg-surface text-foreground shadow-card"
                    : "text-text-muted hover:text-foreground",
                )}
                href={destination.href}
              >
                {destination.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function ProductNavigationFallback() {
  return (
    <div
      aria-hidden="true"
      className="order-3 h-12 w-full rounded-control bg-surface-muted md:order-none md:w-72"
    />
  );
}
