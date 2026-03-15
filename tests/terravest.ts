import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import {
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Commitment,
} from "@solana/web3.js";
import { assert } from "chai";
import { Terravest } from "../target/types/terravest";

describe("terravest", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Terravest as Program<Terravest>;

  const admin = provider.wallet;
  const treasury = Keypair.generate();
  const investor = Keypair.generate();

  const propertyId = new anchor.BN(1);
  const commitment: Commitment = "confirmed";

  const [platformConfigPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("platform_config")],
    program.programId
  );

  const [propertyPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("property"), propertyId.toArrayLike(Buffer, "le", 8)],
    program.programId
  );

  const [investorPositionPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("position"),
      investor.publicKey.toBuffer(),
      propertyPda.toBuffer(),
    ],
    program.programId
  );

  it("Airdrops SOL to treasury and investor", async () => {
    const sig1 = await provider.connection.requestAirdrop(
      treasury.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig1, commitment);

    const sig2 = await provider.connection.requestAirdrop(
      investor.publicKey,
      2 * LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(sig2, commitment);

    const treasuryBalance = await provider.connection.getBalance(
      treasury.publicKey,
      commitment
    );
    const investorBalance = await provider.connection.getBalance(
      investor.publicKey,
      commitment
    );

    assert.isAbove(treasuryBalance, 0, "Treasury was not funded");
    assert.isAbove(investorBalance, 0, "Investor was not funded");
  });

  it("Initializes platform", async () => {
    await program.methods
      .initializePlatform()
      .accountsPartial({
        admin: admin.publicKey,
        treasury: treasury.publicKey,
        platformConfig: platformConfigPda,
      })
      .rpc();

    const config = await program.account.platformConfig.fetch(platformConfigPda);

    assert.equal(config.admin.toBase58(), admin.publicKey.toBase58());
    assert.equal(config.treasury.toBase58(), treasury.publicKey.toBase58());
  });

  it("Creates property", async () => {
    await program.methods
      .createProperty(
        propertyId,
        "Ibadan Apartment Pilot",
        "Ibadan, Nigeria",
        new anchor.BN(0.5 * LAMPORTS_PER_SOL),
        new anchor.BN(200)
      )
      .accountsPartial({
        admin: admin.publicKey,
        platformConfig: platformConfigPda,
        property: propertyPda,
      })
      .rpc();

    const property = await program.account.property.fetch(propertyPda);

    assert.equal(property.name, "Ibadan Apartment Pilot");
    assert.equal(property.location, "Ibadan, Nigeria");
    assert.equal(property.totalUnits.toString(), "200");
    assert.equal(property.unitsSold.toString(), "0");
  });

  it("Invests in property", async () => {
    const investorBalanceBefore = await provider.connection.getBalance(
      investor.publicKey,
      commitment
    );
    assert.isAbove(
      investorBalanceBefore,
      0,
      "Investor has no lamports before investing"
    );

    await program.methods
      .invest(new anchor.BN(2))
      .accountsPartial({
        investor: investor.publicKey,
        platformConfig: platformConfigPda,
        property: propertyPda,
        treasury: treasury.publicKey,
        investorPosition: investorPositionPda,
      })
      .signers([investor])
      .rpc();

    const property = await program.account.property.fetch(propertyPda);
    const position =
      await program.account.investorPosition.fetch(investorPositionPda);

    assert.equal(property.unitsSold.toString(), "2");
    assert.equal(position.unitsOwned.toString(), "2");
  });
});