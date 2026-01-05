"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, Users, CreditCard, MessageSquare, CheckCircle, XCircle, 
  Lock, Eye, EyeOff, Trash2, Download, Send, Bell, RefreshCw, 
  DollarSign, Heart, Save, Wallet, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// --- RÈGLE 1 : DONNÉES DE SECOURS (ANTI-CRASH) ---
// Si le système ne trouve rien, il utilise ceci au lieu de planter.
const DEFAULT_DATA = {
    partners: [
        { id: 1, name: 'FitClub Lausanne', email: 'fit@test.ch', status: 'pending', date: '27/07/2026', commission: 15 },
        { id: 2, name: 'Geneva Tennis', email: 'tennis@test.ch', status: 'active', date: '26/07/2026', commission: 15 }
    ],
    users: [
        { id: 1, name: 'Alice', email: 'alice@spordate.com', status: 'active', lastLogin: 'Hier' },
        { id: 2, name: 'Bob', email: 'bob@spordate.com', status: 'active', lastLogin: 'Il y a 2 jours' },
        { id: 3, name: 'Charlie', email: 'charlie@spordate.com', status: 'invisible', lastLogin: 'Il y a 1 mois' },
        { id: 4, name: 'Diana', email: 'diana@spordate.com', status: 'blocked', lastLogin: 'Jamais' }
    ],
    stats: { revenue: 1250, activeUsers: 42, matches: 18, walletBalance: 1250.00 }
};

export default function AdminDashboard() {
  const { toast } = useToast();
  
  // Initialisation avec des tableaux vides pour éviter les erreurs "undefined"
  const [partners, setPartners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DEFAULT_DATA.stats);
  const [isLoaded, setIsLoaded] = useState(false);
  const [directMessage, setDirectMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState("");

  // --- RÈGLE 2 : CHARGEMENT SÉCURISÉ ---
  useEffect(() => {
    const loadData = () => {
        try {
            // Tentative de lecture de la mémoire
            const storedPartners = localStorage.getItem('spordate_db_partners');
            const storedUsers = localStorage.getItem('spordate_db_users');
            const storedStats = localStorage.getItem('spordate_db_stats');
            
            // Si données corrompues ou absentes -> Utiliser DEFAULT_DATA
            setPartners(storedPartners ? JSON.parse(storedPartners) : DEFAULT_DATA.partners);
            setUsers(storedUsers ? JSON.parse(storedUsers) : DEFAULT_DATA.users);
            setStats(storedStats ? JSON.parse(storedStats) : DEFAULT_DATA.stats);

        } catch (error) {
            console.error("ERREUR SYSTÈME DÉTECTÉE (Récupération auto):", error);
            // Filet de sécurité ultime
            setPartners(DEFAULT_DATA.partners);
            setUsers(DEFAULT_DATA.users);
            setStats(DEFAULT_DATA.stats);
        } finally {
            setIsLoaded(true);
        }
    };
    loadData();
  }, []);

  const saveToDb = (key: string, data: any) => {
      try {
          localStorage.setItem(key, JSON.stringify(data));
      } catch (e) {
          console.error("Erreur de sauvegarde", e);
          toast({ title: "Erreur sauvegarde", variant: "destructive" });
      }
  };

  // --- LOGIQUE PARTENAIRES ---
  const handlePartnerStatus = (id: number, newStatus: string) => {
    const updatedPartners = partners.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setPartners(updatedPartners);
    saveToDb('spordate_db_partners', updatedPartners);
    toast({ title: newStatus === 'active' ? "Partenaire Validé ✅" : "Partenaire Refusé ❌" });
  };

  const handleCommissionChange = (id: number, newRate: string) => {
      const updatedPartners = partners.map(p => p.id === id ? { ...p, commission: parseInt(newRate) || 15 } : p);
      setPartners(updatedPartners);
      saveToDb('spordate_db_partners', updatedPartners);
      toast({ title: "Commission mise à jour 💰" });
  };

  // --- LOGIQUE UTILISATEURS ---
  const handleUserAction = (id: number, action: string) => {
      let updatedUsers = [...users];
      const userIndex = updatedUsers.findIndex(u => u.id === id);
      if (userIndex === -1) return;
      
      const user = updatedUsers[userIndex];

      if(action === 'block') {
          if(window.confirm(`Bloquer ${user.name} ?`)) user.status = 'blocked';
      } else if (action === 'toggle_invisible') {
          user.status = user.status === 'invisible' ? 'active' : 'invisible';
          toast({ title: "Visibilité changée", description: `Statut : ${user.status}` });
      } else if (action === 'delete') {
          if(window.confirm(`Supprimer définitivement ${user.name} ?`)) {
              updatedUsers = updatedUsers.filter(u => u.id !== id);
          }
      }
      setUsers(updatedUsers);
      saveToDb('spordate_db_users', updatedUsers);
  };

  // --- LOGIQUE BUSINESS ---
  const handleWithdraw = () => {
      const amount = stats.walletBalance || 0;
      if (amount <= 0) {
           toast({ title: "Solde insuffisant", description: "0.00 CHF disponible.", variant: "destructive" });
           return;
      }
      if(window.confirm(`Virer ${amount.toFixed(2)} CHF vers votre compte ?`)) {
          const newStats = { ...stats, walletBalance: 0 };
          setStats(newStats);
          saveToDb('spordate_db_stats', newStats);
          toast({ title: "Virement Effectué 🏦", description: "Fonds envoyés vers l'IBAN enregistré." });
      }
  };

  // --- LOGIQUE COMMUNICATION ---
  const handleBroadcast = () => {
      const msg = window.prompt("Message système à tous les utilisateurs :");
      if(msg) toast({ title: "Diffusion réussie 🚀", description: `Envoyé à ${users.length} comptes.` });
  };

  // Écran de chargement pour éviter le flash blanc
  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><RefreshCw className="animate-spin mr-2"/> Chargement du système...</div>;

  // Filtrage sécurisé (Règle 3: Safe Mapping)
  const pendingPartners = (partners || []).filter(p => p.status === 'pending');
  const activePartners = (partners || []).filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/50"><Activity className="text-cyan-400 h-8 w-8" /></div>
        <div><h1 className="text-3xl font-bold">Super Admin Dashboard</h1><p className="text-gray-400">Système Sécurisé • v7.0 (Stable)</p></div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800 p-1 flex-wrap h-auto w-full justify-start">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="partners" className="relative">
                Partenaires {pendingPartners.length > 0 && <span className="ml-2 bg-green-500 text-black px-1.5 rounded-full text-xs font-bold">{pendingPartners.length}</span>}
            </TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* 1. VUE D'ENSEMBLE */}
        <TabsContent value="overview">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{stats.revenue} CHF</CardTitle><CardDescription>Revenus Totaux</CardDescription></CardHeader></Card>
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{(users || []).length}</CardTitle><CardDescription>Utilisateurs</CardDescription></CardHeader></Card>
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{stats.matches}</CardTitle><CardDescription>Matchs</CardDescription></CardHeader></Card>
            </div>
        </TabsContent>

        {/* 2. PARTENAIRES */}
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
                <CardHeader><CardTitle>Partenaires Actifs & Commissions</CardTitle></CardHeader>
                <CardContent>
                    {activePartners.length === 0 ? <p className="text-gray-500 italic">Aucun partenaire actif.</p> : (
                        <div className="space-y-2">
                            {activePartners.map((p) => (
                            <div key={p.id} className="flex flex-col md:flex-row justify-between items-center p-4 bg-black/20 rounded border border-gray-800/50 gap-4">
                                <div className="flex-1">
                                    <span className="text-white font-medium block">{p.name}</span>
                                    <span className="text-xs text-green-500 border border-green-900/50 px-2 py-0.5 rounded-full">Actif</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-gray-400">Commission (%):</label>
                                    <Input type="number" defaultValue={p.commission || 15} className="w-20 bg-black border-gray-700 h-8 text-center" onBlur={(e) => handleCommissionChange(p.id, e.target.value)}/>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0"><Save className="h-4 w-4 text-cyan-500"/></Button>
                                </div>
                                <Button size="sm" variant="destructive" onClick={() => handlePartnerStatus(p.id, 'rejected')}>Suspendre</Button>
                            </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* 3. UTILISATEURS */}
        <TabsContent value="users">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Gestion des Utilisateurs</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {(users || []).map((u) => (
                            <div key={u.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-black/40 rounded border border-gray-800 gap-4">
                                <div className="flex-1">
                                    <div className="font-bold text-white">{u.name}</div>
                                    <div className="text-sm text-gray-400">{u.email}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.status === 'active' ? 'bg-green-900/30 text-green-500' : u.status === 'invisible' ? 'bg-gray-700 text-gray-300' : 'bg-red-900/30 text-red-500'}`}>{u.status}</span>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => handleUserAction(u.id, 'toggle_invisible')} className="text-gray-400 border border-gray-700">
                                        {u.status === 'invisible' ? <Eye className="h-4 w-4 mr-2"/> : <EyeOff className="h-4 w-4 mr-2"/>}
                                        {u.status === 'invisible' ? 'Visible' : 'Invisible'}
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => handleUserAction(u.id, 'block')} className="text-red-400 hover:bg-red-900/20"><Lock className="h-4 w-4"/></Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleUserAction(u.id, 'delete')} className="text-gray-600 hover:text-red-500"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* 4. BUSINESS */}
        <TabsContent value="business">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-900/50">
                    <CardHeader><CardTitle className="text-yellow-500 flex items-center gap-2"><Wallet className="h-6 w-6"/> Trésorerie Admin</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><p className="text-sm text-gray-400">Solde Disponible</p><h2 className="text-4xl font-bold text-white">{stats.walletBalance.toFixed(2)} CHF</h2></div>
                        <Button onClick={handleWithdraw} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold h-12">Effectuer un virement</Button>
                        <p className="text-xs text-center text-gray-500">Vers IBAN CH76 0000 .... ....</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader><CardTitle>Tarification Globale</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div><label className="text-sm text-gray-400">Prix Abonnement (CHF)</label><Input defaultValue="29.90" className="bg-black border-gray-700"/></div>
                        <div><label className="text-sm text-gray-400">Prix Boost (CHF)</label><Input defaultValue="50.00" className="bg-black border-gray-700"/></div>
                        <Button className="w-full bg-cyan-700">Sauvegarder Tarifs</Button>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>

        {/* 5. COMMUNICATION */}
        <TabsContent value="communication">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader><CardTitle>Message Direct</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Select onValueChange={setSelectedUser}>
                            <SelectTrigger className="bg-black border-gray-700"><SelectValue placeholder="Choisir un utilisateur" /></SelectTrigger>
                            <SelectContent>{(users || []).map(u => <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>)}</SelectContent>
                        </Select>
                        <Textarea placeholder="Votre message..." className="bg-black border-gray-700" value={directMessage} onChange={(e) => setDirectMessage(e.target.value)}/>
                        <Button onClick={() => {toast({title:"Envoyé 📨"}); setDirectMessage("")}} className="w-full bg-blue-600"><Send className="mr-2 h-4 w-4"/> Envoyer</Button>
                    </CardContent>
                </Card>
                <Card className="bg-[#0f1115] border-gray-800">
                    <CardHeader><CardTitle>Campagnes</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <Button onClick={handleBroadcast} className="w-full py-6 text-lg bg-gradient-to-r from-purple-700 to-blue-700"><Bell className="mr-3 h-6 w-6"/> Newsletter Globale</Button>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* 6. CONFIGURATION */}
        <TabsContent value="config">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Configuration & Images</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-900/20 p-4 rounded border border-blue-900/50">
                        <h3 className="text-blue-400 font-bold flex items-center gap-2"><ImageIcon className="h-5 w-5"/> Convertisseur d'Image</h3>
                        <Button variant="outline" className="w-full mt-2 border-blue-500 text-blue-400" onClick={() => window.open('https://imgbb.com/', '_blank')}><ExternalLink className="mr-2 h-4 w-4"/> Ouvrir ImgBB</Button>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Stripe Secret Key</label>
                        <Input type="password" value="sk_live_xxxxxxxxxx" readOnly className="bg-black border-gray-700 text-green-500"/>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}