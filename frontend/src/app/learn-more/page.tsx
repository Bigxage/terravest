import Navbar from "@/components/navbar";

export default function LearnMorePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold">How TerraVest Works</h1>
          <p className="mt-4 max-w-3xl text-white/75">
            TerraVest is designed to make property-backed investment more
            accessible through fractional ownership on blockchain, while still
            aligning with real-world verification, partnerships, and legal due
            process.
          </p>
        </div>

        <div className="space-y-8 text-white/85">
          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Fractional Ownership on Blockchain
            </h2>
            <p>
              TerraVest enables users to buy unit shares in vetted real estate
              opportunities. Each property is divided into fractional units,
              allowing investors to participate without purchasing the full
              asset outright.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-2xl font-semibold">Operational Model</h2>
            <p>
              Properties are sourced, reviewed, and initialized by the TerraVest
              admin team. Once approved, users can connect a wallet, browse live
              offerings, and buy unit shares tied to those opportunities.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Partnerships and Asset Verification
            </h2>
            <p>
              TerraVest works with real estate professionals, legal partners,
              and compliance stakeholders to verify asset origin, title
              documentation, transaction structure, and investment disclosures
              before assets are presented onchain.
            </p>
          </section>

          <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-2 text-2xl font-semibold">
              Legal and Due Process
            </h2>
            <p>
              Our process is designed to align onchain ownership representation
              with real-world legal agreements, asset documentation, and
              investor protections. This ensures that blockchain participation
              is backed by structured offchain due diligence.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}