"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push('/admin/dashboard');
        }, 1000);
    };

    const handleForgotPassword = () => {
        toast({
            title: "Support Technique",
            description: "Pour des raisons de sécurité, veuillez contacter directement le support technique pour la réinitialisation.",
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Card className="mx-auto max-w-sm w-full bg-[#111] border-red-900/50 shadow-lg shadow-red-900/20">
                <form onSubmit={handleLogin}>
                    <CardHeader className="items-center text-center space-y-3">
                        <Shield className="h-10 w-10 text-red-500" />
                        <CardTitle className="text-2xl font-bold text-gray-200">Zone Restreinte</CardTitle>
                        <CardDescription className="text-gray-500">
                           Accès Administrateur Uniquement
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="admin-id" className="text-gray-400">Identifiant Admin</Label>
                            <Input id="admin-id" defaultValue="superadmin" required className="bg-black border-gray-700 text-gray-300 focus:border-red-500" />
                        </div>
                        <div className="grid gap-2">
                             <div className="flex items-center">
                                <Label htmlFor="security-code" className="text-gray-400">Mot de passe</Label>
                                <button
                                    type="button"
                                    onClick={handleForgotPassword}
                                    className="ml-auto inline-block text-sm underline text-foreground/60 hover:text-foreground"
                                >
                                    Mot de passe oublié ?
                                </button>
                            </div>
                            <Input id="security-code" type="password" defaultValue="password" required className="bg-black border-gray-700 text-gray-300 focus:border-red-500" />
                        </div>
                        <Button type="submit" className="w-full bg-red-800 hover:bg-red-700 text-white font-semibold" disabled={loading}>
                            {loading ? "Authentification..." : "Connexion Sécurisée"}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
