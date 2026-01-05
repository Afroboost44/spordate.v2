"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Users, MapPin, MessageSquare, Dumbbell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // Import du hook
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function Home() {
  const { t } = useLanguage(); // Utilisation des textes dynamiques

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      
      <Header />
      
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
                <Button asChild size="lg" className="h-14 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-lg shadow-primary/20">
                    <Link href="/signup">
                        {t('cta_button')} <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
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
