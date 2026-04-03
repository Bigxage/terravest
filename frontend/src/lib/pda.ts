import { PublicKey } from "@solana/web3.js";

const PROGRAM_ID = new PublicKey(
  "GtnVbAsPubGcD1mEG6jUfn6AC47TMrSJmLeeJ9SvFkBz"
);

export function getPlatformConfigPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    PROGRAM_ID
  )[0];
}

export function getPropertyPda(propertyId: number) {
  const buffer = Buffer.alloc(8);
  buffer.writeBigUInt64LE(BigInt(propertyId));

  return PublicKey.findProgramAddressSync(
    [Buffer.from("property"), buffer],
    PROGRAM_ID
  )[0];
}

export function getInvestorPositionPda(
  investor: PublicKey,
  property: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("position"),
      investor.toBuffer(),
      property.toBuffer(),
    ],
    PROGRAM_ID
  )[0];
}