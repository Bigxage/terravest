"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useProgram } from "@/lib/anchor";
import {
  getPlatformConfigPda,
  getPropertyPda,
  getInvestorPositionPda,
} from "@/lib/pda";

export function useInvest() {
  const wallet = useWallet();
  const { program, connection } = useProgram();

  const invest = async (
    propertyId: number,
    units: number,
    treasuryAddress: string
  ) => {
    if (!wallet.publicKey || !program || !connection) {
      throw new Error("Connect wallet first");
    }

    const platformConfig = getPlatformConfigPda();
    const property = getPropertyPda(propertyId);
    const investorPosition = getInvestorPositionPda(wallet.publicKey, property);
    const treasury = new PublicKey(treasuryAddress);

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
      .transaction();

    const signature = await wallet.sendTransaction(tx, connection);
    await connection.confirmTransaction(signature, "confirmed");

    return signature;
  };

  return { invest };
}