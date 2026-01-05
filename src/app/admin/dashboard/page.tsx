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
  CheckCircle, XCircle, Lock, EyeOff, Trash2, Download, Send, Save, Bell
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [partners, setPartners] = useState<any[]>([]);

  // --- LOGIQUE PARTENAIRES (Celle qui marche) ---
  useEffect(() => {
    const db = JSON.parse(localStorage.getItem('spordate_db') || '[]');
    if (db.length === 0) {
        // Données démo si vide
        const demoData = [
            { id: 1, name: 'FitClub Lausanne', email: 'fit@test.ch', status: 'pending', date: '27/07/2026' },
            { id: 2, name: 'Geneva Tennis', email: 'tennis@test.ch', status: 'active', date: '26/07/2026' }
        ];
        localStorage.setItem('spordate_db', JSON.stringify(demoData));
        setPartners(demoData);
    } else {
        setPartners(db);
    }
  }, []);

  const handleStatusChange = (id: number, newStatus: string) => {
    const updatedPartners = partners.map(p => p.id === id ? { ...p, status: newStatus } : p);
    setPartners(updatedPartners);
    localStorage.setItem('spordate_db', JSON.stringify(updatedPartners));
    toast({ title: "Statut mis à jour", description: `Partenaire passé en ${newStatus}` });
  };

  // --- ACTIONS UTILISATEURS ---
  const handleBlockUser = (name: string) => {
      if(window.confirm(`Voulez-vous vraiment bloquer ${name} ?`)) {
          toast({ title: "Utilisateur Bloqué", description: `${name} n'a plus accès au site.`, variant: "destructive" });
      }
  };
  
  const handleExport = () => {
      toast({ title: "Export en cours", description: "Le fichier users.csv est en téléchargement." });
  };

  // --- ACTIONS COMMUNICATION ---
  const handleBroadcast = () => {
      const msg = window.prompt("Entrez votre message pour tous les utilisateurs :");
      if(msg) toast({ title: "Message envoyé", description: `Envoyé à 42 utilisateurs.` });
  };

  // --- ACTIONS CONFIG ---
  const handleSaveConfig = () => {
      toast({ title: "Configuration sauvegardée", description: "Les modifications sont actives." });
  };

  const pendingPartners = partners.filter(p => p.status === 'pending');
  const activePartners = partners.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 pb-20">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-900/20 rounded-lg">
            <Activity className="text-cyan-500 h-8 w-8" />
        </div>
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">Super Admin Dashboard</h1>
          <p className="text-gray-400">Centre de contrôle de l'écosystème Spordate</p>
        </div>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800 p-1 overflow-x-auto flex w-full justify-start">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-100">Partenaires</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        {/* --- ONGLET VUE D'ENSEMBLE --- */}
        <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gray-900/50 border-gray-800"><CardHeader><CardTitle className="text-green-400 text-3xl">1,250 CHF</CardTitle><CardDescription>Revenus Totaux</CardDescription></CardHeader></Card>
                <Card className="bg-gray-900/50 border-gray-800"><CardHeader><CardTitle className="text-blue-400 text-3xl">42</CardTitle><CardDescription>Utilisateurs Actifs</CardDescription></CardHeader></Card>
                <Card className="bg-gray-900/50 border-gray-800"><CardHeader><CardTitle className="text-pink-400 text-3xl">18</CardTitle><CardDescription>Matchs ce mois</CardDescription></CardHeader></Card>
            </div>
        </TabsContent>

        {/* --- ONGLET PARTENAIRES (PERSISTANT) --- */}
        <TabsContent value="partners" className="space-y-6">
            <Card className="bg-gray-900/30 border-green-900/50">
                <CardHeader><CardTitle className="text-green-400 flex items-center gap-2"><Bell className="h-5 w-5"/> Demandes en Attente ({pendingPartners.length})</CardTitle></CardHeader>
                <CardContent>
                    {pendingPartners.length === 0 ? <p className="text-gray-500 italic">Aucune demande.</p> : (
                        <div className="space-y-4">
                            {pendingPartners.map((p) => (
                                <div key={p.id} className="flex flex-col md:flex-row justify-between items-center bg-black/40 p-4 rounded border border-gray-800 gap-4">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{p.name}</h3>
                                        <p className="text-sm text-gray-400">{p.email} • IDE: {p.ide || 'N/A'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleStatusChange(p.id, 'active')} className="bg-green-600 hover:bg-green-500 text-white"><CheckCircle className="mr-2 h-4 w-4"/> Accepter</Button>
                                        <Button size="sm" variant="destructive"><XCircle className="mr-2 h-4 w-4"/> Refuser</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="bg-gray-900/30 border-gray-800">
                <CardHeader><CardTitle>Partenaires Actifs</CardTitle></CardHeader>
                <CardContent>
                     {activePartners.map((p) => (
                        <div key={p.id} className="flex justify-between p-3 border-b border-gray-800 last:border-0">
                            <span className="text-gray-300">{p.name}</span>
                            <span className="text-xs text-green-500 bg-green-900/20 px-2 py-1 rounded border border-green-900/30">Actif</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- ONGLET UTILISATEURS --- */}
        <TabsContent value="users">
            <Card className="bg-gray-900/30 border-gray-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Gestion Utilisateurs</CardTitle>
                    <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4"/> Exporter CSV</Button>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[
                            { name: 'Alice', email: 'alice@test.com', status: 'active' },
                            { name: 'Bob', email: 'bob@test.com', status: 'active' },
                            { name: 'Charlie', email: 'charlie@test.com', status: 'blocked' }
                        ].map((u, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-black/40 rounded border border-gray-800">
                                <div>
                                    <div className="font-bold">{u.name}</div>
                                    <div className="text-sm text-gray-400">{u.email}</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="destructive" onClick={() => handleBlockUser(u.name)}><Lock className="h-4 w-4"/></Button>
                                    <Button size="sm" variant="ghost" className="text-gray-400"><EyeOff className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- ONGLET BUSINESS --- */}
        <TabsContent value="business">
             <Card className="bg-gray-900/30 border-gray-800">
                <CardHeader><CardTitle>Stratégie & Tarifs</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Prix Abonnement Mensuel (CHF)</label>
                            <Input defaultValue="29.90" className="bg-black border-gray-700"/>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-gray-400">Prix Boost Partenaire (24h)</label>
                            <Input defaultValue="50.00" className="bg-black border-gray-700"/>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-black/40 rounded border border-gray-800">
                        <span>Accès gratuit par parrainage</span>
                        <Switch />
                    </div>
                    <Button onClick={handleSaveConfig} className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold">Sauvegarder la Stratégie</Button>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- ONGLET COMMUNICATION --- */}
        <TabsContent value="communication">
            <Card className="bg-gray-900/30 border-gray-800">
                <CardHeader><CardTitle>Centre de Messages</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handleBroadcast} className="w-full py-8 text-lg bg-gradient-to-r from-purple-600 to-blue-600">
                        <Send className="mr-2 h-6 w-6"/> Envoyer une Newsletter à TOUS
                    </Button>
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" className="h-24 flex flex-col gap-2">
                            <Users className="h-6 w-6"/> Aux Nouveaux
                        </Button>
                        <Button variant="outline" className="h-24 flex flex-col gap-2">
                            <Building className="h-6 w-6"/> Aux Partenaires
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* --- ONGLET CONFIGURATION --- */}
        <TabsContent value="config">
            <Card className="bg-gray-900/30 border-gray-800">
                <CardHeader><CardTitle>Paramètres Système</CardTitle></CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm text-gray-400">Nom du site</label>
                        <Input defaultValue="Spordate" className="bg-black border-gray-700"/>
                    </div>
                    
                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="font-bold text-cyan-400 mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4"/> Connectivité Bancaire</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-gray-500">Stripe Secret Key</label>
                                <Input type="password" value="sk_test_..." className="bg-black border-gray-700 font-mono text-xs"/>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500">TWINT UUID (Suisse)</label>
                                <Input type="text" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="bg-black border-gray-700 font-mono text-xs"/>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-gray-800 pt-4">
                        <h3 className="font-bold text-yellow-400 mb-4">Documents Légaux (CGU)</h3>
                        <Textarea className="h-32 bg-black border-gray-700 text-xs" defaultValue="Article 1: Objet... Article 2: Annulation..."/>
                    </div>
                    
                    <Button onClick={handleSaveConfig} className="w-full bg-cyan-600 hover:bg-cyan-500">Mettre à jour la plateforme</Button>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
