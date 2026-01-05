import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Dumbbell, Bell } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Header() {
  const { t, language, setLanguage } = useLanguage();
  
  const navLinks = [
    { href: "/discovery", label: t('nav_discovery') || "Rencontres" },
    { href: "/dashboard", label: t('nav_find_match') || "Find Match" },
    { href: "/profile", label: t('nav_profile') || "Mon Profil" },
    { href: "/activities", label: t('nav_activities') || "Activités" },
    { href: "/notifications", label: t('nav_notifications') || "Notifications" },
  ];

  const LanguageSwitcher = () => (
      <div className="flex gap-1 text-xs font-bold rounded-lg p-1 bg-transparent">
        <button onClick={() => setLanguage('fr')} className={`px-2 py-1 rounded ${language === 'fr' ? 'text-white font-extrabold' : 'text-gray-400 hover:text-white'}`}>FR</button>
        <button onClick={() => setLanguage('de')} className={`px-2 py-1 rounded ${language === 'de' ? 'text-white font-extrabold' : 'text-gray-400 hover:text-white'}`}>DE</button>
        <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded ${language === 'en' ? 'text-white font-extrabold' : 'text-gray-400 hover:text-white'}`}>EN</button>
      </div>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center md:flex-1">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Dumbbell className="h-6 w-6 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] rounded-md p-1 text-white" />
            <span className="font-bold">Spordate</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="hidden items-center space-x-2 md:flex">
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" asChild>
                <Link href="/notifications">
                    <div className="relative">
                        <Bell className="h-5 w-5"/>
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                        </span>
                    </div>
                    <span className="sr-only">Notifications</span>
                </Link>
            </Button>
          <Button variant="ghost" asChild>
            <Link href="/login">{t('nav_login')}</Link>
          </Button>
          <Button asChild className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold">
            <Link href="/signup">{t('nav_signup')}</Link>
          </Button>
        </div>
        <div className="md:hidden flex items-center">
           <LanguageSwitcher />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 pt-12 bg-background">
               <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col space-y-4 text-lg">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="px-4 py-2 rounded-md hover:bg-accent/10">
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="absolute bottom-8 left-4 right-4 flex flex-col space-y-2">
                 <Button variant="outline" asChild className="w-full">
                    <Link href="/login">{t('nav_login')}</Link>
                 </Button>
                 <Button asChild className="w-full bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold">
                   <Link href="/signup">{t('nav_signup')}</Link>
                 </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
