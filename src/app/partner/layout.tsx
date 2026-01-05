"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building, LayoutDashboard, Rocket, LogOut, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname.includes('/login') || pathname.includes('/register');

  const navLinks = [
    { href: "/partner/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
    { href: "/partner/offers", label: "Mes Offres", icon: <Building /> },
    { href: "/partner/wallet", label: "Mon Portefeuille", icon: <Wallet /> },
    { href: "/partner/boost", label: "Boost", icon: <Rocket /> },
  ];

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-black">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05090e] text-gray-200 flex">
      <aside className="w-64 bg-[#0a111a] border-r border-cyan-900/40 p-6 flex-col hidden md:flex">
        <h1 className="text-2xl font-bold text-cyan-400 mb-10">
          Portail Partenaire
        </h1>
        <nav className="flex flex-col space-y-3 flex-1">
          {navLinks.map((link) => (
             <Button key={link.href} variant="ghost" className="justify-start text-lg h-12 text-gray-400 hover:bg-cyan-500/10 hover:text-cyan-300" asChild>
               <Link href={link.href}>
                 {link.icon}
                 <span>{link.label}</span>
               </Link>
            </Button>
          ))}
        </nav>
        <Button variant="outline" className="justify-center text-lg h-12 border-cyan-800 hover:bg-cyan-800/50 hover:text-cyan-200" asChild>
           <Link href="/">
             <LogOut className="mr-2"/> Quitter
           </Link>
        </Button>
      </aside>
      <main className="flex-1 p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}
