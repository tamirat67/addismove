import Link from "next/link";

export function Navigation() {
  return (
    <nav className="bg-[#060267] text-white p-4 fixed top-0 w-full z-10 shadow-md">
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
