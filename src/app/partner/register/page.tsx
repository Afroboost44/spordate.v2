"use client";

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PartnerRegisterPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const validatePassword = (pass: string) => {
        const hasNumber = /\d/.test(pass);
        return pass.length >= 8 && hasNumber;
    }

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Le mot de passe doit contenir au moins 8 caractères et un chiffre.");
            return;
        }
        
        setIsSubmitted(true);
        toast({
            title: "Candidature envoyée !",
            description: "Votre demande est en cours d'examen.",
            className: "bg-green-600 text-white border-green-700",
        });
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#05090e] p-4">
                 <Card className="mx-auto max-w-lg w-full bg-green-900/20 border-green-700/50 shadow-lg shadow-green-900/20 text-center">
                    <CardHeader className="items-center">
                        <ShieldCheck className="h-16 w-16 text-green-400 mb-4" />
                        <CardTitle className="text-3xl font-bold text-green-300">Candidature envoyée</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-gray-300 text-lg">
                            L'administrateur validera votre compte sous 24h. Vous recevrez une notification par email dès que votre accès sera activé.
                        </p>
                        <Button
                            onClick={() => router.push('/')}
                            className="w-full bg-gray-200 hover:bg-white text-black font-semibold h-12 text-base"
                        >
                            <ArrowLeft className="mr-2" /> Retour à l'accueil
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#05090e] p-4">
            <Card className="mx-auto max-w-lg w-full bg-[#0a111a] border-cyan-900/50 shadow-lg shadow-cyan-900/20">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="items-center text-center space-y-3">
                        <Building className="h-10 w-10 text-cyan-400" />
                        <CardTitle className="text-2xl font-bold text-gray-200">Devenir Partenaire Agréé</CardTitle>
                        <CardDescription className="text-gray-500">
                           Remplissez ce formulaire pour soumettre votre candidature.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="grid gap-2">
                            <Label htmlFor="company-name" className="text-gray-400">Nom de l'établissement</Label>
                            <Input id="company-name" type="text" placeholder="Ex: Neon Fitness Club" required className="bg-black border-gray-700 text-gray-300 focus:border-cyan-500" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ide-number" className="text-gray-400">Numéro IDE / Registre du commerce</Label>
                            <Input id="ide-number" type="text" placeholder="CHE-123.456.789" required className="bg-black border-gray-700 text-gray-300 focus:border-cyan-500" />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-400">Email Professionnel</Label>
                            <Input id="email" type="email" placeholder="contact@votreclub.ch" required className="bg-black border-gray-700 text-gray-300 focus:border-cyan-500" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-gray-400">Mot de passe</Label>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="bg-black border-gray-700 text-gray-300 focus:border-cyan-500" />
                            </div>
                             <div className="grid gap-2">
                                <Label htmlFor="confirm-password" className="text-gray-400">Confirmer le mot de passe</Label>
                                <Input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-black border-gray-700 text-gray-300 focus:border-cyan-500" />
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 pt-1">
                            Doit contenir au moins 8 caractères et 1 chiffre.
                        </p>

                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-semibold h-12 text-base mt-4">
                            Envoyer ma candidature
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}