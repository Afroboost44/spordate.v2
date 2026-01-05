"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, CheckCircle, Smartphone } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const PayPalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3.34 8.2c.07-1.7.97-3.1 2.5-3.8C7.1 3.6 8.9 3.8 10.3 4.9c.7.5 1.1 1.2 1.3 2 .2 1.2-.2 2.5-.8 3.5-.7 1.1-1.6 1.8-2.7 2.4-1.2.6-2.4 1-3.6 1.2-.2.1-.4.2-.6.3-.2.1-.3.2-.4.4-.1.1-.2.2-.2.4-.1.2-.1.4-.1.6 0 .2.1.4.1.5.1.1.2.2.3.3.1.1.3.2.4.2.3.1.6.1.9.1h2.9c1.1 0 2.2-.3 3.1-.8 1.4-.8 2.3-2.2 2.6-3.8.3-2.1-.4-4.2-1.8-5.5C12.3 2.1 10.1 1.5 8 2.1 5.4 2.8 3.5 5.1 3.3 7.9c-.1.8.4 1.5.9 1.9.5.3 1.1.2 1.6-.2.4-.4.5-1 .3-1.6z"/>
      <path d="M12.6 11.5c.3-2.1-.4-4.2-1.8-5.5-1.4-1.3-3.6-1.9-5.7-1.2-2.6.7-4.5 3-4.7 5.8-.1.8.4 1.5.9 1.9.5.3 1.1.2 1.6-.2.4-.4.5-1 .3-1.6-.1-1.7.8-3.1 2.4-3.8 1.2-.6 2.6-.5 3.6.3.9.8 1.3 1.9 1.1 3.1-.2 1.6-.9 2.9-1.9 3.8-1.5 1.3-3.5 1.8-5.5 1.3-1.2-.3-2.3-.8-3.2-1.5-.2-.1-.4-.2-.5-.2-.1 0-.2.1-.3.1-.1 0-.2.1-.2.1-.1.1-.1.2-.1.3 0 .1.1.2.1.3.1.3.3.5.5.7.4.2.7.4 1.1.5 2.5.7 5.2.1 7.2-1.5 1.5-1.2 2.4-3 2.6-5.1z"/>
    </svg>
  );

export default function PaymentPage() {
    const [loading, setLoading] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const router = useRouter();

    const handlePayment = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setPaymentSuccess(true);
        }, 2000);
    };

    if (paymentSuccess) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4 text-center">
                <CheckCircle className="h-24 w-24 text-green-500 mb-6 animate-pulse" />
                <h1 className="text-4xl font-bold mb-2">C'est tout bon ! 🎟️</h1>
                <p className="text-lg text-gray-400 mb-8">
                    Votre session est réservée. Le chat avec Marc est maintenant débloqué.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-bold" onClick={() => router.push('/chat')}>
                    Ouvrir le Chat
                </Button>
            </div>
        );
    }
    
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] p-4 text-center">
                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mb-4"></div>
                <h1 className="text-2xl font-bold text-foreground">Traitement sécurisé en cours...</h1>
                <p className="text-muted-foreground">Veuillez ne pas quitter cette page.</p>
            </div>
        );
    }


    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold text-center mb-8 font-headline">Finaliser la réservation</h1>
            
            <Card className="bg-card border-border/20 shadow-lg shadow-accent/10 mb-8">
                <CardHeader>
                    <CardTitle>Récapitulatif</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 text-foreground/80">
                        <div className="flex justify-between">
                            <span>Activité :</span>
                            <span className="font-semibold">Session Privée - Neon Fitness Club</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Avec :</span>
                            <span className="font-semibold">Marc</span>
                        </div>
                        <Separator className="my-4 bg-border/20"/>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold">Prix Total :</span>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">
                                25.00 CHF
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-card border-border/20 shadow-lg shadow-accent/10">
                <CardHeader>
                    <CardTitle>Moyen de Paiement</CardTitle>
                    <CardDescription>Choisissez comment vous souhaitez payer.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Button onClick={handlePayment} variant="outline" className="w-full justify-start h-14 text-base border-red-500/50 hover:bg-red-500/10 hover:text-red-400">
                        <Smartphone className="mr-4 text-red-500" /> Payer avec TWINT
                    </Button>
                    <Button onClick={handlePayment} className="w-full justify-start h-14 text-base bg-primary hover:bg-primary/90">
                        <CreditCard className="mr-4" /> Carte Bancaire (Stripe)
                    </Button>
                     <Button onClick={handlePayment} variant="outline" className="w-full justify-start h-14 text-base border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400">
                        <PayPalIcon className="mr-4 text-blue-500"/> PayPal
                    </Button>
                </CardContent>
            </Card>

             <div className="mt-8 text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Lock size={14}/>
                <span>Paiement sécurisé. Annulation impossible moins de 1h avant.</span>
            </div>
        </div>
    );
}
