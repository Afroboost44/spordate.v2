"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell, Building } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!termsAccepted) {
      toast({
        variant: "destructive",
        title: "Conditions non acceptées",
        description: "Vous devez accepter les conditions générales pour vous inscrire.",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-12rem)] p-4">
       <Card className="mx-auto max-w-sm w-full bg-card border-border/20 shadow-lg shadow-accent/10">
        <form onSubmit={handleSubmit}>
          <CardHeader className="items-center text-center">
              <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
                  <Dumbbell className="h-8 w-8 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] rounded-md p-1 text-white" />
                  <span className="font-bold text-2xl">Spordate</span>
              </Link>
            <CardTitle className="text-2xl font-bold">Inscription</CardTitle>
            <CardDescription>
              Créez votre compte pour commencer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid gap-2">
                  <Label htmlFor="first-name">Prénom</Label>
                  <Input id="first-name" placeholder="John" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                <Input id="confirm-password" type="password" required />
              </div>

              <div className="flex items-center space-x-2 mt-2">
                <Checkbox id="terms" onCheckedChange={(checked) => setTermsAccepted(!!checked)} />
                <label
                  htmlFor="terms"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground/80"
                >
                  J'ai lu et j'accepte les{" "}
                  <Link href="/terms" className="underline text-accent/80 hover:text-accent" target="_blank" rel="noopener noreferrer">
                    Conditions Générales d'Utilisation
                  </Link>
                  .
                </label>
              </div>

              <Button type="submit" className="w-full bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold" disabled={loading}>
                {loading ? 'Création du compte...' : 'Je m\'inscris'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Déjà inscrit ?{" "}
              <Link href="/login" className="underline text-accent/80 hover:text-accent">
                Se connecter
              </Link>
            </div>
             <Separator className="my-6 bg-border/20"/>
             <div className="text-center text-sm">
                 <Link href="/partner/login" className="text-foreground/60 hover:text-foreground transition-colors flex items-center justify-center gap-2">
                    <Building size={16} />
                    Vous êtes un Club ? Accédez à votre espace ici.
                 </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
