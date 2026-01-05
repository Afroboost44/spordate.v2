"use client";

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Building, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function PartnerLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  type Partner = {
      id: number;
      name: string;
      email: string;
      status: 'pending' | 'active';
      date: string;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
        const db: Partner[] = JSON.parse(localStorage.getItem('spordate_db') || '[]');
        const partner = db.find(p => p.email.toLowerCase() === email.toLowerCase());

        if (!partner) {
            toast({
                variant: "destructive",
                title: "Accès refusé",
                description: "Compte inexistant. Veuillez vérifier votre email ou faire une demande.",
            });
            setLoading(false);
            return;
        }

        if (partner.status === 'pending') {
            toast({
                variant: "destructive",
                title: "Compte en attente",
                description: "⏳ Votre dossier est en cours de validation par l'administrateur. Veuillez patienter.",
            });
            setLoading(false);
            return;
        }

        if (partner.status === 'active') {
            toast({
                title: "Connexion réussie !",
                description: `Bienvenue, ${partner.name}.`,
                className: "bg-green-600 text-white border-green-700",
            });
            router.push('/partner/dashboard');
        }
        
    }, 1000);
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-black p-4">
      <Card className="w-full max-w-md bg-[#0a111a] border-cyan-900/50 shadow-2xl shadow-cyan-900/20">
        <form onSubmit={handleLogin}>
            <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
                <div className="p-3 rounded-full bg-cyan-900/20">
                <Building className="h-8 w-8 text-cyan-400" />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">Espace Partenaire</CardTitle>
            <CardDescription className="text-gray-400">
                Accédez à votre espace de gestion.
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email Professionnel</Label>
                <Input 
                    id="email" 
                    type="email" 
                    placeholder="club@exemple.ch" 
                    required 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-black/50 border-gray-700 text-white focus:border-cyan-500" />
            </div>
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-300">Mot de passe</Label>
                <Link href="#" className="text-xs text-cyan-400 hover:underline">
                    Mot de passe oublié ?
                </Link>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-black/50 border-gray-700 text-white focus:border-cyan-500" />
            </div>
            <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold" disabled={loading}>
                <Lock className="mr-2 h-4 w-4" /> {loading ? 'Vérification...' : 'Se connecter'}
            </Button>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4 border-t border-gray-800 pt-6">
            <div className="text-center text-sm text-gray-400">
                Pas encore partenaire ?{" "}
                <Link href="/partner/register" className="font-medium text-cyan-400 hover:underline hover:text-cyan-300 transition-colors">
                Faites une demande ici
                </Link>
            </div>
            </CardFooter>
        </form>
      </Card>
    </div>
  )
}
