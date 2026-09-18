import { AppShell } from "@/components/app-shell";

export default function ProductLayout({ children }: LayoutProps<"/">) {
  return <AppShell>{children}</AppShell>;
}
