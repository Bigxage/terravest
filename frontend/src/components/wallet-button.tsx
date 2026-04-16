"use client";

import { useEffect, useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

export default function WalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-w-[170px]">
        <button
          type="button"
          disabled
          className="h-[42px] w-full rounded-lg bg-emerald-400 px-4 text-sm font-semibold text-black opacity-70"
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className="min-w-[170px]">
      <WalletMultiButton className="!h-[42px] !w-full !rounded-lg !bg-emerald-400 !px-4 !text-sm !font-semibold !text-black hover:!opacity-90" />
    </div>
  );
}