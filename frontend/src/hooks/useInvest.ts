"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { SystemProgram, PublicKey } from "@solana/web3.js";
import { useProgram } from "@/lib/anchor";
import {
  getPlatformConfigPda,
  getPropertyPda,
  getInvestorPositionPda,
} from "@/lib/pda";

export function useInvest() {
  const wallet = useWallet();
  const program = useProgram();

  const invest = async (propertyId: number, units: number) => {
    if (!wallet.publicKey) {
      alert("Connect wallet");
      return;
    }

    try {
      const platformConfig = getPlatformConfigPda();
      const property = getPropertyPda(propertyId);
      const investorPosition = getInvestorPositionPda(
        wallet.publicKey,
        property
      );

      // ⚠️ Replace with your real treasury address
      const treasury = new PublicKey("YOUR_TREASURY_PUBLIC_KEY");

      const tx = await program.methods
        .invest(units)
        .accounts({
          investor: wallet.publicKey,
          platformConfig,
          property,
          treasury,
          investorPosition,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("TX:", tx);
      alert("Investment successful 🚀");
    } catch (err) {
      console.error(err);
      alert("Investment failed");
    }
  };

  return { invest };
}