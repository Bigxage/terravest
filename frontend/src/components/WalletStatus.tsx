"use client";

import { useWallet } from "@solana/wallet-adapter-react";

export default function WalletStatus() {
  const { publicKey, connected } = useWallet();

  return (
    <div className="mt-6">
      <p>Connected: {connected ? "Yes" : "No"}</p>
      <p>Wallet: {publicKey ? publicKey.toBase58() : "Not connected"}</p>
    </div>
  );
}