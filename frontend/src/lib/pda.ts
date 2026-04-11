import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID } from "@/lib/anchor";

function u64ToLeBuffer(value: number | bigint) {
  const buffer = new ArrayBuffer(8);
  const view = new DataView(buffer);
  view.setBigUint64(0, BigInt(value), true);
  return Buffer.from(buffer);
}

export function getPlatformConfigPda() {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    PROGRAM_ID
  )[0];
}

export function getPropertyPda(propertyId: number | bigint) {
  const buf = u64ToLeBuffer(propertyId);

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