"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, CreditCard, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function PartnerWalletPage() {
    // CORRECTION POINT 1 : État pour simuler la connexion
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const handleConnectStripe = () => {
        setIsLoading(true);
        // Simulation d'appel API
        setTimeout(() => {
            setIsConnected(true);
            setIsLoading(false);
            toast({
                title: "Compte Bancaire Connecté ✅",
                description: "Vous pouvez maintenant recevoir des paiements.",
                className: "bg-green-600 text-white"
            });
        }, 1500);
    };

    return (
        <div className="p-6 space-y-8 min-h-screen bg-[#05090e]">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Mon Portefeuille</h1>
                <p className="text-gray-400">Gérez vos revenus et vos coordonnées bancaires.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* CARTE SOLDE */}
                <Card className="bg-gradient-to-br from-gray-900 to-black border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-400 font-medium text-sm">Solde disponible</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-white mb-4">375.00 CHF</div>
                        <p className="text-sm text-gray-500 mb-6">Prochain virement automatique le 01/08/2026.</p>
                        <Button 
                            disabled={!isConnected} 
                            className={`w-full ${isConnected ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-gray-700 cursor-not-allowed'}`}
                        >
                            {isConnected ? 'Demander un virement anticipé' : 'Connectez votre banque pour retirer'}
                        </Button>
                    </CardContent>
                </Card>

                {/* CARTE CONNEXION BANCAIRE (CORRIGÉE) */}
                <Card className={`border ${isConnected ? 'bg-green-950/10 border-green-900/30' : 'bg-[#0a111a] border-gray-800'}`}>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-white">
                            <CreditCard className="h-5 w-5 text-cyan-500"/> Compte Bancaire
                        </CardTitle>
                        <CardDescription>
                            Connecté via Stripe Secure.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {isConnected ? (
                            // ÉTAT CONNECTÉ
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 p-4 bg-green-900/20 border border-green-900/50 rounded-lg">
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                    <div>
                                        <h4 className="font-bold text-green-400">Compte Actif</h4>
                                        <p className="text-sm text-gray-400">IBAN: CH53 **** **** 9088</p>
                                    </div>
                                </div>
                                <Button variant="outline" onClick={() => setIsConnected(false)} className="w-full text-red-400 border-red-900/30 hover:bg-red-900/10">
                                    Déconnecter le compte
                                </Button>
                            </div>
                        ) : (
                            // ÉTAT NON CONNECTÉ
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-yellow-500 bg-yellow-900/10 p-3 rounded border border-yellow-900/30 text-sm">
                                    <AlertCircle className="h-4 w-4"/> Action requise pour recevoir l'argent.
                                </div>
                                <Button 
                                    onClick={handleConnectStripe} 
                                    disabled={isLoading}
                                    className="w-full bg-[#635BFF] hover:bg-[#534be0] text-white font-bold h-12"
                                >
                                    {isLoading ? 'Connexion sécurisée en cours...' : 'Connecter mon compte (via Stripe)'}
                                </Button>
                                <p className="text-xs text-center text-gray-500">
                                    Vous serez redirigé vers Stripe pour une connexion sécurisée.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
