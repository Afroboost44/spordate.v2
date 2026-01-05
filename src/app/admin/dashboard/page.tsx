"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, XCircle, Users, Building, Activity, CreditCard, MessageSquare, Settings } from 'lucide-react';

export default function AdminDashboard() {
  // Chargement des partenaires depuis le LocalStorage
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const db = JSON.parse(localStorage.getItem('spordate_db') || '[]');
    // Si la DB est vide, on peut mettre des données fictives pour la démo
    if (db.length === 0) {
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
  };

  const pendingPartners = partners.filter(p => p.status === 'pending');
  const activePartners = partners.filter(p => p.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="text-cyan-500 h-8 w-8" />
        <div>
          <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
          <p className="text-gray-400">Centre de contrôle Spordate</p>
        </div>
      </div>

      <Tabs defaultValue="partners" className="space-y-6">
        <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="partners" className="data-[state=active]:bg-cyan-900 data-[state=active]:text-cyan-100">Partenaires</TabsTrigger>
            <TabsTrigger value="business">Business</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-6">
            {/* DEMANDES EN ATTENTE */}
            <Card className="bg-gray-900/50 border-green-900/50">
                <CardHeader><CardTitle className="text-green-400">Demandes Partenaire en Attente ({pendingPartners.length})</CardTitle></CardHeader>
                <CardContent>
                    {pendingPartners.length === 0 ? <p className="text-gray-500 italic">Aucune demande en attente.</p> : (
                        <div className="space-y-4">
                            {pendingPartners.map((p) => (
                                <div key={p.id} className="flex items-center justify-between bg-black/40 p-4 rounded border border-gray-800">
                                    <div>
                                        <h3 className="font-bold text-white">{p.name} <span className="text-xs bg-yellow-500 text-black px-2 rounded">NOUVEAU</span></h3>
                                        <p className="text-sm text-gray-400">Demandé le: {p.date} • {p.email}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleStatusChange(p.id, 'active')} className="bg-green-600 hover:bg-green-500"><CheckCircle className="mr-2 h-4 w-4"/> Accepter</Button>
                                        <Button size="sm" variant="destructive"><XCircle className="mr-2 h-4 w-4"/> Refuser</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* PARTENAIRES ACTIFS */}
            <Card className="bg-gray-900 border-gray-800">
                <CardHeader><CardTitle>Partenaires Actifs</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                         {activePartners.map((p) => (
                            <div key={p.id} className="flex justify-between p-3 border-b border-gray-800 last:border-0">
                                <span className="text-gray-300">{p.name}</span>
                                <span className="text-sm text-green-500 bg-green-900/20 px-2 py-1 rounded">Actif</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
        
        {/* Placeholder pour les autres onglets pour éviter les erreurs */}
        <TabsContent value="overview"><div className="text-gray-500">Vue d'ensemble...</div></TabsContent>
        <TabsContent value="users"><div className="text-gray-500">Gestion utilisateurs...</div></TabsContent>
        <TabsContent value="business"><div className="text-gray-500">Business...</div></TabsContent>
        <TabsContent value="config"><div className="text-gray-500">Config...</div></TabsContent>
      </Tabs>
    </div>
  );
}
