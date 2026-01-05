"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building } from 'lucide-react';
import Link from 'next/link';

export default function PartnerLoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push('/partner/dashboard');
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#05090e]">
            <Card className="mx-auto max-w-sm w-full bg-[#0a111a] border-cyan-900/50 shadow-lg shadow-cyan-900/20">
                <form onSubmit={handleLogin}>
                    <CardHeader className="items-center text-center space-y-3">
                        <Building className="h-10 w-10 text-cyan-400" />
                        <CardTitle className="text-2xl font-bold text-gray-200">Espace Partenaire</CardTitle>
                        <CardDescription className="text-gray-500">
                           Accédez à votre espace de gestion.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email" className="text-gray-400">Email Professionnel</Label>
                            <Input id="email" type="email" defaultValue="contact@neon-fitness.ch" required className="bg-black border-gray-700 text-gray-300 focus:border-cyan-500" />
                        </div>
                        <div className="grid gap-2">
                             <div className="flex items-center">
                                <Label htmlFor="password" className="text-gray-400">Mot de passe</Label>
                                <Link
                                    href="#"
                                    className="ml-auto inline-block text-sm underline text-foreground/60 hover:text-foreground"
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <Input id="password" type="password" defaultValue="password" required className="bg-black border-gray-700 text-gray-300 focus:border-cyan-500" />
                        </div>
                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-semibold" disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </Button>
                        <div className="mt-4 text-center text-sm">
                            <Link href="/partner/register" className="underline text-cyan-400/80 hover:text-cyan-400">
                                Pas encore partenaire ? Faites une demande ici
                            </Link>
                        </div>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
