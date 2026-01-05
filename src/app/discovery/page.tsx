"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, MapPin, Undo2, Zap } from 'lucide-react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';

const initialProfiles = [
  { id: 1, name: 'Julie, 28', location: 'Paris', sports: ['Tennis', 'Yoga'], bio: 'Cherche un partenaire pour des matchs de tennis le week-end.', imageId: 'discovery-1' },
  { id: 2, name: 'Marc, 32', location: 'Lyon', sports: ['Crossfit', 'Running'], bio: 'Passionné de Crossfit, je m\'entraîne 4 fois par semaine.', imageId: 'discovery-2' },
  { id: 3, name: 'Sophie, 25', location: 'Marseille', sports: ['Danse', 'Fitness'], bio: 'Danseuse professionnelle cherche à partager sa passion.', imageId: 'discovery-3' },
];

export default function DiscoveryPage() {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const router = useRouter();

  const discoveryImages = PlaceHolderImages.filter(p => p.id.startsWith('discovery-'));

  const handleNextProfile = () => {
    setCurrentIndex(prev => prev + 1);
  };

  const handleLike = () => {
    // Simulate a match
    setIsMatch(true);
  };
  
  const resetProfiles = () => {
    setCurrentIndex(0);
    setProfiles(initialProfiles);
  }

  const closeMatchModal = () => {
    setIsMatch(false);
    handleNextProfile();
  }

  const bookActivity = () => {
    router.push('/activities');
  }

  const currentProfile = profiles[currentIndex];
  const profileImage = discoveryImages.find(img => img.id === currentProfile?.imageId);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      {currentProfile ? (
        <div className="w-full max-w-sm mx-auto">
          <Card className="relative bg-card border-border/20 shadow-lg shadow-accent/10 rounded-2xl overflow-hidden">
            <div className="relative h-96 w-full">
              {profileImage && (
                <Image
                  src={profileImage.imageUrl}
                  alt={currentProfile.name}
                  fill
                  className="object-cover"
                  data-ai-hint={profileImage.imageHint}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-4 left-4 text-white">
                <h2 className="text-3xl font-bold">{currentProfile.name}</h2>
                <p className="flex items-center gap-1 text-gray-300"><MapPin size={16}/>{currentProfile.location}</p>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Sports</h3>
                <div className="flex flex-wrap gap-2">
                  {currentProfile.sports.map(sport => (
                    <Badge key={sport} variant="secondary" className="bg-primary/20 text-accent border-accent/50 text-sm">
                      {sport}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Bio</h3>
                <p className="text-foreground/70 text-sm">{currentProfile.bio}</p>
              </div>
            </CardContent>
          </Card>
          <div className="flex justify-center items-center gap-6 mt-6">
            <Button onClick={handleNextProfile} variant="outline" size="icon" className="h-20 w-20 rounded-full border-4 border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-400">
              <X size={40} />
            </Button>
            <Button onClick={handleLike} size="icon" className="h-24 w-24 rounded-full bg-gradient-to-br from-[#E91E63] to-[#7B1FA2] text-white shadow-lg shadow-rose-500/30">
              <Heart size={48} fill="currentColor" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Plus de profils sportifs dans votre zone pour le moment.</h2>
          <p className="text-muted-foreground mb-6">Revenez plus tard ou élargissez vos critères.</p>
          <Button onClick={resetProfiles} variant="outline">
            <Undo2 className="mr-2 h-4 w-4" />
            Recommencer
          </Button>
        </div>
      )}

      <Dialog open={isMatch} onOpenChange={setIsMatch}>
        <DialogContent className="sm:max-w-md bg-card border-border/20 text-foreground">
          <DialogHeader className="items-center">
            <DialogTitle className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-rose-400 flex items-center gap-2">
                IT'S A MATCH ! <Zap className="text-yellow-400 fill-current" />
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-foreground/70">
              {currentProfile && `Vous et ${currentProfile.name.split(',')[0]} partagez la même passion pour le ${currentProfile.sports[0]}.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col sm:space-x-0">
            <Button onClick={bookActivity} className="w-full bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold">Réserver une activité maintenant</Button>
            <Button onClick={closeMatchModal} variant="ghost" className="w-full">Continuer à chercher</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}
