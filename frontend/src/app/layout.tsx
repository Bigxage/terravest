import "./globals.css";
import SolanaProvider from "@/components/SolanaProvider";

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
    <html lang="en">
      <body>
        <SolanaProvider>{children}</SolanaProvider>
      </body>
    </html>
  );
}