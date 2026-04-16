import Link from "next/link";
import Navbar from "@/components/navbar";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center md:py-32">
        <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-sm font-medium text-emerald-300">
          Fractional Real Estate on Solana
        </div>

        <h1 className="mt-6 max-w-4xl text-4xl font-bold leading-tight sm:text-5xl md:text-6xl">
          Real Estate Investment Through Fractional Ownership on Blockchain
        </h1>

        <p className="mt-6 max-w-2xl text-base text-white/75 sm:text-lg">
          Discover verified property opportunities, buy unit shares, and track
          your onchain real estate exposure through TerraVest.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/properties"
            className="rounded-lg bg-emerald-400 px-6 py-3 font-semibold text-black transition hover:opacity-90"
          >
            Buy Unit Shares
          </Link>

          <Link
            href="/learn-more"
            className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>

        <div className="mt-16 grid w-full max-w-5xl gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-lg font-semibold text-white">Verified Listings</h2>
            <p className="mt-2 text-sm text-white/70">
              Browse initialized property opportunities prepared for investment.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-lg font-semibold text-white">Unit Share Access</h2>
            <p className="mt-2 text-sm text-white/70">
              Participate in real estate ownership through fractional onchain access.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-left">
            <h2 className="text-lg font-semibold text-white">Investor Dashboard</h2>
            <p className="mt-2 text-sm text-white/70">
              Track properties you have invested in from your connected wallet.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}