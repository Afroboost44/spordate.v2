"use client";

import Link from "next/link";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dumbbell } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push('/profile');
    }, 1000);
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
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>
              Entrez votre email pour vous connecter à votre compte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
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
                <div className="flex items-center">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link
                    href="#"
                    className="ml-auto inline-block text-sm underline text-foreground/60 hover:text-foreground"
                  >
                    Mot de passe oublié ?
                  </Link>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold" disabled={loading}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Pas de compte ?{" "}
              <Link href="/signup" className="underline text-accent/80 hover:text-accent">
                Créer un profil
              </Link>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
