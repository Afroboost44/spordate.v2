"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, Lock, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PartnerLoginPage() {
    const router = useRouter();
    const [view, setView] = useState<'login' | 'forgot'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [resetSent, setResetSent] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulation délai réseau
        setTimeout(() => {
            const db = JSON.parse(localStorage.getItem('spordate_db') || '[]');
            const user = db.find((u: any) => u.email === email);

            // Pour la démo, on accepte aussi un compte "test" par défaut si la DB est vide
            if (email === 'demo@test.ch' && password === 'demo') {
                 router.push('/partner/dashboard');
                 return;
            }

            if (!user) {
                setError("Compte introuvable. Avez-vous fait une demande ?");
                setIsLoading(false);
                return;
            }

            if (user.password !== password) { // En prod: comparer les hash
                setError("Mot de passe incorrect.");
                setIsLoading(false);
                return;
            }

            if (user.status === 'pending') {
                setError("⏳ Votre compte est en attente de validation par l'Administrateur.");
                setIsLoading(false);
                return;
            }

            if (user.status === 'active') {
                router.push('/partner/dashboard');
            } else {
                setError("Statut inconnu.");
                setIsLoading(false);
            }
        }, 800);
    };

    const handleForgotPassword = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulation envoi email
        setTimeout(() => {
            setIsLoading(false);
            setResetSent(true);
        }, 1500);
    };

    if (view === 'forgot') {
        return (
             <div className="flex items-center justify-center min-h-screen bg-black p-4">
                <Card className="w-full max-w-md bg-[#0a111a] border-cyan-900/50">
                    <CardHeader>
                        <CardTitle className="text-white">Réinitialisation Mot de passe</CardTitle>
                        <CardDescription>Recevez un lien sécurisé par email.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {resetSent ? (
                            <div className="text-center space-y-4">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto"/>
                                <p className="text-green-400">Un lien a été envoyé à <strong>{email}</strong>.</p>
                                <Button onClick={() => setView('login')} className="w-full bg-gray-800">Retour connexion</Button>
                            </div>
                        ) : (
                            <form onSubmit={handleForgotPassword} className="space-y-4">
                                <Input 
                                    type="email" 
                                    placeholder="Votre email professionnel" 
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required 
                                    className="bg-black/50 border-gray-700 text-white"
                                />
                                <Button disabled={isLoading} type="submit" className="w-full bg-cyan-600">
                                    {isLoading ? <Loader2 className="animate-spin mr-2"/> : null} Envoyer le lien
                                </Button>
                                <Button type="button" variant="ghost" onClick={() => setView('login')} className="w-full text-gray-400">Annuler</Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-black p-4">
            <Card className="w-full max-w-md bg-[#0a111a] border-cyan-900/50 shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-cyan-900/20 p-3 rounded-full w-fit mb-4"><Building className="h-8 w-8 text-cyan-400" /></div>
                    <CardTitle className="text-2xl font-bold text-white">Espace Partenaire</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <div className="space-y-2">
                            <Label className="text-gray-300">Email Professionnel</Label>
                            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="bg-black/50 border-gray-700 text-white focus:border-cyan-500" />
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <Label className="text-gray-300">Mot de passe</Label>
                                <button type="button" onClick={() => setView('forgot')} className="text-xs text-cyan-400 hover:underline">Mot de passe oublié ?</button>
                            </div>
                            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="bg-black/50 border-gray-700 text-white focus:border-cyan-500" />
                        </div>
                        <Button disabled={isLoading} type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold">
                            {isLoading ? <Loader2 className="animate-spin mr-2"/> : <Lock className="mr-2 h-4 w-4"/>} Se connecter
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center border-t border-gray-800 pt-6">
                    <div className="text-sm text-gray-400">
                        Pas encore partenaire ? <Link href="/partner/register" className="text-cyan-400 hover:underline">Faites une demande ici</Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
