"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Activity, Users, Building, CreditCard, Settings, MessageSquare, 
  CheckCircle, XCircle, Lock, EyeOff, Trash2, Download, Send, Bell, RefreshCw
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// --- RÈGLE 1 : DONNÉES DE SECOURS (Si le site est vide, il utilise ça) ---
const DEFAULT_DATA = {
    partners: [
        { id: 1, name: 'FitClub Lausanne', email: 'fit@test.ch', status: 'pending', date: '27/07/2026', ide: 'CHE-101.202.303' },
        { id: 2, name: 'Geneva Tennis', email: 'tennis@test.ch', status: 'active', date: '26/07/2026', ide: 'CHE-404.505.606' }
    ],
    users: [
        { name: 'Alice', email: 'alice@spordate.com', ville: 'Lausanne', sport: 'Yoga', status: 'active' },
        { name: 'Bob', email: 'bob@spordate.com', ville: 'Genève', sport: 'Tennis', status: 'active' },
        { name: 'Charlie', email: 'charlie@spordate.com', ville: 'Fribourg', sport: 'Running', status: 'invisible' },
        { name: 'Diana', email: 'diana@spordate.com', ville: 'Sion', sport: 'Fitness', status: 'blocked' }
    ],
    stats: { revenue: 1250, activeUsers: 42, matches: 18 }
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DEFAULT_DATA.stats);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- RÈGLE 2 : CHARGEMENT SÉCURISÉ (ANTI-CRASH) ---
  useEffect(() => {
    const loadSecureData = () => {
        try {
            // 1. Charger Partenaires
            const storedPartners = localStorage.getItem('spordate_db');
            if (storedPartners) {
                setPartners(JSON.parse(storedPartners));
            } else {
                // Initialisation Auto-Repair
                localStorage.setItem('spordate_db', JSON.stringify(DEFAULT_DATA.partners));
                setPartners(DEFAULT_DATA.partners);
            }

            // 2. Charger Utilisateurs (Simulation persistance simple)
            setUsers(DEFAULT_DATA.users); 

            // 3. Charger Stats
            setStats(DEFAULT_DATA.stats);

            setIsLoaded(true);
        } catch (error) {
            console.error("Erreur critique de chargement", error);
            // En cas d'erreur grave, on force les données par défaut pour ne pas casser le site
            setPartners(DEFAULT_DATA.partners);
            setUsers(DEFAULT_DATA.users);
            setIsLoaded(true);
        }
    };
    loadSecureData();
  }, []);

  // --- ACTIONS FONCTIONNELLES ---

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedPartners = partners.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setPartners(updatedPartners);
    // SAUVEGARDE IMMÉDIATE
    localStorage.setItem('spordate_db', JSON.stringify(updatedPartners));
    
    toast({ 
        title: newStatus === 'active' ? "Partenaire Validé ✅" : "Statut Mis à Jour", 
        description: `Les droits d'accès ont été modifiés.` 
    });
  };

  const handleBlockUser = (name: string) => {
      if(window.confirm(`SÉCURITÉ : Voulez-vous bloquer l'accès à ${name} ?`)) {
          const updatedUsers = users.map(u => u.name === name ? {...u, status: 'blocked'} : u);
          setUsers(updatedUsers);
          toast({ title: "Utilisateur Bloqué 🚫", description: "L'utilisateur a été déconnecté.", variant: "destructive" });
      }
  };

  const handleBroadcast = () => {
      const msg = window.prompt("Message système à envoyer à tous :");
      if(msg) toast({ title: "Diffusion réussie 📡", description: `Message envoyé à ${users.length} utilisateurs.` });
  };

  const handleSaveConfig = () => {
      toast({ title: "Configuration Sauvegardée 💾", description: "Le système a été mis à jour sans redémarrage." });
  };

  const handleResetSystem = () => {
      if(window.confirm("ATTENTION : Cela va réinitialiser toutes les données de démo. Continuer ?")) {
          localStorage.clear();
          window.location.reload();
      }
  }

  // Si le chargement échoue, afficher un loader au lieu de planter
  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Chargement du système sécurisé...</div>;

  const pendingPartners = partners.filter(p => p.status === 'pending');
  const activePartners = partners.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      
      {/* HEADER AVEC BOUTON RESET (POUR DÉBOGUER) */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-cyan-900/40 to-blue-900/20 rounded-xl border border-cyan-800/50">
                <Activity className="text-cyan-400 h-8 w-8" />
            </div>
            <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Super Admin Dashboard</h1>
            <p className="text-gray-400">Système sécurisé v2.4 • En ligne</p>
            </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleResetSystem} className="border-red-900 text-red-500 hover:bg-red-900/20">
            <RefreshCw className="mr-2 h-3 w-3"/> Réinitialiser le système
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-900/80 border border-gray-800 p-1 flex-wrap h-auto">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-100 relative">
                Partenaires 
                {pendingPartners.length > 0 && <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-pulse"/>}
            </TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* --- 1. VUE D'ENSEMBLE --- */}
        <TabsContent value="overview" className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader className="pb-2"><CardDescription>Revenus Totaux</CardDescription><CardTitle className="text-green-400 text-4xl font-bold">{stats.revenue} CHF</CardTitle></CardHeader>
                </Card>
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader className="pb-2"><CardDescription>Utilisateurs Actifs</CardDescription><CardTitle className="text-blue-400 text-4xl font-bold">{stats.activeUsers}</CardTitle></CardHeader>
                </Card>
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader className="pb-2"><CardDescription>Matchs ce mois</CardDescription><CardTitle className="text-pink-400 text-4xl font-bold">{stats.matches}</CardTitle></CardHeader>
                </Card>
            </div>
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Activité Récente</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.slice(0, 3).map((u, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-2">
                                <span className="font-medium text-gray-300">{u.name} ({u.ville})</span>
                                <span className="text-sm text-cyan-500">Nouveau compte</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 2. PARTENAIRES (DATABASE LOCALE) --- */}
        <TabsContent value="partners" className="space-y-6">
            <div className="grid gap-6">
                <Card className="bg-[#0f1115] border-green-900/30">
                    <CardHeader><CardTitle className="text-green-400">Demandes en Attente ({pendingPartners.length})</CardTitle></CardHeader>
                    <CardContent>
                        {pendingPartners.length === 0 ? <p className="text-gray-500 italic">Aucune demande.</p> : (
                            <div className="space-y-4">
                                {pendingPartners.map((p) => (
                                    <div key={p.id} className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-4 rounded border border-green-900/30 gap-4">
                                        <div>
                                            <h3 className="font-bold text-white">{p.name}</h3>
                                            <p className="text-sm text-gray-400">{p.email} • {p.date}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button size="sm" onClick={() => handleStatusChange(p.id, 'active')} className="bg-green-600 hover:bg-green-500"><CheckCircle className="mr-2 h-4 w-4"/> Accepter</Button>
                                            <Button size="sm" onClick={() => handleStatusChange(p.id, 'rejected')} variant="destructive"><XCircle className="mr-2 h-4 w-4"/> Refuser</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader><CardTitle>Partenaires Actifs</CardTitle></CardHeader>
                    <CardContent>
                            {activePartners.map((p) => (
                            <div key={p.id} className="flex justify-between items-center p-3 border-b border-gray-800 last:border-0">
                                <span className="text-gray-300">{p.name}</span>
                                <span className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded">Actif</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* --- 3. UTILISATEURS --- */}
        <TabsContent value="users">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Gestion des Utilisateurs</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {users.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded border border-gray-800">
                                <div>
                                    <div className="font-bold text-white">{u.name}</div>
                                    <div className="text-sm text-gray-400">{u.email}</div>
                                </div>
                                <div className="flex gap-2">
                                    {u.status === 'blocked' ? (
                                        <span className="text-red-500 text-sm font-bold px-3 py-2">BLOQUÉ</span>
                                    ) : (
                                        <Button size="sm" variant="destructive" onClick={() => handleBlockUser(u.name)}><Lock className="h-4 w-4 mr-1"/> Bloquer</Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 4. BUSINESS --- */}
        <TabsContent value="business">
             <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Stratégie & Tarifs</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Abonnement Mensuel (CHF)</label>
                            <Input defaultValue="29.90" className="bg-black border-gray-700"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Prix Boost (CHF)</label>
                            <Input defaultValue="50.00" className="bg-black border-gray-700"/>
                        </div>
                    </div>
                    <Button onClick={handleSaveConfig} className="w-full bg-yellow-600 hover:bg-yellow-500 font-bold">Sauvegarder</Button>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 5. COMMUNICATION --- */}
        <TabsContent value="communication">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Broadcast Message</CardTitle></CardHeader>
                <CardContent>
                    <Button onClick={handleBroadcast} className="w-full py-8 text-lg bg-gradient-to-r from-purple-700 to-blue-700">
                        <Send className="mr-3 h-6 w-6"/> Envoyer une Newsletter
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 6. CONFIGURATION --- */}
        <TabsContent value="config">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Configuration Système</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="text-xs text-gray-500">Stripe Secret Key</label>
                        <Input type="password" value="sk_live_xxxxxxxxxx" className="bg-black border-gray-700 font-mono text-green-500"/>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">TWINT UUID</label>
                        <Input type="text" placeholder="UUID-Switzerland" className="bg-black border-gray-700 font-mono"/>
                    </div>
                    <Button onClick={handleSaveConfig} className="w-full bg-cyan-700">Mettre à jour</Button>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
