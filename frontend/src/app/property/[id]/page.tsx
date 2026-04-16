import Link from "next/link";
import Navbar from "@/components/navbar";
import { demoProperties } from "@/lib/properties";

interface PropertyDetailPageProps {
  params: {
    id: string;
  };
}

export default function PropertyDetailPage({
  params,
}: PropertyDetailPageProps) {
  const propertyId = Number(params.id);

  const property = demoProperties.find((item) => item.id === propertyId);

  if (!property) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />
        <section className="mx-auto max-w-5xl px-6 py-12">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h1 className="text-3xl font-bold">Property Not Found</h1>
            <p className="mt-3 text-white/70">
              The property you are looking for does not exist or has not been
              initialized yet.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex rounded-lg bg-emerald-400 px-5 py-3 font-semibold text-black transition hover:opacity-90"
            >
              Back to Properties
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <Link
          href="/properties"
          className="mb-6 inline-flex text-sm text-emerald-300 hover:underline"
        >
          ← Back to Properties
        </Link>

        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="h-72 rounded-xl bg-gradient-to-br from-gray-700 to-gray-900" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h1 className="text-4xl font-bold">{property.title}</h1>
            <p className="mt-2 text-lg text-white/70">{property.location}</p>

            <div className="mt-6 space-y-3 text-white/85">
              <p>
                <span className="font-semibold text-white">Unit Price:</span>{" "}
                {property.pricePerUnit} SOL
              </p>
              <p>
                <span className="font-semibold text-white">Projected ROI:</span>{" "}
                {property.roi}
              </p>
              <p>
                <span className="font-semibold text-white">Total Units:</span>{" "}
                {property.totalUnits}
              </p>
              <p>
                <span className="font-semibold text-white">
                  Available Units:
                </span>{" "}
                {property.availableUnits}
              </p>
            </div>

            <div className="mt-8">
              <Link
                href="/learn-more"
                className="inline-flex rounded-lg border border-white/20 px-5 py-3 font-semibold text-white transition hover:bg-white/10"
              >
                Learn How TerraVest Works
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-2xl font-semibold">About This Opportunity</h2>
          <p className="mt-4 text-white/75">
            This property is part of the TerraVest fractional ownership demo.
            Investors can buy unit shares in initialized properties and track
            their exposure through the dashboard. Each listing represents a
            structured opportunity prepared for onchain participation.
          </p>
        </div>
      </section>
    </main>
  );
}