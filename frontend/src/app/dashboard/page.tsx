"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { demoProperties } from "@/lib/properties";

type DemoInvestment = {
  wallet: string;
  propertyId: number;
  amount: number;
  signature: string;
};

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const [investments, setInvestments] = useState<DemoInvestment[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("terravest_demo_investments");
      if (!raw) {
        setInvestments([]);
        return;
      }

      const parsed = JSON.parse(raw) as DemoInvestment[];
      setInvestments(Array.isArray(parsed) ? parsed : []);
    } catch (error) {
      console.error("Failed to load demo investments:", error);
      setInvestments([]);
    }
  }, []);

  const ownedProperties = useMemo(() => {
    if (!publicKey) return [];

    const walletAddress = publicKey.toBase58();

    const userInvestments = investments.filter(
      (investment) => investment.wallet === walletAddress
    );

    return demoProperties.filter((property) =>
      userInvestments.some((investment) => investment.propertyId === property.id)
    );
  }, [publicKey, investments]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold">My Dashboard</h1>
        <p className="mb-8 text-white/70">
          View properties you have invested in with your connected wallet.
        </p>

        {!publicKey ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/75">
            Please connect your wallet to view your invested properties.
          </div>
        ) : ownedProperties.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/75">
            You have not invested in any property yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ownedProperties.map((property) => (
              <div
                key={property.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <h2 className="text-xl font-semibold">{property.title}</h2>
                <p className="mt-1 text-sm text-white/70">{property.location}</p>
                <p className="mt-3 text-sm text-emerald-300">
                  You own unit shares in this property.
                </p>
                <p className="mt-2 text-white/80">
                  Unit Price: {property.pricePerUnit} SOL
                </p>
                <p className="text-white/80">ROI: {property.roi}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}