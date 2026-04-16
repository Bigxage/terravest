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

function getTreasuryPublicKey(): PublicKey {
  const treasuryAddress = process.env.NEXT_PUBLIC_DEMO_TREASURY?.trim();

  if (!treasuryAddress) {
    throw new Error(
      "Treasury address is missing. Set NEXT_PUBLIC_DEMO_TREASURY in your environment."
    );
  }

  try {
    return new PublicKey(treasuryAddress);
  } catch {
    throw new Error("Treasury address is invalid");
  }
}

export function useInvest() {
  const wallet = useWallet();
  const { program, connection } = useProgram();

  const invest = async (propertyId: number, units: number) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      throw new Error("Connect wallet first");
    }

    if (!program || !connection) {
      throw new Error("Program connection is not ready");
    }

    if (!Number.isInteger(propertyId) || propertyId < 0) {
      throw new Error("Invalid property ID");
    }

    if (!Number.isInteger(units) || units <= 0) {
      throw new Error("Units must be greater than zero");
    }

    const treasury = getTreasuryPublicKey();

    const investor = wallet.publicKey;
    const platformConfig = getPlatformConfigPda();
    const property = getPropertyPda(propertyId);
    const investorPosition = getInvestorPositionPda(investor, property);

    const tx = await program.methods
      .invest(new BN(units))
      .accounts({
        investor,
        platformConfig,
        property,
        treasury,
        investorPosition,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

    tx.feePayer = investor;

    const latestBlockhash = await connection.getLatestBlockhash("confirmed");
    tx.recentBlockhash = latestBlockhash.blockhash;

    console.log("invest tx", tx);

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

  return { invest };
}