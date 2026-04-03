import "./globals.css";
import SolanaProvider from "@/components/SolanaProvider";
import "@solana/wallet-adapter-react-ui/styles.css";

export const metadata = {
  title: "TerraVest",
  description: "TerraVest frontend",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}