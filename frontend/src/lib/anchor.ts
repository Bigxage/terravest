"use client";

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import idl from "../idl/terravest.json";

const PROGRAM_ID = new PublicKey(
  "GtnVbAsPubGcD1mEG6jUfn6AC47TMrSJmLeeJ9SvFkBz"
);

export function useProgram() {
  const wallet = useWallet();

  const connection = new Connection("https://api.devnet.solana.com");

  const provider = new AnchorProvider(connection, wallet as any, {
    preflightCommitment: "processed",
  });

  // ✅ CORRECT (Anchor v0.30+)
  return new Program({
    idl: idl as Idl,
    programId: PROGRAM_ID,
    provider,
  });
}