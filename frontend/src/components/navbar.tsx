"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import WalletButton from "./wallet-button";

const navLinks = [
  { href: "/properties", label: "Properties" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/learn-more", label: "Learn More" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-xl font-bold tracking-wide transition hover:opacity-90"
        >
          TerraVest
        </Link>

        <nav className="flex flex-wrap items-center gap-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 transition ${
                  isActive
                    ? "border border-emerald-400 bg-emerald-400/10 text-emerald-300"
                    : "border border-white/15 text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          <WalletButton />
        </nav>
      </div>

      <div className="border-t border-white/10 bg-blue-400/10 px-6 py-3 text-center text-sm text-blue-100">
        TerraVest demo runs on <span className="font-semibold">Solana Devnet</span>.
        Connect a devnet wallet and use devnet SOL for testing only.
      </div>
    </header>
  );
}