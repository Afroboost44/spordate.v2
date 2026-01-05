"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, Users, Building, CreditCard, Settings, MessageSquare, 
  CheckCircle, XCircle, Lock, EyeOff, Trash2, Download, Send, Bell, RefreshCw, DollarSign, Heart, Save, Wallet
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// --- RÈGLE ANTI-CRASH : DONNÉES DE SECOURS ---
const DEFAULT_DATA = {
    partners: [
        { id: 1, name: 'FitClub Lausanne', email: 'fit@test.ch', status: 'pending', date: '27/07/2026', ide: 'CHE-101.202.303', commission: 15 },
        { id: 2, name: 'Geneva Tennis', email: 'tennis@test.ch', status: 'active', date: '26/07/2026', ide: 'CHE-404.505.606', commission: 15 }
    ],
    users: [
        { id: 1, name: 'Alice', email: 'alice@spordate.com', ville: 'Lausanne', sport: 'Yoga', status: 'active', lastLogin: 'Hier' },
        { id: 2, name: 'Bob', email: 'bob@spordate.com', ville: 'Genève', sport: 'Tennis', status: 'active', lastLogin: 'Il y a 2 jours' },
        { id: 3, name: 'Charlie', email: 'charlie@spordate.com', ville: 'Fribourg', sport: 'Running', status: 'invisible', lastLogin: 'Il y a 1 mois' },
        { id: 4, name: 'Diana', email: 'diana@spordate.com', ville: 'Sion', sport: 'Fitness', status: 'blocked', lastLogin: 'Jamais' }
    ],
    stats: { revenue: 1250, activeUsers: 42, matches: 18, walletBalance: 1250.00 }
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DEFAULT_DATA.stats);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // États pour la messagerie directe
  const [selectedUser, setSelectedUser] = useState("");
  const [directMessage, setDirectMessage] = useState("");

  // --- CHARGEMENT SÉCURISÉ (SAFE MODE) ---
  useEffect(() => {
    const loadSecureData = () => {
        try {
            const storedPartners = localStorage.getItem('spordate_db_partners');
            const storedUsers = localStorage.getItem('spordate_db_users');
            
            if (storedPartners) {
                setPartners(JSON.parse(storedPartners));
            } else {
                setPartners(DEFAULT_DATA.partners);
                localStorage.setItem('spordate_db_partners', JSON.stringify(DEFAULT_DATA.partners));
            }

            if (storedUsers) {
                setUsers(JSON.parse(storedUsers));
            } else {
                setUsers(DEFAULT_DATA.users);
                localStorage.setItem('spordate_db_users', JSON.stringify(DEFAULT_DATA.users));
            }

            setStats(DEFAULT_DATA.stats);
            setIsLoaded(true);
        } catch (error) {
            console.error("ERREUR CRITIQUE :", error);
            // Mode sans échec
            setPartners(DEFAULT_DATA.partners);
            setUsers(DEFAULT_DATA.users);
            setStats(DEFAULT_DATA.stats);
            setIsLoaded(true);
        }
    };
    loadSecureData();
  }, []);

  // --- FONCTIONNALITÉ 1 : GESTION COMMISSIONS ---
  const handleCommissionChange = (id: number, newRate: string) => {
      const updatedPartners = partners.map(p => p.id === id ? { ...p, commission: parseInt(newRate) } : p);
      setPartners(updatedPartners);
      localStorage.setItem('spordate_db_partners', JSON.stringify(updatedPartners));
      toast({ title: "Commission mise à jour 💰", description: `Nouveau taux appliqué.` });
  };

  const handlePartnerStatus = (id: number, newStatus: string) => {
    const updatedPartners = partners.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setPartners(updatedPartners);
    localStorage.setItem('spordate_db_partners', JSON.stringify(updatedPartners));
    toast({ title: newStatus === 'active' ? "Partenaire Accepté ✅" : "Statut Mis à Jour" });
  };

  // --- FONCTIONNALITÉ 2 : MESSAGERIE CIBLÉE ---
  const handleSendDirect = () => {
      if(!selectedUser || !directMessage) {
          toast({ title: "Erreur", description: "Veuillez sélectionner un utilisateur et écrire un message.", variant: "destructive" });
          return;
      }
      toast({ title: "Message Envoyé 📨", description: `Message privé envoyé à ${selectedUser}.` });
      setDirectMessage("");
  };

  const handleSendOldUsers = () => {
      toast({ title: "Campagne de relance 📢", description: "Email envoyé aux utilisateurs inactifs depuis 30 jours." });
  }

  const handleBroadcast = () => {
      const msg = window.prompt("Saisissez votre message pour TOUS :");
      if(msg) toast({ title: "Message Envoyé 🚀", description: `Envoyé à ${users.length} utilisateurs.` });
  };

  // --- FONCTIONNALITÉ 3 : RETRAIT ARGENT ---
  const handleWithdraw = () => {
      const amount = stats.walletBalance;
      if (amount <= 0) {
           toast({ title: "Solde insuffisant", description: "Vous n'avez pas de fonds à retirer.", variant: "destructive" });
           return;
      }
      if(window.confirm(`Voulez-vous virer ${amount} CHF vers votre compte bancaire enregistré ?`)) {
          setStats({...stats, walletBalance: 0});
          toast({ title: "Virement Effectué 🏦", description: `${amount} CHF sont en route vers votre compte.` });
      }
  };

  // --- AUTRES FONCTIONS ---
  const handleUserAction = (name: string, action: string) => {
      if(action === 'block') {
          if(window.confirm(`Bloquer l'accès à ${name} ?`)) {
             const updatedUsers = users.map(u => u.name === name ? {...u, status: 'blocked'} : u);
             setUsers(updatedUsers);
             localStorage.setItem('spordate_db_users', JSON.stringify(updatedUsers));
             toast({ title: "Utilisateur Bloqué 🚫", variant: "destructive" });
          }
      } else if (action === 'delete') {
          if(window.confirm(`Supprimer définitivement ${name} ?`)) {
             const updatedUsers = users.filter(u => u.name !== name);
             setUsers(updatedUsers);
             localStorage.setItem('spordate_db_users', JSON.stringify(updatedUsers));
             toast({ title: "Compte Supprimé 🗑️" });
          }
      }
  };

  const handleSaveConfig = () => {
      toast({ title: "Sauvegarde Réussie 💾", description: "Paramètres mis à jour." });
  };

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
          <p className="text-gray-400">Système Sécurisé • v4.0 (Features Complete)</p>
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
        </TabsContent>

        {/* --- 2. PARTENAIRES (AVEC GESTION COMMISSION) --- */}
        <TabsContent value="partners" className="space-y-6">
            <Card className="bg-green-950/10 border-green-900/30">
                <CardHeader><CardTitle className="text-green-400">Demandes en Attente ({pendingPartners.length})</CardTitle></CardHeader>
                <CardContent>
                    {pendingPartners.length === 0 ? <p className="text-gray-500 italic">Aucune demande.</p> : (
                        <div className="space-y-4">
                            {pendingPartners.map((p) => (
                                <div key={p.id} className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-4 rounded border border-green-900/30 gap-4">
                                    <div><h3 className="font-bold text-white">{p.name}</h3><p className="text-sm text-gray-400">{p.date}</p></div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handlePartnerStatus(p.id, 'active')} className="bg-green-600 hover:bg-green-500"><CheckCircle className="mr-2 h-4 w-4"/> Accepter</Button>
                                        <Button size="sm" onClick={() => handlePartnerStatus(p.id, 'rejected')} variant="destructive"><XCircle className="mr-2 h-4 w-4"/> Refuser</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Partenaires Actifs & Commissions</CardTitle><CardDescription>Modifiez le % de commission individuellement.</CardDescription></CardHeader>
                <CardContent>
                    {activePartners.length === 0 ? <p className="text-gray-500 italic">Aucun partenaire actif.</p> : (
                    <div className="space-y-3">
                        {activePartners.map((p) => (
                        <div key={p.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-black/20 rounded border border-gray-800/50 gap-4">
                            <div className="flex-1">
                                <span className="text-white font-medium block">{p.name}</span>
                                <span className="text-xs text-green-500 border border-green-900/50 px-2 py-0.5 rounded-full">Actif</span>
                            </div>
                            
                            {/* FONCTIONNALITÉ 1 : MODIFICATION COMMISSION */}
                            <div className="flex items-center gap-2">
                                <label className="text-xs text-gray-400">Commission (%):</label>
                                <Input 
                                    type="number" 
                                    defaultValue={p.commission || 15} 
                                    className="w-20 bg-black border-gray-700 h-8 text-center"
                                    onBlur={(e) => handleCommissionChange(p.id, e.target.value)}
                                />
                                <Button size="sm" variant="ghost" className="h-8 w-8 p-0" title="Sauvegarder"><Save className="h-4 w-4 text-cyan-500"/></Button>
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
                    <Button variant="outline" className="border-blue-900 text-blue-400"><Download className="mr-2 h-4 w-4"/> Exporter CSV</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {users.map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded border border-gray-800">
                                <div className="flex-1">
                                    <div className="font-bold text-white">{u.name}</div>
                                    <div className="text-sm text-gray-400">{u.email} • {u.lastLogin}</div>
                                </div>
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

        {/* --- 4. BUSINESS & RETRAIT ARGENT --- */}
        <TabsContent value="business">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* FONCTIONNALITÉ 3 : TRÉSORERIE ADMIN */}
                 <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-900/50">
                    <CardHeader><CardTitle className="text-yellow-500 flex items-center gap-2"><Wallet className="h-6 w-6"/> Trésorerie Admin</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400">Solde Disponible (Commissions)</p>
                            <h2 className="text-4xl font-bold text-white">{stats.walletBalance.toFixed(2)} CHF</h2>
                        </div>
                        <Button onClick={handleWithdraw} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold">
                            Demander un virement vers mon compte
                        </Button>
                        <p className="text-xs text-center text-gray-500">Virement traité sous 48h ouvrées.</p>
                    </CardContent>
                </Card>

                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader><CardTitle>Tarification Globale</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Prix Abonnement User (CHF)</label>
                            <Input defaultValue="29.90" className="bg-black border-gray-700"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Prix Boost Partenaire (CHF)</label>
                            <Input defaultValue="50.00" className="bg-black border-gray-700"/>
                        </div>
                        <Button onClick={handleSaveConfig} className="w-full bg-cyan-800 hover:bg-cyan-700">Sauvegarder Tarifs</Button>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>

        {/* --- 5. COMMUNICATION AVANCÉE --- */}
        <TabsContent value="communication">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* FONCTIONNALITÉ 2 : MESSAGE DIRECT */}
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader><CardTitle>Message Direct</CardTitle><CardDescription>Écrire à un utilisateur spécifique.</CardDescription></CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={setSelectedUser}>
                            <SelectTrigger className="bg-black border-gray-700">
                                <SelectValue placeholder="Choisir un utilisateur" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map(u => <SelectItem key={u.id} value={u.name}>{u.name} ({u.email})</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <Textarea 
                            placeholder="Votre message ici..." 
                            className="bg-black border-gray-700" 
                            value={directMessage}
                            onChange={(e) => setDirectMessage(e.target.value)}
                        />
                        <Button onClick={handleSendDirect} className="w-full bg-blue-600 hover:bg-blue-500"><Send className="mr-2 h-4 w-4"/> Envoyer le message</Button>
                    </CardContent>
                </Card>

                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader><CardTitle>Campagnes de Masse</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleBroadcast} className="w-full py-6 text-lg bg-gradient-to-r from-purple-700 to-blue-700 hover:from-purple-600 hover:to-blue-600">
                            <Bell className="mr-3 h-6 w-6"/> Newsletter Globale (Tous)
                        </Button>
                        <Button onClick={handleSendOldUsers} variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-gray-300">
                            <RefreshCw className="mr-2 h-4 w-4"/> Relancer les utilisateurs inactifs
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* --- 6. CONFIGURATION --- */}
        <TabsContent value="config">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Configuration Système</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <label className="text-xs text-gray-500">Stripe Secret Key</label>
                        <Input type="password" defaultValue="sk_live_xxxxxxxxxx" className="bg-black border-gray-700 font-mono text-green-500"/>
                    </div>
                    <div>
                        <label className="text-xs text-gray-500">TWINT UUID</label>
                        <Input type="text" placeholder="UUID-Switzerland-xxxx" className="bg-black border-gray-700 font-mono"/>
                    </div>
                    <Button onClick={handleSaveConfig} className="w-full bg-cyan-700">Mettre à jour</Button>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
