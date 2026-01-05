
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
  Activity, Users, CreditCard, MessageSquare, CheckCircle, XCircle, 
  Lock, Eye, EyeOff, Trash2, Download, Send, Bell, RefreshCw, 
  DollarSign, Heart, Save, Wallet, ExternalLink, Image as ImageIcon
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

// --- RÈGLE ANTI-CRASH : DONNÉES DE SECOURS ---
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
  const [partners, setPartners] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(DEFAULT_DATA.stats);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [directMessage, setDirectMessage] = useState("");

  // --- CHARGEMENT SÉCURISÉ ---
  useEffect(() => {
    try {
        const storedPartners = localStorage.getItem('spordate_db_partners');
        const storedUsers = localStorage.getItem('spordate_db_users');
        
        setPartners(storedPartners ? JSON.parse(storedPartners) : DEFAULT_DATA.partners);
        setUsers(storedUsers ? JSON.parse(storedUsers) : DEFAULT_DATA.users);
        
        // On garde les stats locales pour la démo du virement
        const storedStats = localStorage.getItem('spordate_db_stats');
        setStats(storedStats ? JSON.parse(storedStats) : DEFAULT_DATA.stats);

        setIsLoaded(true);
    } catch (error) {
        console.error("Erreur chargement", error);
        setPartners(DEFAULT_DATA.partners);
        setUsers(DEFAULT_DATA.users);
        setStats(DEFAULT_DATA.stats);
        setIsLoaded(true);
    }
  }, []);

  const saveToDb = (key: string, data: any) => {
      localStorage.setItem(key, JSON.stringify(data));
  };

  // --- GESTION UTILISATEURS (AVEC BOUTON INVISIBLE) ---
  const handleUserAction = (id: number, action: string) => {
      let updatedUsers = [...users];
      const userIndex = updatedUsers.findIndex(u => u.id === id);
      if (userIndex === -1) return;

      const user = updatedUsers[userIndex];

      if(action === 'block') {
          if(window.confirm(`Bloquer ${user.name} ?`)) user.status = 'blocked';
      } 
      else if (action === 'toggle_invisible') {
          // CORRECTION POINT 4 : Bascule entre Invisible et Actif
          user.status = user.status === 'invisible' ? 'active' : 'invisible';
          toast({ title: "Visibilité modifiée", description: `Statut : ${user.status}` });
      }
      else if (action === 'delete') {
          if(window.confirm(`Supprimer ${user.name} ?`)) {
              updatedUsers = updatedUsers.filter(u => u.id !== id);
          }
      }
      
      setUsers(updatedUsers);
      saveToDb('spordate_db_users', updatedUsers);
  };

  // --- GESTION VIREMENT (CORRECTION POINT 2) ---
  const handleWithdraw = () => {
      const amount = stats.walletBalance;
      if (amount <= 0) {
           toast({ title: "Solde insuffisant", description: "0 CHF disponible.", variant: "destructive" });
           return;
      }
      if(window.confirm(`Confirmer le virement de ${amount.toFixed(2)} CHF vers votre IBAN ?`)) {
          const newStats = { ...stats, walletBalance: 0 };
          setStats(newStats);
          saveToDb('spordate_db_stats', newStats);
          toast({ 
              title: "Virement en cours 🏦", 
              description: `${amount.toFixed(2)} CHF envoyés. Réception sous 48h.`,
              className: "bg-green-600 text-white"
          });
      }
  };

  if (!isLoaded) return <div className="min-h-screen bg-black flex items-center justify-center text-white"><RefreshCw className="animate-spin mr-2"/> Chargement...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/50"><Activity className="text-cyan-400 h-8 w-8" /></div>
        <div><h1 className="text-3xl font-bold">Super Admin Dashboard</h1><p className="text-gray-400">Système Sécurisé • v5.0 Final</p></div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800 p-1 flex-wrap h-auto">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="partners">Partenaires</TabsTrigger>
            <TabsTrigger value="business">Business & Retraits</TabsTrigger>
            <TabsTrigger value="config">Configuration & Images</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{stats.revenue} CHF</CardTitle><CardDescription>Revenus Totaux</CardDescription></CardHeader></Card>
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{users.length}</CardTitle><CardDescription>Utilisateurs</CardDescription></CardHeader></Card>
                <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-4xl font-bold">{stats.matches}</CardTitle><CardDescription>Matchs</CardDescription></CardHeader></Card>
            </div>
        </TabsContent>

        {/* --- CORRECTION POINT 4 : BOUTON INVISIBLE --- */}
        <TabsContent value="users">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Gestion des Utilisateurs</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {users.map((u) => (
                            <div key={u.id} className="flex flex-col md:flex-row items-center justify-between p-4 bg-black/40 rounded border border-gray-800 gap-4">
                                <div className="flex-1">
                                    <div className="font-bold text-white">{u.name}</div>
                                    <div className="text-sm text-gray-400">{u.email} • {u.lastLogin}</div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${u.status === 'active' ? 'bg-green-900/30 text-green-500' : u.status === 'invisible' ? 'bg-gray-700 text-gray-300' : 'bg-red-900/30 text-red-500'}`}>
                                    {u.status}
                                </span>
                                <div className="flex gap-2">
                                    {/* BOUTON INVISIBLE */}
                                    <Button size="sm" variant="ghost" onClick={() => handleUserAction(u.id, 'toggle_invisible')} className="text-gray-400 hover:text-white border border-gray-700">
                                        {u.status === 'invisible' ? <Eye className="h-4 w-4 mr-2"/> : <EyeOff className="h-4 w-4 mr-2"/>}
                                        {u.status === 'invisible' ? 'Rendre Visible' : 'Invisible'}
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

        <TabsContent value="partners"><div className="text-gray-400">Voir onglet Partenaire précédent... (Code simplifié pour focus)</div></TabsContent>

        {/* --- CORRECTION POINT 2 : VIREMENT --- */}
        <TabsContent value="business">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-900/50">
                    <CardHeader><CardTitle className="text-yellow-500 flex items-center gap-2"><Wallet className="h-6 w-6"/> Trésorerie Admin</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-gray-400">Solde Disponible</p>
                            <h2 className="text-4xl font-bold text-white">{stats.walletBalance.toFixed(2)} CHF</h2>
                        </div>
                        <Button onClick={handleWithdraw} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold h-12">
                            Effectuer un virement
                        </Button>
                        <p className="text-xs text-center text-gray-500">Vers IBAN CH76 0000 .... ....</p>
                    </CardContent>
                </Card>
             </div>
        </TabsContent>

        {/* --- CORRECTION POINT 3 : IMAGES & OUTIL --- */}
        <TabsContent value="config">
            <Card className="bg-[#0f1115] border-gray-800">
                <CardHeader><CardTitle>Gestion des Images</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-blue-900/20 p-4 rounded border border-blue-900/50">
                        <h3 className="text-blue-400 font-bold flex items-center gap-2"><ImageIcon className="h-5 w-5"/> Convertisseur d'Image Gratuit</h3>
                        <p className="text-sm text-gray-300 mt-2 mb-4">
                            Pour afficher une image sur l'application, vous devez d'abord la transformer en lien web (URL).
                        </p>
                        <Button variant="outline" className="w-full border-blue-500 text-blue-400 hover:bg-blue-900/30" onClick={() => window.open('https://imgbb.com/', '_blank')}>
                            <ExternalLink className="mr-2 h-4 w-4"/> Ouvrir le convertisseur (ImgBB)
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Image de couverture par défaut (URL)</label>
                        <div className="flex gap-2">
                            <Input placeholder="https://i.ibb.co/..." className="bg-black border-gray-700"/>
                            <Button variant="secondary">Tester</Button>
                        </div>
                        <p className="text-xs text-gray-500">Collez ici le lien obtenu via le convertisseur.</p>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}

    