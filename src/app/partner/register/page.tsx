"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, ShieldCheck, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PartnerRegisterPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }
        if (password.length < 8) {
            setError("Le mot de passe est trop court.");
            return;
        }
        setIsSubmitted(true);
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black p-4">
                 <Card className="mx-auto max-w-lg w-full bg-green-950/30 border-green-800 text-center">
                    <CardHeader className="items-center">
                        <ShieldCheck className="h-16 w-16 text-green-400 mb-4" />
                        <CardTitle className="text-3xl font-bold text-green-400">Candidature envoyée !</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-gray-300 text-lg">
                            L'administrateur validera votre compte sous 24h.
                        </p>
                        <Button onClick={() => router.push('/')} variant="outline" className="w-full border-gray-600 text-gray-300 hover:bg-gray-800">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Retour à l'accueil
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
            <Card className="mx-auto max-w-lg w-full bg-[#0a111a] border-cyan-900/50">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="text-center">
                        <Building className="h-10 w-10 text-cyan-400 mx-auto mb-2" />
                        <CardTitle className="text-2xl font-bold text-white">Devenir Partenaire</CardTitle>
                        <CardDescription className="text-gray-400">Rejoignez le réseau Spordateur.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-gray-300">Nom de l'établissement</Label>
                            <Input id="name" required className="bg-black/50 border-gray-700 text-white" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-300">Email Pro</Label>
                            <Input id="email" type="email" required className="bg-black/50 border-gray-700 text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="pass" className="text-gray-300">Mot de passe</Label>
                                <Input id="pass" type="password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-black/50 border-gray-700 text-white" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="conf" className="text-gray-300">Confirmation</Label>
                                <Input id="conf" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="bg-black/50 border-gray-700 text-white" />
                            </div>
                        </div>
                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold mt-2">
                            Envoyer ma candidature
                        </Button>
                        <div className="text-center pt-2">
                            <Link href="/partner/login" className="text-sm text-gray-500 hover:text-cyan-400">Déjà inscrit ? Se connecter</Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}