"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { BarChart, Users, Building, Briefcase, Settings, Download, XCircle, CheckCircle, Ban, EyeOff, Trash2, Send, MessageSquare, Users2, User } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";


const users = [
    { id: 'u1', name: 'Alice', email: 'alice@spordate.com', status: 'Actif' },
    { id: 'u2', name: 'Bob', email: 'bob@spordate.com', status: 'Actif' },
    { id: 'u3', name: 'Charlie', email: 'charlie@spordate.com', status: 'Invisible' },
    { id: 'u4', name: 'Diana', email: 'diana@spordate.com', status: 'Bloqué' },
];

const pendingPartners = [
    { id: 'p1', name: 'FitClub Lausanne', demand: '27/07/2024' },
    { id: 'p2', name: 'Geneva Tennis Arena', demand: '26/07/2024' },
];

const activePartners = [
    { id: 'ap1', name: 'Neon Fitness Club', commission: '15%' },
    { id: 'ap2', name: 'City Tennis Court', commission: '15%' },
    { id: 'ap3', name: 'Zen Yoga Studio', commission: '20%' },
];

export default function AdminDashboardPage() {
    const { toast } = useToast();

    const handleConfirmAction = (action: string, userName: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir ${action} l'utilisateur ${userName} ?`)) {
             toast({
                title: "Action exécutée",
                description: `${userName} a été ${action}.`,
            });
        }
    };
    
    const handleSaveStrategy = () => {
        toast({
            title: "Stratégie sauvegardée !",
            description: "Les nouveaux paramètres de tarification et de parrainage ont été appliqués.",
            className: "bg-green-600 text-white border-green-700",
        });
    }

    return (
        <div className="min-h-screen bg-black text-gray-300 p-8">
            <div className="container mx-auto">
                <header className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-100 flex items-center gap-3">
                        <BarChart className="h-8 w-8 text-blue-500" />
                        Super Admin Dashboard
                    </h1>
                    <p className="text-gray-500">Centre de commande de l'écosystème Spordate.</p>
                </header>

                <Tabs defaultValue="users" className="w-full">
                    <TabsList className="grid w-full grid-cols-5 bg-[#111] h-14 p-2">
                        <TabsTrigger value="users" className="h-full text-base gap-2"><Users /> Utilisateurs</TabsTrigger>
                        <TabsTrigger value="partners" className="h-full text-base gap-2"><Building /> Partenaires</TabsTrigger>
                        <TabsTrigger value="business" className="h-full text-base gap-2"><Briefcase /> Business</TabsTrigger>
                        <TabsTrigger value="communication" className="h-full text-base gap-2"><MessageSquare /> Communication</TabsTrigger>
                        <TabsTrigger value="config" className="h-full text-base gap-2"><Settings /> Configuration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="users" className="mt-6">
                        <Card className="bg-[#111] border-gray-800">
                            <CardHeader className="flex flex-row justify-between items-center">
                                <div>
                                    <CardTitle className="text-xl text-gray-200">Gestion des Utilisateurs</CardTitle>
                                    <CardDescription>Actions sur les comptes utilisateurs.</CardDescription>
                                </div>
                                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300">
                                    <Download className="mr-2 h-4 w-4" /> Exporter (CSV)
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-gray-800">
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {users.map((user) => (
                                            <TableRow key={user.id} className="border-gray-800">
                                                <TableCell>{user.name}</TableCell>
                                                <TableCell>{user.email}</TableCell>
                                                <TableCell>
                                                     <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                        user.status === 'Actif' ? 'bg-green-500/20 text-green-400' :
                                                        user.status === 'Invisible' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>{user.status}</span>
                                                </TableCell>
                                                <TableCell className="text-right space-x-1">
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-900/50 hover:text-red-400" onClick={() => handleConfirmAction('bloquer', user.name)}><Ban size={16}/> Bloquer</Button>
                                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-700/50 hover:text-gray-300"><EyeOff size={16}/> Invisible</Button>
                                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-700/50 hover:text-gray-400" onClick={() => handleConfirmAction('supprimer', user.name)}><Trash2 size={16}/> Supprimer</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="partners" className="mt-6 space-y-6">
                        <Card className="bg-[#111] border-green-900/50">
                            <CardHeader>
                                <CardTitle className="text-xl text-green-300">Demandes Partenaire en Attente</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableBody>
                                        {pendingPartners.map((partner) => (
                                            <TableRow key={partner.id} className="border-gray-800">
                                                <TableCell className="font-semibold">{partner.name}</TableCell>
                                                <TableCell>Demandé le: {partner.demand}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-900/50 hover:text-green-300"><CheckCircle size={16}/> Accepter</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-900/50 hover:text-red-400"><XCircle size={16}/> Refuser</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#111] border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-200">Gestion Financière Partenaire</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4 max-w-sm">
                                    <Label htmlFor="commission" className="whitespace-nowrap">Commission par défaut (%)</Label>
                                    <Input id="commission" type="number" defaultValue="15" className="bg-black border-gray-700 w-24" />
                                </div>
                                 <Table>
                                     <TableHeader><TableRow className="border-gray-800"><TableHead>Partenaire Actif</TableHead><TableHead>Commission</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                                     <TableBody>
                                         {activePartners.map(p => (
                                             <TableRow key={p.id} className="border-gray-800">
                                                 <TableCell>{p.name}</TableCell>
                                                 <TableCell>{p.commission}</TableCell>
                                                 <TableCell className="text-right">
                                                     <Button variant="destructive" size="sm">Suspendre</Button>
                                                 </TableCell>
                                             </TableRow>
                                         ))}
                                     </TableBody>
                                 </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="business" className="mt-6">
                        <Card className="bg-[#111] border-yellow-900/50">
                            <CardHeader>
                                <CardTitle className="text-xl text-yellow-300">Stratégie Business & Tarification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 max-w-2xl">
                                <div className="grid grid-cols-2 gap-4 items-end">
                                    <div>
                                        <Label htmlFor="sub-price">Prix Abonnement Mensuel User (CHF)</Label>
                                        <Input id="sub-price" type="number" placeholder="29.90" className="bg-black border-gray-700"/>
                                    </div>
                                    <div>
                                        <Label htmlFor="boost-price">Prix Boost Partenaire (CHF / 24h)</Label>
                                        <Input id="boost-price" type="number" placeholder="50" className="bg-black border-gray-700"/>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-black rounded-md border border-gray-800">
                                    <Label htmlFor="referral-access">Accès gratuit par parrainage</Label>
                                    <Switch id="referral-access" />
                                </div>
                                <Button onClick={handleSaveStrategy} className="bg-yellow-600 hover:bg-yellow-500 text-black font-bold w-full">
                                    Sauvegarder la Stratégie
                                </Button>
                            </CardContent>
                        </Card>
                    </TabsContent>

                     <TabsContent value="communication" className="mt-6">
                        <Card className="bg-[#111] border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-200">Centre de Communication</CardTitle>
                                <CardDescription>Envoyez des messages ciblés ou des annonces générales.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid md:grid-cols-3 gap-6">
                                <Dialog>
                                    <Card className="bg-black/50 border-gray-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2"><Users2/> Envoyer à TOUS</CardTitle>
                                            <CardDescription>Broadcast général à tous les utilisateurs et partenaires.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <DialogTrigger asChild><Button className="w-full">Rédiger</Button></DialogTrigger>
                                        </CardContent>
                                    </Card>
                                    <DialogContent className="bg-[#111] border-gray-800">
                                        <DialogHeader>
                                            <DialogTitle>Message pour tous</DialogTitle>
                                            <DialogDescription>Ce message sera envoyé à tous les membres.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Input placeholder="Sujet" className="bg-black border-gray-700" />
                                            <Textarea placeholder="Votre message ici..." className="bg-black border-gray-700" rows={6}/>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" variant="default">Envoyer le message</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                                <Dialog>
                                    <Card className="bg-black/50 border-gray-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2"><Users/> Envoyer à un GROUPE</CardTitle>
                                            <CardDescription>Ciblez un segment spécifique de votre base.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <DialogTrigger asChild><Button className="w-full">Choisir le groupe</Button></DialogTrigger>
                                        </CardContent>
                                    </Card>
                                    <DialogContent className="bg-[#111] border-gray-800">
                                        <DialogHeader>
                                            <DialogTitle>Message de groupe</DialogTitle>
                                            <DialogDescription>Ce message sera envoyé au groupe sélectionné.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Select>
                                                <SelectTrigger className="bg-black border-gray-700"><SelectValue placeholder="Sélectionner un groupe..." /></SelectTrigger>
                                                <SelectContent className="bg-[#111] border-gray-700"><SelectItem value="partners">Partenaires</SelectItem><SelectItem value="active">Utilisateurs Actifs</SelectItem><SelectItem value="new">Nouveaux Inscrits (-7j)</SelectItem></SelectContent>
                                            </Select>
                                            <Input placeholder="Sujet" className="bg-black border-gray-700" />
                                            <Textarea placeholder="Votre message ici..." className="bg-black border-gray-700" rows={6}/>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" variant="default">Envoyer le message</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>

                               <Dialog>
                                    <Card className="bg-black/50 border-gray-800">
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2"><User/> Envoyer à un UTILISATEUR</CardTitle>
                                            <CardDescription>Envoyez un message privé à une personne spécifique.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <DialogTrigger asChild><Button className="w-full">Trouver</Button></DialogTrigger>
                                        </CardContent>
                                    </Card>
                                    <DialogContent className="bg-[#111] border-gray-800">
                                        <DialogHeader>
                                            <DialogTitle>Message privé</DialogTitle>
                                            <DialogDescription>Recherchez un utilisateur par nom ou email.</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Input placeholder="Rechercher un utilisateur..." className="bg-black border-gray-700" />
                                            <Input placeholder="Sujet" className="bg-black border-gray-700" />
                                            <Textarea placeholder="Votre message ici..." className="bg-black border-gray-700" rows={6}/>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" variant="default">Envoyer le message</Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </TabsContent>
                    
                     <TabsContent value="config" className="mt-6 space-y-6">
                        <Card className="bg-[#111] border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-200">Identité du site</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 max-w-lg">
                                 <div>
                                    <Label>Nom du site</Label>
                                    <Input defaultValue="Spordate" className="bg-black border-gray-700"/>
                                </div>
                                 <div>
                                    <Label>Couleur Principale</Label>
                                    <Input defaultValue="#7B1FA2" className="bg-black border-gray-700"/>
                                </div>
                            </CardContent>
                        </Card>
                         <Card className="bg-[#111] border-red-900/50">
                            <CardHeader>
                                <CardTitle className="text-xl text-red-400">Connectivité Bancaire (Stripe Connect)</CardTitle>
                                <CardDescription>Clés API pour la gestion des paiements et commissions.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 max-w-lg">
                                 <div>
                                    <Label>Stripe Secret Key (Admin)</Label>
                                    <Input type="password" placeholder="sk_live_************************" className="bg-black border-gray-700 font-mono"/>
                                </div>
                                 <div>
                                    <Label>Stripe Public Key</Label>
                                    <Input placeholder="pk_live_************************" className="bg-black border-gray-700 font-mono"/>
                                </div>
                                <p className="text-xs text-gray-500 pt-2">
                                    Ces clés permettent de prélever les commissions automatiquement sur les partenaires lors des réservations.
                                </p>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#111] border-red-900/50">
                            <CardHeader>
                                <CardTitle className="text-xl text-red-400">Connectivité TWINT (Suisse)</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 max-w-lg">
                                 <div>
                                    <Label>TWINT UUID</Label>
                                    <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" className="bg-black border-gray-700 font-mono"/>
                                </div>
                                 <div>
                                    <Label>Certificate Key (P12) Password</Label>
                                    <Input type="password" placeholder="********" className="bg-black border-gray-700 font-mono"/>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                </Tabs>
            </div>
        </div>
    );
}
