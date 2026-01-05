"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Image as ImageIcon } from "lucide-react";
import { cn } from '@/lib/utils';

const sportsList = ["Tennis", "Fitness", "Running", "Yoga", "Crossfit"];

export default function ProfilePage() {
    const [selectedSports, setSelectedSports] = useState<string[]>([]);

    const toggleSport = (sport: string) => {
        setSelectedSports(prev =>
            prev.includes(sport) ? prev.filter(s => s !== sport) : [...prev, sport]
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <Card className="bg-card border-border/20 shadow-lg shadow-accent/10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Photos</CardTitle>
                        <CardDescription>Max 5 photos. Montrez-vous en action !</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <div key={index} className="aspect-square bg-card-foreground/5 rounded-lg border-2 border-dashed border-border flex items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                         <Button variant="outline" className="mt-4">
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une photo
                        </Button>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/20 shadow-lg shadow-accent/10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">À propos de moi</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea id="bio" placeholder="Parlez-nous de vous et de votre parcours sportif." />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="ville">Ville</Label>
                            <Input id="ville" placeholder="Ex: Neuchâtel" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/20 shadow-lg shadow-accent/10">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Mes Sports</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {sportsList.map(sport => (
                                <Button
                                    key={sport}
                                    variant="outline"
                                    onClick={() => toggleSport(sport)}
                                    className={cn(
                                        "rounded-full transition-colors",
                                        selectedSports.includes(sport)
                                            ? "bg-accent text-accent-foreground border-accent-foreground/50 hover:bg-accent/90"
                                            : "bg-transparent"
                                    )}
                                >
                                    {sport}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
                
                <div className="flex justify-end">
                    <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-bold px-8 py-6 rounded-full transition-transform transform hover:scale-105 shadow-lg">
                        Sauvegarder mon profil
                    </Button>
                </div>
            </div>
        </div>
    )
}
