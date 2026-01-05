"use client";
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Label } from "@/components/ui/label";
import { Activity, Globe, Save, RefreshCw, BarChart, Users, Building, Briefcase, Eye, Lock, Trash2, EyeOff, LockOpen, CreditCard, Banknote, Mail, Palette, MessageSquare, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


const mockUsersData = [
    { id: 'usr_01', name: 'Julie', email: 'julie@spordate.ch', role: 'Utilisateur', status: 'active', isVisible: true, avatar: 'https://i.pravatar.cc/150?u=julie' },
    { id: 'usr_02', name: 'Marc', email: 'marc@spordate.ch', role: 'Utilisateur', status: 'active', isVisible: true, avatar: 'https://i.pravatar.cc/150?u=marc' },
    { id: 'usr_03', name: 'Sophie', email: 'sophie@spordate.ch', role: 'Utilisateur', status: 'blocked', isVisible: true, avatar: 'https://i.pravatar.cc/150?u=sophie' },
    { id: 'usr_04', name: 'Neon Fitness', email: 'contact@neon.ch', role: 'Partenaire', status: 'active', isVisible: false, avatar: 'https://i.pravatar.cc/150?u=neon' },
];

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Mock states for interactivity
  const [kpis] = useState({ revenue: 1250, registeredUsers: 157, activePartners: 12 });
  const [users, setUsers] = useState(mockUsersData);
  const [paymentApis, setPaymentApis] = useState({ twint: true, stripe: true, bank: false });
  const [commission, setCommission] = useState([10]);
  const [siteName, setSiteName] = useState("Spordate");
  const [primaryColor, setPrimaryColor] = useState("#8B5CF6");
  const [heroTitle, setHeroTitle] = useState("Trouve ton Partenaire de Sport Idéal");
  const [message, setMessage] = useState({ recipient: 'all_users', subject: '', body: ''});


  // --- USER MANAGEMENT LOGIC ---
  const toggleUserVisibility = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, isVisible: !u.isVisible } : u));
  };
  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'blocked' : 'active' } : u));
  };
  const deleteUser = (id: string) => {
    setUsers(users.filter(u => u.id !== id));
    toast({ title: "Utilisateur supprimé", variant: "destructive" });
  };
  
  // --- COMPONENTS FOR TABS ---
  const OverviewTab = () => (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-sm text-gray-400">Revenu Total</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{kpis.revenue} CHF</p></CardContent></Card>
          <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-sm text-gray-400">Utilisateurs Inscrits</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{kpis.registeredUsers}</p></CardContent></Card>
          <Card className="bg-[#0f1115] border-gray-800"><CardHeader><CardTitle className="text-sm text-gray-400">Partenaires Actifs</CardTitle></CardHeader><CardContent><p className="text-3xl font-bold">{kpis.activePartners}</p></CardContent></Card>
      </div>
  );

  const UserManagementTab = () => (
    <Card className="bg-[#0f1115] border-gray-800">
      <CardHeader>
        <CardTitle>Gestion des Utilisateurs</CardTitle>
        <CardDescription>Total: {users.length} comptes</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader><TableRow>
            <TableHead>Utilisateur</TableHead><TableHead>Rôle</TableHead><TableHead>Statut</TableHead><TableHead className="text-right">Actions</TableHead>
          </TableRow></TableHeader>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar><AvatarImage src={user.avatar} /><AvatarFallback>{user.name.charAt(0)}</AvatarFallback></Avatar>
                    <div><div className="font-bold">{user.name}</div><div className="text-xs text-gray-500">{user.email}</div></div>
                  </div>
                </TableCell>
                <TableCell><Badge variant="outline">{user.role}</Badge></TableCell>
                <TableCell><Badge variant={user.status === 'active' ? 'default' : 'destructive'} className={user.status === 'active' ? "bg-green-500/20 text-green-400" : ""}>{user.status}</Badge></TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => toggleUserVisibility(user.id)}>{user.isVisible ? <Eye className="text-gray-400"/> : <EyeOff className="text-yellow-400"/>}</Button>
                  <Button variant="ghost" size="icon" onClick={() => toggleUserStatus(user.id)}>{user.status === 'active' ? <Lock className="text-gray-400"/> : <LockOpen className="text-orange-400"/>}</Button>
                  <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="text-red-500"/></Button></AlertDialogTrigger>
                    <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Confirmer la suppression</AlertDialogTitle><AlertDialogDescription>Action irréversible.</AlertDialogDescription></AlertDialogHeader>
                    <AlertDialogFooter><AlertDialogCancel>Annuler</AlertDialogCancel><AlertDialogAction onClick={() => deleteUser(user.id)}>Supprimer</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const FinanceTab = () => (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="bg-[#0f1115] border-gray-800">
        <CardHeader><CardTitle>APIs de Paiement</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg"><Label className="flex items-center gap-2"><Banknote/> TWINT</Label><Switch checked={paymentApis.twint} onCheckedChange={(c) => setPaymentApis({...paymentApis, twint: c})}/></div>
          <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg"><Label className="flex items-center gap-2"><CreditCard/> Stripe</Label><Switch checked={paymentApis.stripe} onCheckedChange={(c) => setPaymentApis({...paymentApis, stripe: c})}/></div>
          <div className="flex items-center justify-between p-3 bg-black/30 rounded-lg"><Label>Virement Bancaire</Label><Switch checked={paymentApis.bank} onCheckedChange={(c) => setPaymentApis({...paymentApis, bank: c})}/></div>
          <Input placeholder="Clé API Stripe (sec_...)" className="bg-black border-gray-700"/>
        </CardContent>
      </Card>
      <Card className="bg-[#0f1115] border-gray-800">
        <CardHeader><CardTitle>Commissions Partenaires</CardTitle></CardHeader>
        <CardContent>
          <div className="text-center mb-4"><span className="text-4xl font-bold text-cyan-400">{commission[0]}%</span></div>
          <Slider value={commission} onValueChange={setCommission} max={50} step={1} />
        </CardContent>
      </Card>
    </div>
  );

  const CommunicationTab = () => (
      <Card className="bg-[#0f1115] border-gray-800">
        <CardHeader><CardTitle>Communication</CardTitle><CardDescription>Envoyer un message à la communauté.</CardDescription></CardHeader>
        <CardContent className="space-y-4">
            <Select value={message.recipient} onValueChange={(v) => setMessage({...message, recipient: v})}>
                <SelectTrigger><SelectValue placeholder="Destinataire..." /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="specific_user">À un utilisateur spécifique</SelectItem>
                    <SelectItem value="all_users">À tous les utilisateurs</SelectItem>
                    <SelectItem value="selection">À une sélection (ex: 50 derniers)</SelectItem>
                    <SelectItem value="all_partners">À tous les partenaires</SelectItem>
                </SelectContent>
            </Select>
            {message.recipient === 'specific_user' && <Input placeholder="Rechercher un utilisateur par email..." className="bg-black border-gray-700"/>}
            <Input value={message.subject} onChange={e => setMessage({...message, subject: e.target.value})} placeholder="Sujet du message" className="bg-black border-gray-700"/>
            <Textarea value={message.body} onChange={e => setMessage({...message, body: e.target.value})} placeholder="Votre message..." className="bg-black border-gray-700 min-h-[150px]"/>
            <Button className="w-full bg-cyan-600 hover:bg-cyan-500"><Mail className="mr-2"/> Envoyer le message</Button>
        </CardContent>
      </Card>
  );

  const CmsTab = () => (
    <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-[#0f1115] border-gray-800">
            <CardHeader><CardTitle>Identité & Branding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div><Label>Nom du Site</Label><Input value={siteName} onChange={(e) => setSiteName(e.target.value)} className="bg-black border-gray-700"/></div>
                <div><Label>Couleur Principale</Label><div className="relative"><Input value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="bg-black border-gray-700"/><input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="absolute right-2 top-2 h-6 w-10 p-0 border-0 bg-transparent cursor-pointer"/></div></div>
            </CardContent>
        </Card>
         <Card className="bg-[#0f1115] border-gray-800">
            <CardHeader><CardTitle>Textes du Site (CMS)</CardTitle></CardHeader>
            <CardContent className="space-y-4">
                <div><Label>Titre Hero</Label><Textarea value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className="bg-black border-gray-700"/></div>
                <Button className="w-full bg-green-600 hover:bg-green-500"><Save className="mr-2"/> Sauvegarder les Textes</Button>
            </CardContent>
        </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#05090e] pt-28 pb-20 px-4 md:px-8 text-white overflow-x-hidden">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 bg-cyan-900/20 rounded-xl border border-cyan-800/50"><Activity className="text-cyan-400 h-8 w-8" /></div>
        <div><h1 className="text-3xl font-bold">Super Admin Dashboard</h1><p className="text-gray-400">Système de gestion complet • v11.0</p></div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-gray-900/50 border border-gray-800 p-1 flex-wrap h-auto w-full justify-start">
            <TabsTrigger value="overview"><BarChart className="mr-2"/>Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users"><Users className="mr-2"/>Utilisateurs</TabsTrigger>
            <TabsTrigger value="finance"><SlidersHorizontal className="mr-2"/>Finance & Partenaires</TabsTrigger>
            <TabsTrigger value="communication"><MessageSquare className="mr-2"/>Communication</TabsTrigger>
            <TabsTrigger value="cms"><Palette className="mr-2"/>CMS & Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="overview"><OverviewTab /></TabsContent>
        <TabsContent value="users"><UserManagementTab /></TabsContent>
        <TabsContent value="finance"><FinanceTab /></TabsContent>
        <TabsContent value="communication"><CommunicationTab /></TabsContent>
        <TabsContent value="cms"><CmsTab /></TabsContent>
      </Tabs>
    </div>
  );
}
