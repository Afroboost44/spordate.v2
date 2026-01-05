"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Activity, Wallet, Globe, Save, RefreshCw } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext"; // Hook pour modifier les textes

export default function AdminDashboard() {
  const { toast } = useToast();
  const { translations, updateTranslations } = useLanguage(); // Utilisation du context
  const [editLang, setEditLang] = useState("fr");
  
  // États factices pour les autres onglets (pour garder le code court ici)
  const [stats] = useState({ revenue: 1250, activeUsers: 42, matches: 18, walletBalance: 1250.00 });

  const handleTextChange = (key: string, value: string) => {
    updateTranslations(editLang, key, value);
  };

  const handleSave = () => {
    toast({ title: "Modifications enregistrées 🌍", description: "Le site a été mis à jour instantanément." });
  };

  if (!translations) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><RefreshCw className="animate-spin mr-2"/> Chargement de l'éditeur...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/50"><Activity className="text-cyan-400 h-8 w-8" /></div>
        <div><h1 className="text-3xl font-bold">Super Admin Dashboard</h1><p className="text-gray-400">Système CMS & Multilingue • v10.0</p></div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800 p-1 flex-wrap h-auto w-full justify-start">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-200">✍️ Éditeur de Contenu</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="partners">Partenaires</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{stats.revenue} CHF</CardTitle></CardHeader></Card>
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{stats.activeUsers}</CardTitle></CardHeader></Card>
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{stats.matches}</CardTitle></CardHeader></Card>
            </div>
        </TabsContent>

        {/* --- NOUVEL ONGLET : ÉDITEUR DE TEXTE --- */}
        <TabsContent value="content">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-400"/> Gestion des Textes & Langues</CardTitle>
                    <Select value={editLang} onValueChange={setEditLang}>
                        <SelectTrigger className="w-full md:w-[180px] bg-black border-gray-700"><SelectValue placeholder="Langue" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="fr">🇫🇷 Français</SelectItem>
                            <SelectItem value="de">🇩🇪 Deutsch</SelectItem>
                            <SelectItem value="en">🇬🇧 English</SelectItem>
                        </SelectContent>
                    </Select>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase">Titre Principal (Hero)</label>
                            <Input value={translations[editLang]?.hero_title || ''} onChange={(e) => handleTextChange('hero_title', e.target.value)} className="bg-black border-gray-700"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase">Sous-titre</label>
                            <Textarea value={translations[editLang]?.hero_subtitle || ''} onChange={(e) => handleTextChange('hero_subtitle', e.target.value)} className="bg-black border-gray-700"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase">Bouton CTA</label>
                            <Input value={translations[editLang]?.cta_button || ''} onChange={(e) => handleTextChange('cta_button', e.target.value)} className="bg-black border-gray-700 text-cyan-400 font-bold"/>
                        </div>
                         <div className="space-y-2">
                            <label className="text-xs text-gray-400 uppercase">Titre Matchmaking</label>
                            <Input value={translations[editLang]?.feature_match_title || ''} onChange={(e) => handleTextChange('feature_match_title', e.target.value)} className="bg-black border-gray-700"/>
                        </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-800">
                        <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-500 font-bold"><Save className="mr-2 h-4 w-4"/> Publier les changements ({editLang.toUpperCase()})</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="users"><div className="text-gray-500">Voir onglet Utilisateurs précédent...</div></TabsContent>
        <TabsContent value="partners"><div className="text-gray-500">Voir onglet Partenaires précédent...</div></TabsContent>
        <TabsContent value="business"><div className="text-gray-500">Voir onglet Business précédent...</div></TabsContent>
      </Tabs>
    </div>
  );
}