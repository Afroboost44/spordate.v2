"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'login' | 'forgotPassword'>('login');
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push('/admin/dashboard');
        }, 1000);
    };
    
    const handleForgotPasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };
    
    const renderLoginView = () => (
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
                            onClick={() => setView('forgotPassword')}
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
    );

    const renderForgotPasswordView = () => {
        if (isSubmitted) {
            return (
                <div className="text-center p-6">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4"/>
                    <h2 className="text-xl font-bold text-green-400">Demande envoyée !</h2>
                    <p className="text-gray-400 mt-2">Un lien de réinitialisation a été envoyé à <span className="font-semibold text-white">{email}</span>.</p>
                    <Button
                        variant="outline"
                        onClick={() => { setView('login'); setIsSubmitted(false); setEmail(''); }}
                        className="w-full mt-6 border-gray-600 text-gray-300 hover:bg-gray-800"
                    >
                       <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la connexion
                    </Button>
                </div>
            );
        }
        
        return (
            <form onSubmit={handleForgotPasswordSubmit}>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-200">Mot de passe oublié</CardTitle>
                    <CardDescription className="text-gray-500">
                       Entrez votre email pour réinitialiser votre mot de passe.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid gap-2">
                        <Label htmlFor="email-forgot" className="text-gray-400">Email</Label>
                        <Input id="email-forgot" type="email" placeholder="admin@spordate.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-black border-gray-700 text-gray-300 focus:border-red-500" />
                    </div>
                     <Button type="submit" className="w-full bg-red-800 hover:bg-red-700 text-white font-semibold" disabled={loading}>
                        {loading ? "Envoi en cours..." : "Envoyer"}
                    </Button>
                </CardContent>
                 <CardFooter>
                    <Button variant="link" className="text-gray-400" onClick={() => setView('login')}>
                       <ArrowLeft className="mr-2 h-4 w-4" /> Retour
                    </Button>
                </CardFooter>
            </form>
        );
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Card className="mx-auto max-w-sm w-full bg-[#111] border-red-900/50 shadow-lg shadow-red-900/20">
                {view === 'login' ? renderLoginView() : renderForgotPasswordView()}
            </Card>
        </div>
    );
}