"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function ChatPage() {
    const router = useRouter();
    const marcProfileImage = PlaceHolderImages.find(p => p.id === 'discovery-2');
    const currentUserImage = PlaceHolderImages.find(p => p.id === 'profile-1');

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] p-4 bg-background">
            <div className="container mx-auto p-0 sm:p-4 flex flex-col h-full max-w-2xl">
                <Card className="flex-1 flex flex-col bg-card border-border/20 shadow-lg shadow-accent/10 rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between gap-4 p-4 border-b border-border/20">
                        <div className="flex items-center gap-3">
                           <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.back()}>
                                <ArrowLeft className="h-5 w-5" />
                           </Button>
                            <Avatar>
                                {marcProfileImage && <AvatarImage src={marcProfileImage.imageUrl} alt="Marc" />}
                                <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-lg font-bold">Marc</CardTitle>
                                <p className="text-sm text-green-400 flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                                    En ligne
                                </p>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon">
                            <Info className="h-5 w-5 text-foreground/70" />
                            <span className="sr-only">Détails Activité</span>
                        </Button>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
                         <div className="flex items-end gap-2 justify-start">
                            <Avatar className="h-8 w-8">
                                {marcProfileImage && <AvatarImage src={marcProfileImage.imageUrl} alt="Marc" />}
                                <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3 max-w-xs">
                                <p className="text-sm text-foreground/90">Salut ! J'ai vu que tu as réservé le Neon Fitness. Trop cool ! 🔥</p>
                            </div>
                        </div>
                         <div className="flex items-end gap-2 justify-end">
                            <div className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-primary-foreground rounded-lg p-3 max-w-xs">
                                <p className="text-sm">Oui, hâte d'y être !</p>
                            </div>
                             <Avatar className="h-8 w-8">
                                {currentUserImage && <AvatarImage src={currentUserImage.imageUrl} alt="You" />}
                                <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                        </div>
                        <div className="flex items-end gap-2 justify-start">
                            <Avatar className="h-8 w-8">
                                {marcProfileImage && <AvatarImage src={marcProfileImage.imageUrl} alt="Marc" />}
                                <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3 max-w-xs">
                                <p className="text-sm text-foreground/90">On se retrouve à l'accueil à 18h ?</p>
                            </div>
                        </div>
                    </CardContent>
                    <div className="p-4 border-t border-border/20 bg-card/50 sticky bottom-0">
                        <div className="relative">
                            <Input placeholder="Écrivez un message..." className="pr-12 h-11" />
                            <Button size="icon" className="absolute right-1.5 top-1/2 -translate-y-1/2 h-8 w-8 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white hover:opacity-90">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
