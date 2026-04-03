"use client";

import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "@/idl/terravest.json";

export const PROGRAM_ID = new PublicKey(
  "GtnVbAsPubGcD1mEG6jUfn6AC47TMrSJmLeeJ9SvFkBz"
);

type AnchorWallet = {
  publicKey: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions?: (txs: Transaction[]) => Promise<Transaction[]>;
};

export function useProgram() {
  const wallet = useWallet();

  if (!wallet.publicKey || !wallet.signTransaction) {
    return { program: null, connection: null };
  }

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const anchorWallet: AnchorWallet = {
    publicKey: wallet.publicKey,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
  };

  const provider = new AnchorProvider(connection, anchorWallet as any, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });

  const program = new Program(idl as Idl, provider);

  return { program, connection };
}