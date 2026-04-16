"use client";

import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/lib/anchor";
import { getPlatformConfigPda } from "@/lib/pda";

export function useInitializePlatform() {
  const wallet = useWallet();
  const { program, connection } = useProgram();

  const initializePlatform = async ({
    treasury,
  }: {
    treasury: string;
  }) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Connect admin wallet first");
    }

    if (!program || !connection) {
      throw new Error("Program connection is not ready");
    }

    if (!treasury.trim()) {
      throw new Error("Treasury wallet is required");
    }

    let treasuryPublicKey: PublicKey;
    try {
      treasuryPublicKey = new PublicKey(treasury.trim());
    } catch {
      throw new Error("Treasury wallet is invalid");
    }

    const admin = wallet.publicKey;
    const platformConfig = getPlatformConfigPda();

    const tx = await program.methods
      .initializePlatform()
      .accounts({
        admin,
        treasury: treasuryPublicKey,
        platformConfig,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    tx.feePayer = admin;

    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = latestBlockhash.blockhash;

    const signedTx = await wallet.signTransaction(tx);
    const rawTx = signedTx.serialize();

    const signature = await connection.sendRawTransaction(rawTx, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });

    await connection.confirmTransaction(
      {
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      "confirmed"
    );

    return signature;
  };

  return { initializePlatform };
}