"use client";

import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
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
    if (!wallet.publicKey || !wallet.signTransaction || !program || !connection) {
      throw new Error("Connect wallet first");
    }

    if (!treasuryAddress?.trim()) {
      throw new Error("Treasury address is required");
    }

    let treasury: PublicKey;
    try {
      treasury = new PublicKey(treasuryAddress.trim());
    } catch {
      throw new Error("Treasury address is invalid");
    }

    const platformConfig = getPlatformConfigPda();
    const property = getPropertyPda(propertyId);
    const investorPosition = getInvestorPositionPda(wallet.publicKey, property);

    const tx = await program.methods
      .invest(new BN(units))
      .accounts({
        investor: wallet.publicKey,
        platformConfig,
        property,
        treasury,
        investorPosition,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    tx.feePayer = wallet.publicKey;

    const latest = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = latest.blockhash;

    console.log("invest tx", tx);

    const signedTx = await wallet.signTransaction(tx);
    const raw = signedTx.serialize();

    const signature = await connection.sendRawTransaction(raw, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    await connection.confirmTransaction(
      {
        signature,
        blockhash: latest.blockhash,
        lastValidBlockHeight: latest.lastValidBlockHeight,
      },
      "confirmed"
    );

    return signature;
  };

  return { invest };
}