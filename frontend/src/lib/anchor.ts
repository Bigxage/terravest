"use client";

import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "@/idl/terravest.json";

export const PROGRAM_ID = new PublicKey(
  "GtnVbAsPubGcD1mEG6jUfn6AC47TMrSJmLeeJ9SvFkBz"
);

const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL?.trim() || "https://api.devnet.solana.com";

type AnchorWallet = {
  publicKey: PublicKey;
  signTransaction: (tx: Transaction) => Promise<Transaction>;
  signAllTransactions?: (txs: Transaction[]) => Promise<Transaction[]>;
};

const READONLY_PUBLIC_KEY = new PublicKey(
  "11111111111111111111111111111111"
);

export function useProgram() {
  const wallet = useWallet();

  const connection = new Connection(RPC_URL, "confirmed");

  const anchorWallet: AnchorWallet = wallet.publicKey && wallet.signTransaction
    ? {
        publicKey: wallet.publicKey,
        signTransaction: wallet.signTransaction,
        signAllTransactions: wallet.signAllTransactions,
      }
    : {
        publicKey: READONLY_PUBLIC_KEY,
        signTransaction: async () => {
          throw new Error("Wallet not connected");
        },
        signAllTransactions: async () => {
          throw new Error("Wallet not connected");
        },
      };

  const provider = new AnchorProvider(connection, anchorWallet as any, {
    commitment: "confirmed",
    preflightCommitment: "confirmed",
  });

  const program = new Program(idl as Idl, provider);

  return { program, connection };
}