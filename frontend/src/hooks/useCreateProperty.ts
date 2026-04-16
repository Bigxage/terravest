"use client";

import { BN } from "@coral-xyz/anchor";
import {
  SystemProgram,
  SendTransactionError,
} from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { useProgram } from "@/lib/anchor";
import { getPlatformConfigPda, getPropertyPda } from "@/lib/pda";

export function useCreateProperty() {
  const wallet = useWallet();
  const { program, connection } = useProgram();

  const createProperty = async ({
    propertyId,
    name,
    location,
    pricePerUnitLamports,
    totalUnits,
  }: {
    propertyId: number;
    name: string;
    location: string;
    pricePerUnitLamports: number;
    totalUnits: number;
  }) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Connect admin wallet first");
    }

    if (!program || !connection) {
      throw new Error("Program connection is not ready");
    }

    if (!Number.isInteger(propertyId) || propertyId <= 0) {
      throw new Error("Property ID must be a positive integer");
    }

    if (!name.trim()) {
      throw new Error("Property name is required");
    }

    if (!location.trim()) {
      throw new Error("Property location is required");
    }

    if (!Number.isInteger(pricePerUnitLamports) || pricePerUnitLamports <= 0) {
      throw new Error("Price per unit must be a positive integer");
    }

    if (!Number.isInteger(totalUnits) || totalUnits <= 0) {
      throw new Error("Total units must be greater than zero");
    }

    const admin = wallet.publicKey;
    const platformConfig = getPlatformConfigPda();
    const property = getPropertyPda(propertyId);

    try {
      const tx = await program.methods
        .createProperty(
          new BN(propertyId),
          name.trim(),
          location.trim(),
          new BN(pricePerUnitLamports),
          new BN(totalUnits)
        )
        .accounts({
          admin,
          platformConfig,
          property,
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
    } catch (error) {
      console.error("Create property error:", error);

      if (error instanceof SendTransactionError) {
        const logs = await error.getLogs(connection).catch(() => null);

        console.error("Create property logs:", logs);

        const joinedLogs = logs?.join("\n") || "";

        if (
          joinedLogs.includes("already in use") ||
          joinedLogs.includes("Allocate: account") ||
          joinedLogs.includes("custom program error: 0x0")
        ) {
          throw new Error(
            `Property ID ${propertyId} already exists onchain. Use a different property ID or add an update flow for existing properties.`
          );
        }

        throw new Error(
          joinedLogs || error.message || "Create property transaction failed."
        );
      }

      if (error instanceof Error) {
        throw error;
      }

      throw new Error("Unknown create property error");
    }
  };

  return { createProperty };
}