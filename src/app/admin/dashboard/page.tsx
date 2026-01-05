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
  CheckCircle, XCircle, Lock, EyeOff, Trash2, Download, Send, Bell, RefreshCw, DollarSign, Heart
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// --- RÈGLE ANTI-CRASH : DONNÉES DE SECOURS ---
// Cette constante est votre "Roue de Secours". Si le navigateur perd la mémoire,
// le site utilise ces données au lieu d'afficher une page blanche.
const DEFAULT_DATA = {
    partners: [
        { id: 1, name: 'FitClub Lausanne', email: 'fit@test.ch', status: 'pending', date: '27/07/2026', ide: 'CHE-101.202.303' },
        { id: 2, name: 'Geneva Tennis', email: 'tennis@test.ch', status: 'active', date: '26/07/2026', ide: 'CHE-404.505.606' }
    ],
    users: [
        { id: 1, name: 'Alice', email: 'alice@spordate.com', ville: 'Lausanne', sport: 'Yoga', status: 'active' },
        { id: 2, name: 'Bob', email: 'bob@spordate.com', ville: 'Genève', sport: 'Tennis', status: 'active' },
        { id: 3, name: 'Charlie', email: 'charlie@spordate.com', ville: 'Fribourg', sport: 'Running', status: 'invisible' },
        { id: 4, name: 'Diana', email: 'diana@spordate.com', ville: 'Sion', sport: 'Fitness', status: 'blocked' }
    ],
    stats: { revenue: 1250, activeUsers: 42, matches: 18 }
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DEFAULT_DATA.stats);
  const [isLoaded, setIsLoaded] = useState(false);

  // --- CHARGEMENT SÉCURISÉ (SAFE MODE) ---
  useEffect(() => {
    const loadSecureData = () => {
        try {
            // 1. Tenter de lire la mémoire du navigateur
            const storedPartners = localStorage.getItem('spordate_db');
            
            // 2. Si vide ou corrompu, activer la sauvegarde (DEFAULT_DATA)
            if (storedPartners) {
                setPartners(JSON.parse(storedPartners));
            } else {
                console.log("⚠️ Mémoire vide : Chargement des données de secours.");
                localStorage.setItem('spordate_db', JSON.stringify(DEFAULT_DATA.partners));
                setPartners(DEFAULT_DATA.partners);
            }

            // Chargement des autres données (Utilisateurs & Stats)
            setUsers(DEFAULT_DATA.users); 
            setStats(DEFAULT_DATA.stats);

            setIsLoaded(true); // Le site est prêt
        } catch (error) {
            console.error("ERREUR CRITIQUE DÉTECTÉE :", error);
            // 3. En cas d'erreur grave, forcer le mode sans échec
            setPartners(DEFAULT_DATA.partners);
            setUsers(DEFAULT_DATA.users);
            setStats(DEFAULT_DATA.stats);
            setIsLoaded(true);
            toast({ title: "Mode Sans Échec Activé", description: "Le site a récupéré les données après une erreur.", variant: "destructive" });
        }
    };
    loadSecureData();
  }, []);

  // --- ACTIONS FONCTIONNELLES ---

  const handlePartnerStatus = (id: number, newStatus: string) => {
    const updatedPartners = partners.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setPartners(updatedPartners);
    localStorage.setItem('spordate_db', JSON.stringify(updatedPartners)); // Sauvegarde immédiate
    
    toast({ 
        title: newStatus === 'active' ? "Partenaire Accepté ✅" : "Statut Mis à Jour", 
        description: `La modification est enregistrée.` 
    });
  };

  const handleUserAction = (name: string, action: string) => {
      if(action === 'block') {
          if(window.confirm(`SÉCURITÉ : Voulez-vous bloquer l'accès à ${name} ?`)) {
             setUsers(users.map(u => u.name === name ? {...u, status: 'blocked'} : u));
             toast({ title: "Utilisateur Bloqué 🚫", variant: "destructive" });
          }
      } else if (action === 'delete') {
          if(window.confirm(`Supprimer définitivement ${name} ?`)) {
             setUsers(users.filter(u => u.name !== name));
             toast({ title: "Compte Supprimé 🗑️" });
          }
      }
  };

  const handleSaveConfig = () => {
      toast({ title: "Sauvegarde Réussie 💾", description: "Paramètres mis à jour." });
  };

  const handleBroadcast = () => {
      const msg = window.prompt("Saisissez votre message :");
      if(msg) toast({ title: "Message Envoyé 🚀", description: `Envoyé à ${users.length} utilisateurs.` });
  };

  // Écran de chargement pour éviter le "flash" blanc
  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><RefreshCw className="animate-spin mr-2"/> Chargement sécurisé...</div>;

  const pendingPartners = partners.filter(p => p.status === 'pending');
  const activePartners = partners.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      
      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/50">
            <Activity className="text-cyan-400 h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
          <p className="text-gray-400">Système Sécurisé • v3.0 Final</p>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800 p-1 w-full justify-start h-auto flex-wrap">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="partners" className="relative">
                Partenaires 
                {pendingPartners.length > 0 && <span className="ml-2 bg-green-500 text-black text-[10px] px-1.5 rounded-full font-bold">{pendingPartners.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* --- 1. VUE D'ENSEMBLE --- */}
        <TabsContent value="overview" className="space-y-6 animate-in fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#0f1115] border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign size={100} /></div>
                    <CardHeader className="pb-2"><CardDescription>Revenus Totaux</CardDescription><CardTitle className="text-white text-4xl font-bold">{stats.revenue} CHF</CardTitle></CardHeader>
                    <CardContent><div className="text-green-500 text-sm font-bold flex items-center">↑ +12% ce mois</div></CardContent>
                </Card>
                <Card className="bg-[#0f1115] border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={100} /></div>
                    <CardHeader className="pb-2"><CardDescription>Utilisateurs Actifs</CardDescription><CardTitle className="text-white text-4xl font-bold">{stats.activeUsers}</CardTitle></CardHeader>
                    <CardContent><div className="text-blue-500 text-sm font-bold flex items-center">42 Connectés</div></CardContent>
                </Card>
                <Card className="bg-[#0f1115] border-gray-800 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Heart size={100} /></div>
                    <CardHeader className="pb-2"><CardDescription>Matchs ce mois</CardDescription><CardTitle className="text-white text-4xl font-bold">{stats.matches}</CardTitle></CardHeader>
                    <CardContent><div className="text-pink-500 text-sm font-bold flex items-center">18 Rencontres</div></CardContent>
                </Card>
            </div>

            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Derniers Inscrits</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {users.slice(0, 4).map((u, i) => (
                            <div key={i} className="flex justify-between items-center border-b border-gray-800 pb-3 last:border-0 last:pb-0">
                                <div><span className="font-bold text-white block">{u.name}</span><span className="text-xs text-gray-500">{u.ville}</span></div>
                                <span className="text-sm text-cyan-400 font-medium">{u.sport}</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 2. PARTENAIRES --- */}
        <TabsContent value="partners" className="space-y-6">
            <Card className="bg-green-950/10 border-green-900/30">
                <CardHeader><CardTitle className="text-green-400">Demandes Partenaire en Attente ({pendingPartners.length})</CardTitle></CardHeader>
                <CardContent>
                    {pendingPartners.length === 0 ? <p className="text-gray-500 italic">Aucune demande en attente.</p> : (
                        <div className="space-y-4">
                            {pendingPartners.map((p) => (
                                <div key={p.id} className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-4 rounded border border-green-900/30 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{p.name}</h3>
                                        <p className="text-sm text-gray-400">Demandé le: {p.date}</p>
                                        <p className="text-xs text-gray-500">{p.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handlePartnerStatus(p.id, 'active')} className="bg-transparent border border-green-600 text-green-500 hover:bg-green-600 hover:text-white"><CheckCircle className="mr-2 h-4 w-4"/> Accepter</Button>
                                        <Button size="sm" onClick={() => handlePartnerStatus(p.id, 'rejected')} className="bg-transparent border border-red-600 text-red-500 hover:bg-red-600 hover:text-white"><XCircle className="mr-2 h-4 w-4"/> Refuser</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Gestion Financière Partenaire</CardTitle><CardDescription>Commission par défaut : <span className="text-green-400 font-bold">15%</span></CardDescription></CardHeader>
                <CardContent>
                     {activePartners.length === 0 ? <p className="text-gray-500 italic">Aucun partenaire actif.</p> : (
                        <div className="space-y-2">
                             {activePartners.map((p) => (
                                <div key={p.id} className="flex justify-between items-center p-4 bg-black/20 rounded hover:bg-gray-900 transition border border-gray-800/50">
                                    <div>
                                        <span className="text-white font-medium block">{p.name}</span>
                                        <span className="text-xs text-green-500 border border-green-900/50 px-2 py-0.5 rounded-full">Actif</span>
                                    </div>
                                    <Button size="sm" variant="destructive" className="bg-red-900/20 text-red-500 hover:bg-red-600 hover:text-white">Suspendre</Button>
                                </div>
                            ))}
                        </div>
                     )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 3. UTILISATEURS --- */}
        <TabsContent value="users">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion des Utilisateurs</CardTitle>
                    <Button variant="outline" onClick={() => toast({title: "Export en cours..."})} className="border-blue-900 text-blue-400"><Download className="mr-2 h-4 w-4"/> Exporter CSV</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {users.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded border border-gray-800">
                                <div className="flex-1">
                                    <div className="font-bold text-white">{u.name}</div>
                                    <div className="text-sm text-gray-400">{u.email}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold mr-4 ${u.status === 'active' ? 'bg-green-900/30 text-green-500' : u.status === 'blocked' ? 'bg-red-900/30 text-red-500' : 'bg-yellow-900/30 text-yellow-500'}`}>
                                    {u.status === 'active' ? 'Actif' : u.status}
                                </span>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleUserAction(u.name, 'block')} className="text-red-400 hover:bg-red-900/20"><Lock className="h-4 w-4 mr-1"/> Bloquer</Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleUserAction(u.name, 'delete')} className="text-gray-600 hover:text-red-500"><Trash2 className="h-4 w-4"/></Button>
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
                <CardHeader><CardTitle className="text-yellow-500">Stratégie Business & Tarification</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Prix Abonnement Mensuel User (CHF)</label>
                            <Input defaultValue="29.90" className="bg-black border-gray-700 h-12"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Prix Boost Partenaire (CHF / 24h)</label>
                            <Input defaultValue="50.00" className="bg-black border-gray-700 h-12"/>
                        </div>
                    </div>
                    
                    <div className="bg-black/40 p-4 rounded border border-gray-800 flex items-center justify-between">
                        <span className="text-white font-medium">Accès gratuit par parrainage</span>
                        <Switch />
                    </div>

                    <Button onClick={handleSaveConfig} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold h-12">
                        Sauvegarder la Stratégie
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 5. COMMUNICATION --- */}
        <TabsContent value="communication">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Centre de Messages</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <Button onClick={handleBroadcast} className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500">
                        <Send className="mr-3 h-5 w-5"/> Envoyer une Newsletter à TOUS
                    </Button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="h-20 flex flex-col gap-2 border-gray-800 hover:bg-gray-800">
                            <Users className="h-5 w-5"/> Aux Nouveaux
                        </Button>
                        <Button variant="outline" className="h-20 flex flex-col gap-2 border-gray-800 hover:bg-gray-800">
                            <Building className="h-5 w-5"/> Aux Partenaires
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- 6. CONFIGURATION --- */}
        <TabsContent value="config">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Paramètres Système</CardTitle></CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Nom du site</label>
                        <Input defaultValue="Spordate" className="bg-black border-gray-700"/>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-6">
                        <h3 className="font-bold text-cyan-400 mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4"/> Connectivité Bancaire</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">Stripe Secret Key</label>
                                <Input type="password" value="sk_live_xxxxxxxxxxxxxxxxxxxxxx" className="bg-black border-gray-700 font-mono text-xs text-green-500"/>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">TWINT UUID (Suisse)</label>
                                <Input type="text" placeholder="UUID-Switzerland-xxxx" className="bg-black border-gray-700 font-mono text-xs"/>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-6">
                        <h3 className="font-bold text-yellow-500 mb-4">Documents Légaux (CGU)</h3>
                        <Textarea className="h-32 bg-black border-gray-700 text-xs text-gray-300" defaultValue="Article 1: Objet... Article 2: Annulation..."/>
                    </div>
                    
                    <Button onClick={handleSaveConfig} className="w-full bg-cyan-700 hover:bg-cyan-600 font-bold h-10">
                        Mettre à jour la plateforme
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}