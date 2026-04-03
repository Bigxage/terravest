"use client";

import WalletButton from "@/components/WalletButton";

export default function Navbar() {
  return (
    <div className="flex items-center justify-between px-10 py-5 border-b border-gray-800 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <h1 className="text-2xl font-bold tracking-wide">
        Terra<span className="text-accent">Vest</span>
      </h1>

      <div className="flex items-center gap-6">
        <span className="text-gray-400 text-sm cursor-pointer hover:text-white">
          Properties
        </span>
        <span className="text-gray-400 text-sm cursor-pointer hover:text-white">
          Dashboard
        </span>

        <WalletButton />
      </div>
    </div>
  );
}