"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Activity, Wallet, Globe, Save, RefreshCw, BarChart, Users, Building, Briefcase, Eye } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

export default function AdminDashboard() {
  const { toast } = useToast();
  const { translations, updateTranslations } = useLanguage();
  const [editLang, setEditLang] = useState("fr");
  
  const [stats] = useState({ revenue: 1250, activeUsers: 42, matches: 18 });

  const handleTextChange = (key: string, value: string) => {
    updateTranslations(editLang, key, value);
  };

  const handleSave = () => {
    toast({ title: "Modifications enregistrées 🌍", description: "Le site a été mis à jour instantanément." });
  };
  
  // --- SKELETON COMPONENTS / PLACEHOLDERS ---
  const UsersList = () => (
      <Card className="bg-[#0f1115] border-gray-800">
          <CardHeader>
              <CardTitle>Liste des Utilisateurs</CardTitle>
              <CardDescription>Total: {stats.activeUsers} utilisateurs actifs</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
              <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Nom</TableHead><TableHead>Email</TableHead><TableHead>Inscription</TableHead><TableHead>Statut</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(5)].map((_, i) => (
                      <TableRow key={i}>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-16 rounded-full" /></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
  );

  const PartnersTable = () => (
      <Card className="bg-[#0f1115] border-gray-800">
          <CardHeader><CardTitle>Candidatures Partenaires</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
               <Table>
                  <TableHeader>
                      <TableRow>
                          <TableHead>Nom du Club</TableHead><TableHead>Email</TableHead><TableHead>IDE</TableHead><TableHead>Statut</TableHead><TableHead>Actions</TableHead>
                      </TableRow>
                  </TableHeader>
                  <TableBody>
                     <TableRow><TableCell>Neon Fitness</TableCell><TableCell>contact@neon.ch</TableCell><TableCell>CHE-123.456.789</TableCell><TableCell><Badge variant="outline" className="text-green-400 border-green-700">Validé</Badge></TableCell><TableCell><Button size="sm">Gérer</Button></TableCell></TableRow>
                     <TableRow><TableCell>City Tennis</TableCell><TableCell>info@city-tennis.ch</TableCell><TableCell>CHE-987.654.321</TableCell><TableCell><Badge variant="outline" className="text-yellow-400 border-yellow-700">En attente</Badge></TableCell><TableCell><Button size="sm">Valider</Button></TableCell></TableRow>
                  </TableBody>
              </Table>
          </CardContent>
      </Card>
  );
  
  const BusinessMetrics = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-sm text-gray-400">Revenu Total</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.revenue} CHF</p></CardContent></Card>
        <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-sm text-gray-400">Matchs Créés</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{stats.matches}</p></CardContent></Card>
        <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-sm text-gray-400">Taux d'activité</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">78%</p></CardContent></Card>
    </div>
  );
  
  if (!translations) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><RefreshCw className="animate-spin mr-2"/> Chargement de l'éditeur...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/50"><Activity className="text-cyan-400 h-8 w-8" /></div>
        <div><h1 className="text-3xl font-bold">Super Admin Dashboard</h1><p className="text-gray-400">Système CMS & Multilingue • v10.0</p></div>
      </div>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800 p-1 flex-wrap h-auto w-full justify-start">
            <TabsTrigger value="overview"><BarChart className="mr-2"/>Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="content" className="data-[state=active]:bg-blue-900/40 data-[state=active]:text-blue-200"><Globe className="mr-2"/>Éditeur de Contenu</TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-purple-900/40 data-[state=active]:text-purple-200"><Users className="mr-2"/>Utilisateurs</TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-amber-900/40 data-[state=active]:text-amber-200"><Building className="mr-2"/>Partenaires</TabsTrigger>
            <TabsTrigger value="business" className="data-[state=active]:bg-green-900/40 data-[state=active]:text-green-200"><Briefcase className="mr-2"/>Business</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
             <BusinessMetrics />
        </TabsContent>

        <TabsContent value="content">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-blue-400"/> Gestion des Textes</CardTitle>
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

        <TabsContent value="users">
            <UsersList />
        </TabsContent>
        <TabsContent value="partners">
            <PartnersTable />
        </TabsContent>
        <TabsContent value="business">
            <BusinessMetrics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

    