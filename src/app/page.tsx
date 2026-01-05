"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Users, MapPin, MessageSquare, Dumbbell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // Import du hook
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  const { t, language, setLanguage } = useLanguage(); // Utilisation des textes dynamiques

  // Sélecteur de langue séparé pour une meilleure lisibilité
  const LanguageSwitcher = () => (
      <div className="flex gap-1 text-xs font-bold bg-gray-900 rounded-lg p-1">
        <button onClick={() => setLanguage('fr')} className={`px-2 py-1 rounded ${language === 'fr' ? 'bg-accent text-accent-foreground' : 'text-gray-400 hover:text-white'}`}>FR</button>
        <button onClick={() => setLanguage('de')} className={`px-2 py-1 rounded ${language === 'de' ? 'bg-accent text-accent-foreground' : 'text-gray-400 hover:text-white'}`}>DE</button>
        <button onClick={() => setLanguage('en')} className={`px-2 py-1 rounded ${language === 'en' ? 'bg-accent text-accent-foreground' : 'text-gray-400 hover:text-white'}`}>EN</button>
      </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      {/* Intégration du Header et Footer pour la cohérence */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
            <div className="flex items-center md:flex-1">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Dumbbell className="h-6 w-6 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] rounded-md p-1 text-white" />
                <span className="font-bold">Spordate</span>
            </Link>
            </div>
            <div className="flex items-center space-x-2">
                <LanguageSwitcher />
                <div className="hidden sm:flex items-center space-x-2">
                    <Button variant="ghost" asChild>
                        <Link href="/login">{t('nav_login')}</Link>
                    </Button>
                    <Button asChild className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold">
                        <Link href="/signup">{t('nav_signup')}</Link>
                    </Button>
                </div>
            </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* HERO SECTION DYNAMIQUE */}
        <section className="relative py-20 md:py-32 overflow-hidden text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-primary/10 rounded-full blur-[120px] -z-10" />
            <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-300">
                {t('hero_title')}
            </h1>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                {t('hero_subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup">
                    <Button size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20">
                    {t('cta_button')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
            </div>
            </div>
        </section>

        {/* FEATURES DYNAMIQUE */}
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="p-8 rounded-2xl bg-card border border-border/20 hover:border-accent/50 transition-colors transform hover:-translate-y-2 duration-300">
                <Users className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('feature_match_title')}</h3>
                <p className="text-gray-400">{t('feature_match_desc')}</p>
                </div>
                <div className="p-8 rounded-2xl bg-card border border-border/20 hover:border-accent/50 transition-colors transform hover:-translate-y-2 duration-300">
                <MapPin className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('feature_map_title')}</h3>
                <p className="text-gray-400">{t('feature_map_desc')}</p>
                </div>
                <div className="p-8 rounded-2xl bg-card border border-border/20 hover:border-accent/50 transition-colors transform hover:-translate-y-2 duration-300">
                <MessageSquare className="h-10 w-10 text-accent mb-4" />
                <h3 className="text-xl font-bold mb-2">{t('feature_chat_title')}</h3>
                <p className="text-gray-400">{t('feature_chat_desc')}</p>
                </div>
            </div>
            </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
