"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { useInvest } from "@/hooks/useInvest";
import type { PropertyCategory } from "@/lib/properties";

interface PropertyCardProps {
  propertyId: number;
  title: string;
  location: string;
  price: number;
  roi: string;
  image: string;
  totalUnits: number;
  availableUnits: number;
  category: PropertyCategory;
}

type DemoInvestment = {
  wallet: string;
  propertyId: number;
  amount: number;
  signature: string;
};

const MIN_UNITS = 100;

function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value < 10 ? 2 : 0,
  }).format(value);
}

function getCategoryLabel(category: PropertyCategory) {
  switch (category) {
    case "estate":
      return "Estate Land";
    case "development":
      return "Development";
    case "land":
      return "Growth Corridor";
    default:
      return "Property";
  }
}

export default function PropertyCard({
  propertyId,
  title,
  location,
  price,
  roi,
  image,
  totalUnits,
  availableUnits,
  category,
}: PropertyCardProps) {
  const { invest } = useInvest();
  const { publicKey } = useWallet();

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");

  const soldUnits = totalUnits - availableUnits;
  const soldPercentage = totalUnits > 0 ? (soldUnits / totalUnits) * 100 : 0;
  const minimumInvestment = price * MIN_UNITS;

  const categoryLabel = useMemo(() => getCategoryLabel(category), [category]);

  const saveInvestment = (signature: string) => {
    if (!publicKey) return;

    try {
      const wallet = publicKey.toBase58();
      const raw = localStorage.getItem("terravest_demo_investments");
      const existing: DemoInvestment[] = raw ? JSON.parse(raw) : [];

      const alreadySaved = existing.some((item) => item.signature === signature);

      const updated = alreadySaved
        ? existing
        : [
            ...existing,
            {
              wallet,
              propertyId,
              amount: minimumInvestment,
              signature,
            },
          ];

      localStorage.setItem(
        "terravest_demo_investments",
        JSON.stringify(updated)
      );
    } catch (error) {
      console.error("Failed to save demo investment:", error);
    }
  };

  const onInvest = async () => {
    if (!publicKey) {
      setStatus("Please connect your wallet before buying unit shares.");
      return;
    }

    try {
      setLoading(true);
      setStatus(`Submitting purchase for ${MIN_UNITS} unit shares...`);

      const sig = await invest(propertyId, MIN_UNITS);

      saveInvestment(sig);

      setStatus(
        `Purchase successful: ${sig}\nExplorer: https://explorer.solana.com/tx/${sig}?cluster=devnet`
      );
    } catch (error: unknown) {
      console.error("Investment failed:", error);

      const message =
        error instanceof Error
          ? error.message
          : typeof error === "string"
          ? error
          : "Purchase failed";

      setStatus(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#121926] text-white shadow-xl transition hover:-translate-y-1 hover:border-emerald-400/30">
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="h-56 w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute left-4 top-4">
          <span className="rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
            {categoryLabel}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/80">{location}</p>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Price Per Unit
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {formatUsd(price)}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-white/60">ROI</p>
            <p className="mt-1 text-lg font-semibold text-emerald-300">{roi}</p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Total Units
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {totalUnits.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-3">
            <p className="text-xs uppercase tracking-wide text-white/60">
              Min Investment
            </p>
            <p className="mt-1 text-lg font-semibold text-white">
              {MIN_UNITS} Units
            </p>
            <p className="text-sm text-white/60">
              {formatUsd(minimumInvestment)}
            </p>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-white/70">Units Sold</span>
            <span className="font-medium text-white">
              {soldUnits.toLocaleString()} / {totalUnits.toLocaleString()}
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${Math.min(soldPercentage, 100)}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-white/60">
              Available: {availableUnits.toLocaleString()}
            </span>
            <span className="text-emerald-300 font-medium">
              {soldPercentage.toFixed(1)}% sold
            </span>
          </div>
        </div>

        <p className="mt-4 text-sm leading-6 text-white/65">
          Visuals show approved building concepts compatible with available land plots.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            onClick={onInvest}
            disabled={loading || !publicKey}
            className="inline-flex items-center rounded-lg bg-emerald-400 px-4 py-3 font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            aria-disabled={loading || !publicKey}
          >
            {loading
              ? "Processing..."
              : !publicKey
              ? "Connect Wallet to Buy"
              : `Buy ${MIN_UNITS} Unit Shares`}
          </button>

          <Link
            href={`/property/${propertyId}`}
            className="inline-flex items-center rounded-lg border border-white/15 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
          >
            Learn More
          </Link>
        </div>

        {status && (
          <div className="mt-4 whitespace-pre-wrap break-words rounded-lg border border-white/10 bg-black/30 p-3 text-sm text-white">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}