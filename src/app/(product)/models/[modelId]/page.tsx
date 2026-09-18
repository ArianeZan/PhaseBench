import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ProviderBadge } from "@/components/provider-badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { listModelIds, loadModelIdentity } from "@/data/model-detail-data";

export async function generateStaticParams() {
  return (await listModelIds()).map((modelId) => ({ modelId }));
}

export async function generateMetadata({
  params,
}: PageProps<"/models/[modelId]">): Promise<Metadata> {
  const identity = await loadModelIdentity((await params).modelId);
  if (!identity) return { title: "Model not found — PhaseBench" };
  return {
    title: `${identity.model.name} — PhaseBench`,
    description: `PhaseBench performance profile for ${identity.model.name} by ${identity.provider.name}.`,
  };
}

export default async function ModelPage({
  params,
}: PageProps<"/models/[modelId]">) {
  const identity = await loadModelIdentity((await params).modelId);
  if (!identity) notFound();
  return (
    <Container className="py-section">
      <Link
        href="/comparison"
        className="text-label font-semibold text-accent hover:underline"
      >
        ← Back to comparison
      </Link>
      <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-label font-mono font-semibold tracking-[0.16em] text-accent uppercase">
            Model profile
          </p>
          <h1 className="text-display mt-3 font-semibold text-balance">
            {identity.model.name}
          </h1>
          <p className="text-body-lg mt-4 text-text-muted">
            Version {identity.model.version} · {identity.model.status}
          </p>
        </div>
        <ProviderBadge provider={identity.provider} />
      </div>
      <Card
        as="section"
        className="mt-10 p-6"
        aria-labelledby="profile-coming-soon"
      >
        <h2 id="profile-coming-soon" className="text-heading font-semibold">
          Performance profile
        </h2>
        <p className="text-body mt-3 text-text-muted">
          Phase strengths, current metrics, trends, and benchmark evidence will
          appear here from the PhaseBench repository.
        </p>
        <p className="text-label mt-5 text-text-muted">
          Synthetic benchmark data
        </p>
      </Card>
    </Container>
  );
}
