import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "@/lib/anchor";

export function getPlatformConfigPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    PROGRAM_ID
  )[0];
}

export function getPropertyPda(propertyId: number | bigint) {
  const buf = Buffer.alloc(8);
  buf.writeBigUInt64LE(BigInt(propertyId));

  return PublicKey.findProgramAddressSync(
    [Buffer.from("property"), buf],
    PROGRAM_ID
  )[0];
}

export function getInvestorPositionPda(
  investor: PublicKey,
  property: PublicKey
) {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("position"), investor.toBuffer(), property.toBuffer()],
    PROGRAM_ID
  )[0];
}