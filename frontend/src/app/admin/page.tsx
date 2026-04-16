"use client";

import Navbar from "@/components/navbar";
import AdminPanel from "@/components/admin-panel";
import { useWallet } from "@solana/wallet-adapter-react";

const ADMIN_WALLET = "6JAR2YthhdV5fjCmySgQxU3G5fyuEVTMaPkv5G4wdjXg";

export default function AdminPage() {
  const { publicKey } = useWallet();

  const walletAddress = publicKey?.toBase58();
  const isAdmin = walletAddress === ADMIN_WALLET;

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Founder Admin Panel</h1>
          <p className="mt-2 text-white/70">
            Initialize onchain properties and manage TerraVest asset listings.
          </p>
        </div>

        {!publicKey && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-white/80">
            Connect wallet to access admin controls.
          </div>
        )}

        {publicKey && !isAdmin && (
          <div className="rounded-xl border border-red-700 bg-red-950/30 p-4 text-red-200">
            Access denied. Only the founder wallet can access this panel.
          </div>
        )}

        {publicKey && isAdmin && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <div className="mb-4 rounded-lg border border-emerald-400/20 bg-emerald-400/10 p-3 text-sm text-emerald-200">
              Connected as authorized admin: {walletAddress}
            </div>

            <AdminPanel />
          </div>
        )}
      </section>
    </main>
  );
}