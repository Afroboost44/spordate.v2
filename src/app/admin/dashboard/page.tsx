"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { BarChart, Users, Building, Briefcase, Settings, Download, XCircle, CheckCircle, Ban, EyeOff, Trash2, MessageSquare, Users2, User, Wallet, Heart, Activity, UserPlus, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const initialUsers = [
    { id: 'u1', name: 'Alice', email: 'alice@spordate.com', status: 'Actif' },
    { id: 'u2', name: 'Bob', email: 'bob@spordate.com', status: 'Actif' },
    { id: 'u3', name: 'Charlie', email: 'charlie@spordate.com', status: 'Invisible' },
    { id: 'u4', name: 'Diana', email: 'diana@spordate.com', status: 'Bloqué' },
];

type Partner = {
    id: number;
    name: string;
    email: string;
    status: 'pending' | 'active';
    date: string;
    commission?: string;
};

const overviewKpis = [
    { title: 'Revenus Totaux', value: '1,250 CHF', icon: <Wallet className="h-6 w-6 text-green-400" />, color: 'text-green-400' },
    { title: 'Utilisateurs Actifs', value: '42', icon: <Users className="h-6 w-6 text-blue-400" />, color: 'text-blue-400' },
    { title: 'Matchs ce mois', value: '18', icon: <Heart className="h-6 w-6 text-rose-400" />, color: 'text-rose-400' },
];

const recentEvents = [
    { text: 'Nouvelle inscription de "Laura" à Genève.', time: 'il y a 2m', icon: <UserPlus size={16} /> },
    { text: 'Paiement de 25 CHF reçu de Marc pour "Neon Fitness".', time: 'il y a 5m', icon: <CheckCircle size={16} /> },
    { text: 'Le partenaire "City Tennis" a ajouté une nouvelle offre.', time: 'il y a 12m', icon: <Building size={16} /> },
    { text: '"Alice" et "Bob" ont matché !', time: 'il y a 28m', icon: <Heart size={16} /> },
];

const defaultTerms = `Bienvenue sur Spordate, une application de mise en relation sportive opérée et régie par le droit Suisse.
Date de dernière mise à jour : 29 Juillet 2024

Article 1 : Objet
L'application Spordate a pour objet de faciliter la mise en relation entre des particuliers ("Utilisateurs") souhaitant pratiquer une activité sportive ensemble, et de permettre la réservation d'espaces ou de cours auprès d'établissements sportifs ("Partenaires"). Spordate agit en tant qu'intermédiaire technique.

Article 2 : Paiements & Politique d'Annulation
La réservation d'une activité via la plateforme est soumise à un paiement immédiat et sécurisé.
Règle d'annulation : L'Utilisateur a la possibilité d'annuler sa participation sans frais jusqu'à une (1) heure avant le début prévu de l'activité. Passé ce délai, aucun remboursement, total ou partiel, ne sera possible. Le montant engagé sera intégralement conservé et reversé au Partenaire.

Article 3 : Responsabilité
Spordate agit en tant que simple intermédiaire. Notre responsabilité ne saurait être engagée en cas d'accident ou de blessure. La sécurité relève de la responsabilité du Partenaire et de l'assurance personnelle des Utilisateurs.

Article 4 : Protection des Données
Nous nous engageons à protéger vos données personnelles conformément à la nLPD en vigueur en Suisse.

Article 5 : For Juridique et Droit Applicable
Les présentes CGU sont soumises au droit Suisse. En cas de litige, le for juridique exclusif est établi à Neuchâtel, en Suisse.`;

export default function AdminDashboardPage() {
    const { toast } = useToast();
    const [users, setUsers] = useState(initialUsers);
    const [pendingPartners, setPendingPartners] = useState<Partner[]>([]);
    const [activePartners, setActivePartners] = useState<Partner[]>([]);

    useEffect(() => {
        loadPartnersFromStorage();
    }, []);

    const loadPartnersFromStorage = () => {
        if (typeof window !== 'undefined') {
            const dbRaw = localStorage.getItem('spordate_db');
            if (dbRaw) {
                const allPartners: Partner[] = JSON.parse(dbRaw);
                setPendingPartners(allPartners.filter(p => p.status === 'pending'));
                setActivePartners(allPartners.filter(p => p.status === 'active'));
            }
        }
    };

    const updatePartnerStatus = (partnerId: number, newStatus: 'active' | 'rejected') => {
        const dbRaw = localStorage.getItem('spordate_db');
        if (dbRaw) {
            let allPartners: Partner[] = JSON.parse(dbRaw);
            let updatedPartners;
            let partnerName = '';

            if (newStatus === 'rejected') {
                const partnerToRemove = allPartners.find(p => p.id === partnerId);
                partnerName = partnerToRemove?.name || '';
                updatedPartners = allPartners.filter(p => p.id !== partnerId);
            } else {
                 const partnerToUpdate = allPartners.find(p => p.id === partnerId);
                 partnerName = partnerToUpdate?.name || '';
                updatedPartners = allPartners.map(p => 
                    p.id === partnerId ? { ...p, status: newStatus, commission: '15%' } : p
                );
            }

            localStorage.setItem('spordate_db', JSON.stringify(updatedPartners));
            loadPartnersFromStorage(); // Reload state from storage
            
            toast({
                title: `Partenaire ${newStatus === 'active' ? 'Accepté' : 'Refusé'}`,
                description: `Le statut de ${partnerName} a été mis à jour.`,
            });
        }
    };


    const handleUserAction = (userId: string, newStatus: 'Actif' | 'Invisible' | 'Bloqué') => {
        setUsers(currentUsers =>
            currentUsers.map(user =>
                user.id === userId ? { ...user, status: newStatus } : user
            )
        );
        toast({
            title: "Statut utilisateur mis à jour",
            description: `L'utilisateur a été marqué comme ${newStatus.toLowerCase()}.`,
        });
    };

    const handleDeleteUser = (userId: string, userName: string) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userName} ? Cette action est irréversible.`)) {
            setUsers(currentUsers => currentUsers.filter(user => user.id !== userId));
            toast({
                variant: "destructive",
                title: "Utilisateur supprimé",
                description: `${userName} a été définitivement supprimé.`,
            });
        }
    };
    
    const handleSaveStrategy = () => {
        toast({
            title: "Stratégie sauvegardée !",
            description: "Les nouveaux paramètres de tarification et de parrainage ont été appliqués.",
            className: "bg-green-600 text-white border-green-700",
        });
    };

    const handleSaveTerms = () => {
        toast({
            title: "Conditions Générales sauvegardées !",
            description: "Le document a été mis à jour sur l'ensemble du site.",
        });
    };

    const handleSendMessage = (target: string) => {
        toast({
            title: "Message envoyé avec succès !",
            description: `Votre message a bien été envoyé à "${target}".`,
        });
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 p-4 sm:p-8">
            <div className="container mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-100 flex items-center gap-3">
                        <BarChart className="h-7 w-7 md:h-8 md:w-8 text-blue-500" />
                        Super Admin Dashboard
                    </h1>
                    <p className="text-gray-500">Centre de commande de l'écosystème Spordate.</p>
                </header>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-6 bg-[#111] h-auto sm:h-14 p-2">
                        <TabsTrigger value="overview" className="h-full text-sm sm:text-base gap-2"><BarChart /> Vue d'ensemble</TabsTrigger>
                        <TabsTrigger value="users" className="h-full text-sm sm:text-base gap-2"><Users /> Utilisateurs</TabsTrigger>
                        <TabsTrigger value="partners" className="h-full text-sm sm:text-base gap-2"><Building /> Partenaires</TabsTrigger>
                        <TabsTrigger value="business" className="h-full text-sm sm:text-base gap-2"><Briefcase /> Business</TabsTrigger>
                        <TabsTrigger value="communication" className="h-full text-sm sm:text-base gap-2"><MessageSquare /> Communication</TabsTrigger>
                        <TabsTrigger value="config" className="h-full text-sm sm:text-base gap-2"><Settings /> Configuration</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="mt-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            {overviewKpis.map((kpi, index) => (
                                <Card key={index} className="bg-[#111] border-gray-800">
                                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                                        <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                                        {kpi.icon}
                                    </CardHeader>
                                    <CardContent>
                                        <div className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <Card className="bg-[#111] border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-200 flex items-center gap-2"><Activity/> Activité en temps réel</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {recentEvents.map((event, index) => (
                                        <li key={index} className="flex items-center gap-4 text-sm">
                                            <div className="p-2 bg-gray-800 rounded-full">{event.icon}</div>
                                            <span className="flex-grow text-gray-400">{event.text}</span>
                                            <span className="text-xs text-gray-600">{event.time}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="users" className="mt-6">
                        <Card className="bg-[#111] border-gray-800">
                            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <CardTitle className="text-xl text-gray-200">Gestion des Utilisateurs</CardTitle>
                                    <CardDescription>Actions sur les comptes utilisateurs.</CardDescription>
                                </div>
                                <Button variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-900/50 hover:text-blue-300 w-full sm:w-auto" onClick={() => toast({ title: "Exportation lancée", description: "Le fichier users.csv est en cours de téléchargement."})}>
                                    <Download className="mr-2 h-4 w-4" /> Exporter (CSV)
                                </Button>
                            </CardHeader>
                            <CardContent className="overflow-x-auto">
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
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-900/50 hover:text-red-400" onClick={() => handleUserAction(user.id, 'Bloqué')}><Ban size={16}/> Bloquer</Button>
                                                    <Button variant="ghost" size="sm" className="text-gray-400 hover:bg-gray-700/50 hover:text-gray-300" onClick={() => handleUserAction(user.id, 'Invisible')}><EyeOff size={16}/> Invisible</Button>
                                                    <Button variant="ghost" size="sm" className="text-gray-500 hover:bg-gray-700/50 hover:text-gray-400" onClick={() => handleDeleteUser(user.id, user.name)}><Trash2 size={16}/> Supprimer</Button>
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
                            <CardContent className="overflow-x-auto">
                                <Table>
                                    <TableBody>
                                        {pendingPartners.length > 0 ? pendingPartners.map((partner) => (
                                            <TableRow key={partner.id} className="border-gray-800">
                                                <TableCell className="font-semibold">{partner.name}</TableCell>
                                                <TableCell>Demandé le: {partner.date}</TableCell>
                                                <TableCell className="text-right">
                                                    <Button variant="ghost" size="sm" className="text-green-400 hover:bg-green-900/50 hover:text-green-300" onClick={() => updatePartnerStatus(partner.id, 'active')}><CheckCircle size={16}/> Accepter</Button>
                                                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-900/50 hover:text-red-400" onClick={() => updatePartnerStatus(partner.id, 'rejected')}><XCircle size={16}/> Refuser</Button>
                                                </TableCell>
                                            </TableRow>
                                        )) : <TableRow><TableCell colSpan={3} className="text-center text-gray-500">Aucune demande en attente.</TableCell></TableRow>}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                        <Card className="bg-[#111] border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-xl text-gray-200">Partenaires Actifs</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4 max-w-sm">
                                    <Label htmlFor="commission" className="whitespace-nowrap">Commission par défaut (%)</Label>
                                    <Input id="commission" type="number" defaultValue="15" className="bg-black border-gray-700 w-24" />
                                </div>
                                <div className="overflow-x-auto">
                                 <Table>
                                     <TableHeader><TableRow className="border-gray-800"><TableHead>Partenaire Actif</TableHead><TableHead>Commission</TableHead><TableHead className="text-right">Action</TableHead></TableRow></TableHeader>
                                     <TableBody>
                                         {activePartners.length > 0 ? activePartners.map(p => (
                                             <TableRow key={p.id} className="border-gray-800">
                                                 <TableCell>{p.name}</TableCell>
                                                 <TableCell>{p.commission}</TableCell>
                                                 <TableCell className="text-right">
                                                     <Button variant="destructive" size="sm">Suspendre</Button>
                                                 </TableCell>
                                             </TableRow>
                                         )) : <TableRow><TableCell colSpan={3} className="text-center text-gray-500">Aucun partenaire actif.</TableCell></TableRow>}
                                     </TableBody>
                                 </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="business" className="mt-6">
                        <Card className="bg-[#111] border-yellow-900/50">
                            <CardHeader>
                                <CardTitle className="text-xl text-yellow-300">Stratégie Business & Tarification</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 max-w-2xl">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
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
                                            <DialogDescription>Ce message sera envoyé à tous les membres (42 utilisateurs).</DialogDescription>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <Input placeholder="Sujet" className="bg-black border-gray-700" />
                                            <Textarea placeholder="Votre message ici..." className="bg-black border-gray-700" rows={6}/>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" variant="default" onClick={() => handleSendMessage("42 utilisateurs")}>Envoyer le message</Button>
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
                                            <Button type="submit" variant="default" onClick={() => handleSendMessage("un groupe")}>Envoyer le message</Button>
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
                                            <Input placeholder="Rechercher 'Alice'..." className="bg-black border-gray-700" />
                                            <Input placeholder="Sujet" className="bg-black border-gray-700" />
                                            <Textarea placeholder="Votre message ici..." className="bg-black border-gray-700" rows={6}/>
                                        </div>
                                        <DialogFooter>
                                            <Button type="submit" variant="default" onClick={() => handleSendMessage("Alice")}>Envoyer le message</Button>
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
                         <Card className="bg-[#111] border-gray-800">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-xl text-gray-200"><FileText /> Documents Légaux</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                 <div>
                                    <Label htmlFor="cgu-editor">Conditions Générales d'Utilisation (CGU)</Label>
                                    <Textarea id="cgu-editor" defaultValue={defaultTerms} className="bg-black border-gray-700 font-mono text-xs" rows={15}/>
                                </div>
                                <Button onClick={handleSaveTerms} className="bg-blue-600 hover:bg-blue-500 text-white font-bold">
                                    Sauvegarder les CGU
                                </Button>
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

    