"use client";

import { useEffect, useRef, useState } from "react";
import { Connection } from "@solana/web3.js";
import { getPropertyPda } from "@/lib/pda";

export type OnchainProperty = {
  id: number;
  title: string;
  location: string;
  pricePerUnit: number;
  totalUnits: number;
  availableUnits: number;
  roi: string;
  image: string;
  category: "estate" | "development" | "land";
};

const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL?.trim() || "https://api.devnet.solana.com";

const PROPERTY_CATALOG: OnchainProperty[] = [
  {
    id: 11,
    title: "Imperial Villa – Karsana",
    location: "Karsana, Abuja",
    pricePerUnit: 0.02,
    totalUnits: 10000,
    availableUnits: 10000,
    roi: "18–25%",
    image: "/images/imperial-villa.jpg",
    category: "development",
  },
  {
    id: 12,
    title: "Harmonies Homes – Kuje",
    location: "Kuje, Abuja",
    pricePerUnit: 0.01,
    totalUnits: 8000,
    availableUnits: 8000,
    roi: "25–40%",
    image: "/images/kuje-homes.jpg",
    category: "land",
  },
  {
    id: 13,
    title: "Nova Garden – Kurudu",
    location: "Kurudu, Abuja",
    pricePerUnit: 0.01,
    totalUnits: 12000,
    availableUnits: 12000,
    roi: "30–50%",
    image: "/images/nova-garden.jpg",
    category: "land",
  },
  {
    id: 14,
    title: "Abundance City – Apo Tafyi",
    location: "Apo Tafyi, Abuja",
    pricePerUnit: 0.02,
    totalUnits: 9000,
    availableUnits: 9000,
    roi: "20–35%",
    image: "/images/apo-city.jpg",
    category: "estate",
  },
  {
    id: 15,
    title: "Skyline Exclusive – Gousa",
    location: "Gousa, Abuja",
    pricePerUnit: 0.02,
    totalUnits: 7000,
    availableUnits: 7000,
    roi: "25–50%",
    image: "/images/gousa-skyline.jpg",
    category: "development",
  },
];

export function useProperties() {
  const [properties, setProperties] = useState<OnchainProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function fetchProperties() {
      if (hasFetchedRef.current) return;
      hasFetchedRef.current = true;

      setLoading(true);
      setError("");

      try {
        const connection = new Connection(RPC_URL, "confirmed");

        console.log("useProperties RPC_URL:", RPC_URL);

        const results = await Promise.all(
          PROPERTY_CATALOG.map(async (property) => {
            const pda = getPropertyPda(property.id);
            const accountInfo = await connection.getAccountInfo(pda, "confirmed");

            console.log("Property PDA check:", {
              id: property.id,
              title: property.title,
              pda: pda.toBase58(),
              exists: !!accountInfo,
              owner: accountInfo?.owner?.toBase58?.(),
              lamports: accountInfo?.lamports,
            });

            return accountInfo ? property : null;
          })
        );

        const existing = results.filter(Boolean) as OnchainProperty[];

        console.log("Existing onchain properties:", existing);

        if (mounted) {
          setProperties(existing);
          setError("");
        }
      } catch (err: any) {
        console.error("Failed to fetch property accounts:", err);
        if (mounted) {
          setError(err?.message || "Failed to load initialized properties.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchProperties();

    return () => {
      mounted = false;
    };
  }, []);

  return { properties, loading, error };
}