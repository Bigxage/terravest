import { PublicKey } from "@solana/web3.js";

export function getTreasuryPublicKey(): PublicKey {
  const raw = process.env.NEXT_PUBLIC_DEMO_TREASURY?.trim();

  if (!raw) {
    throw new Error(
      "Treasury address is missing. Set NEXT_PUBLIC_DEMO_TREASURY in your environment."
    );
  }

  try {
    return new PublicKey(raw);
  } catch {
    throw new Error(
      "Treasury address is invalid. NEXT_PUBLIC_DEMO_TREASURY must be a valid Solana public key."
    );
  }
}