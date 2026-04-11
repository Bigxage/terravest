"use client";

import Navbar from "@/components/Navbar";
import AdminPanel from "@/components/AdminPanel";
import { useWallet } from "@solana/wallet-adapter-react";

const ADMIN_WALLET = "6JAR2YthhdV5fjCmySgQxU3G5fyuEVTMaPkv5G4wdjXg";

export default function AdminPage() {
  const { publicKey } = useWallet();

  const isAdmin = publicKey?.toBase58() === ADMIN_WALLET;

  return (
    <main className="min-h-screen bg-[#0B0F1A] text-white">
      <Navbar />

      <section className="px-10 py-12">
        <h1 className="mb-6 text-3xl font-semibold">Founder Admin Panel</h1>

        {!publicKey && (
          <div className="rounded-xl border border-gray-700 bg-[#1A2233] p-4">
            Connect wallet to access admin controls.
          </div>
        )}

        {publicKey && !isAdmin && (
          <div className="rounded-xl border border-red-700 bg-red-950/30 p-4 text-red-200">
            Access denied. Only founder wallet allowed.
          </div>
        )}

        {publicKey && isAdmin && <AdminPanel />}
      </section>
    </main>
  );
}