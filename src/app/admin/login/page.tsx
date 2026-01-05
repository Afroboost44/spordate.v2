"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Loader2, CheckCircle } from 'lucide-react';

export default function AdminLoginPage() {
    const router = useRouter();
    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        router.push('/admin/dashboard');
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setResetSent(true);
        }, 1500);
    };

    if (view === 'forgot') {
        return (
             <div className="flex items-center justify-center min-h-screen bg-black p-4">
                <Card className="w-full max-w-md bg-[#1a0505] border-red-900/50">
                    <CardHeader>
                        <CardTitle className="text-red-500">Récupération Admin</CardTitle>
                        <CardDescription className="text-gray-400">Lien de sécurité envoyé par email.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {resetSent ? (
                            <div className="text-center space-y-4">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto"/>
                                <p className="text-green-400">Lien envoyé à <strong>{email}</strong>.</p>
                                <Button onClick={() => setView('login')} className="w-full bg-gray-800 text-white">Retour</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <Input 
                                    type="email" 
                                    placeholder="Email Admin de secours" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required 
                                    className="bg-black/50 border-red-900/30 text-white"
                                />
                                <Button disabled={isLoading} type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
                                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : null} Envoyer Lien
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setView('login')} className="w-full text-gray-500">Annuler</Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
            <Card className="w-full max-w-md bg-[#1a0505] border-red-900/50 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <CardHeader className="text-center">
                    <ShieldAlert className="h-12 w-12 text-red-600 mx-auto mb-2" />
                    <CardTitle className="text-2xl font-bold text-red-500">Restricted Area</CardTitle>
                    <CardDescription className="text-gray-500">Accès Administrateur Uniquement</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <Input type="text" placeholder="ID Admin" className="bg-black/50 border-red-900/30 text-white" />
                        <Input type="password" placeholder="Code de sécurité" className="bg-black/50 border-red-900/30 text-white" />
                        <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                            Entrer
                        </Button>
                        <div className="text-center pt-2">
                             <button type="button" onClick={() => setView('forgot')} className="text-xs text-gray-500 hover:text-red-400">
                                Mot de passe oublié ?
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
