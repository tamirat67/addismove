"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navigation() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin")) return null;

  return (
    <nav className="bg-[#060267] text-white p-4 fixed top-0 w-full z-50 shadow-md backdrop-blur-sm bg-opacity-90">
      <div className="flex justify-between items-center max-w-md mx-auto">
        <Link href="/" className="font-bold text-xl tracking-wide flex items-center gap-2">
          <span className="text-[#92c01f]">Addis</span>Move
        </Link>
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/wallet" className="hover:text-[#92c01f] transition-colors">Wallet</Link>
          <Link href="/ticket" className="hover:text-[#92c01f] transition-colors">Ticket</Link>
          <Link href="/admin" className="hover:text-[#92c01f] transition-colors">Admin</Link>
        </div>
      </div>
    </nav>
  );
}
