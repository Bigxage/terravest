import WalletButton from "@/components/WalletButton";
import WalletStatus from "@/components/WalletStatus";

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-6">TerraVest</h1>
      <WalletButton />
      <WalletStatus />
    </main>
  );
}