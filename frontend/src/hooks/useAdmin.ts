"use client";

import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/lib/anchor";
import { getPlatformConfigPda, getPropertyPda } from "@/lib/pda";

export function useAdmin() {
  const wallet = useWallet();
  const { program, connection } = useProgram();

  const initializePlatform = async (treasuryAddress: string) => {
    if (!wallet.publicKey || !wallet.signTransaction || !program || !connection) {
      throw new Error("Connect wallet first");
    }

    if (!treasuryAddress) {
      throw new Error("Treasury address is required");
    }

    const treasury = new PublicKey(treasuryAddress);
    const platformConfig = getPlatformConfigPda();

    const tx = await program.methods
      .initializePlatform()
      .accounts({
        admin: wallet.publicKey,
        treasury,
        platformConfig,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    tx.feePayer = wallet.publicKey;

    const latest = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = latest.blockhash;

    console.log("initialize tx", tx);

    const sim = await connection.simulateTransaction(tx, {
      sigVerify: false,
      replaceRecentBlockhash: true,
    });

    console.log("initialize simulation", sim);

    if (sim.value.err) {
      throw new Error(`Simulation failed: ${JSON.stringify(sim.value.err)}`);
    }

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

  const createProperty = async (input: {
    propertyId: number;
    name: string;
    location: string;
    pricePerUnitLamports: number;
    totalUnits: number;
  }) => {
    if (!wallet.publicKey || !wallet.signTransaction || !program || !connection) {
      throw new Error("Connect wallet first");
    }

    const platformConfig = getPlatformConfigPda();
    const property = getPropertyPda(input.propertyId);

    const tx = await program.methods
      .createProperty(
        new BN(input.propertyId),
        input.name,
        input.location,
        new BN(input.pricePerUnitLamports),
        new BN(input.totalUnits)
      )
      .accounts({
        admin: wallet.publicKey,
        platformConfig,
        property,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    tx.feePayer = wallet.publicKey;

    const latest = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = latest.blockhash;

    console.log("create property tx", tx);

    const sim = await connection.simulateTransaction(tx, {
      sigVerify: false,
      replaceRecentBlockhash: true,
    });

    console.log("create property simulation", sim);

    if (sim.value.err) {
      throw new Error(`Simulation failed: ${JSON.stringify(sim.value.err)}`);
    }

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

  return {
    initializePlatform,
    createProperty,
  };
}