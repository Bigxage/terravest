"use client";

import { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import Navbar from "@/components/navbar";
import { useWallet } from "@solana/wallet-adapter-react";
import { getInvestorPositionPda, getPropertyPda } from "@/lib/pda";

const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL?.trim() || "https://api.devnet.solana.com";

type DashboardProperty = {
  id: number;
  title: string;
  location: string;
  unitsOwned: number;
  totalInvestedSol: number;
  image: string;
};

const PROPERTY_CATALOG: DashboardProperty[] = [
  {
    id: 11,
    title: "Imperial Villa – Karsana",
    location: "Karsana, Abuja",
    unitsOwned: 0,
    totalInvestedSol: 0,
    image: "/images/imperial-villa.jpg",
  },
  {
    id: 12,
    title: "Harmonies Homes – Kuje",
    location: "Kuje, Abuja",
    unitsOwned: 0,
    totalInvestedSol: 0,
    image: "/images/kuje-homes.jpg",
  },
  {
    id: 13,
    title: "Nova Garden – Kurudu",
    location: "Kurudu, Abuja",
    unitsOwned: 0,
    totalInvestedSol: 0,
    image: "/images/nova-garden.jpg",
  },
  {
    id: 14,
    title: "Abundance City – Apo Tafyi",
    location: "Apo Tafyi, Abuja",
    unitsOwned: 0,
    totalInvestedSol: 0,
    image: "/images/apo-city.jpg",
  },
  {
    id: 15,
    title: "Skyline Exclusive – Gousa",
    location: "Gousa, Abuja",
    unitsOwned: 0,
    totalInvestedSol: 0,
    image: "/images/gousa-skyline.jpg",
  },
];

function readU64LE(bytes: Uint8Array, offset: number): number {
  const view = new DataView(
    bytes.buffer,
    bytes.byteOffset,
    bytes.byteLength
  );
  const value = view.getBigUint64(offset, true);
  return Number(value);
}

function decodeInvestorPosition(data: Uint8Array) {
  // Anchor account layout:
  // 8 bytes discriminator
  // 32 investor pubkey
  // 32 property pubkey
  // 8 units_owned
  // 8 total_invested_lamports
  // 1 bump
  //
  // total after discriminator = 81 bytes

  const offset = 8;

  if (data.length < offset + 81) {
    throw new Error("Investor position account data is too short");
  }

  const investor = new PublicKey(data.slice(offset, offset + 32));
  const property = new PublicKey(data.slice(offset + 32, offset + 64));
  const unitsOwned = readU64LE(data, offset + 64);
  const totalInvestedLamports = readU64LE(data, offset + 72);
  const bump = data[offset + 80];

  return {
    investor,
    property,
    unitsOwned,
    totalInvestedLamports,
    bump,
  };
}

export default function DashboardPage() {
  const { publicKey } = useWallet();
  const [properties, setProperties] = useState<DashboardProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDashboard() {
      if (!publicKey) {
        setProperties([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const connection = new Connection(RPC_URL, "confirmed");

        const checks = await Promise.all(
          PROPERTY_CATALOG.map(async (property) => {
            const propertyPda = getPropertyPda(property.id);
            const positionPda = getInvestorPositionPda(publicKey, propertyPda);

            const accountInfo = await connection.getAccountInfo(
              positionPda,
              "confirmed"
            );

            console.log("Investor position PDA check:", {
              propertyId: property.id,
              propertyPda: propertyPda.toBase58(),
              positionPda: positionPda.toBase58(),
              exists: !!accountInfo,
            });

            if (!accountInfo) return null;

            const decoded = decodeInvestorPosition(accountInfo.data);

            return {
              ...property,
              unitsOwned: decoded.unitsOwned,
              totalInvestedSol: decoded.totalInvestedLamports / 1_000_000_000,
            };
          })
        );

        const ownedProperties = checks.filter(
          Boolean
        ) as DashboardProperty[];

        setProperties(ownedProperties);
      } catch (err: any) {
        console.error("Failed to fetch dashboard:", err);
        setError(err?.message || "Failed to load dashboard.");
        setProperties([]);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboard();
  }, [publicKey]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="mb-2 text-3xl font-bold">My Dashboard</h1>
        <p className="mb-8 text-white/70">
          Your onchain real estate positions.
        </p>

        {!publicKey ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/75">
            Connect your wallet to view your investments.
          </div>
        ) : loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/75">
            Loading investments...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : properties.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/75">
            You have not invested in any property yet.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <div
                key={property.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <img
                  src={property.image}
                  alt={property.title}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <h2 className="text-xl font-semibold">{property.title}</h2>
                  <p className="mt-1 text-sm text-white/70">
                    {property.location}
                  </p>

                  <p className="mt-4 text-sm text-emerald-300">
                    Units Owned: {property.unitsOwned}
                  </p>

                  <p className="mt-2 text-white/80">
                    Total Invested: {property.totalInvestedSol.toFixed(4)} SOL
                  </p>

                  <p className="mt-1 text-sm text-white/60">
                    Property ID: {property.id}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}