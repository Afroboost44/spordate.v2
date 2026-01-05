"use client";

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, MapPin, Undo2, Zap, Lock, CheckCircle, RefreshCcw, Handshake } from 'lucide-react';
import Image from 'next/image';
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';

const initialProfiles = [
  { id: 1, name: 'Julie, 28', location: 'Paris', sports: ['Tennis', 'Yoga'], bio: 'Cherche un partenaire pour des matchs de tennis le week-end.', imageId: 'discovery-1' },
  { id: 2, name: 'Marc, 32', location: 'Lyon', sports: ['Crossfit', 'Running'], bio: 'Passionné de Crossfit, je m\'entraîne 4 fois par semaine.', imageId: 'discovery-2' },
  { id: 3, name: 'Sophie, 25', location: 'Marseille', sports: ['Danse', 'Fitness'], bio: 'Danseuse professionnelle cherche à partager sa passion.', imageId: 'discovery-3' },
];

const boostedActivities = [
    { title: 'Neon Crossfit', location: 'Lausanne', time: '18:00', price: '25 CHF', imageId: 'activity-gym' },
    { title: 'City Tennis', location: 'Genève', time: '20:00', price: '40 CHF', imageId: 'activity-tennis' },
    { title: 'Zen Yoga', location: 'Fribourg', time: '19:00', price: '30 CHF', imageId: 'activity-yoga' },
];


export default function DiscoveryPage() {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMatch, setIsMatch] = useState(false);
  const router = useRouter();

  const discoveryImages = PlaceHolderImages.filter(p => p.id.startsWith('discovery-'));
  const activityImages = PlaceHolderImages.filter(p => p.id.startsWith('activity-'));

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
    router.push('/payment');
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
        <DialogContent className="max-w-xl w-full bg-card border-border/20 text-foreground p-0">
          <DialogHeader className="items-center p-6 pb-2">
            <DialogTitle className="text-4xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-rose-400 flex items-center gap-2">
                IT'S A MATCH ! <Zap className="text-yellow-400 fill-current" />
            </DialogTitle>
            <DialogDescription className="text-center pt-2 text-foreground/70 !mt-2">
              Pour discuter avec {currentProfile?.name.split(',')[0]}, réservez une activité sportive commune.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 py-4">
              <ul className="space-y-2 text-sm text-foreground/60 mb-6">
                  <li className="flex items-center gap-2"><CheckCircle size={16} className="text-green-500"/> Le Chat se débloque immédiatement après paiement.</li>
                  <li className="flex items-center gap-2"><RefreshCcw size={16} className="text-blue-500"/> Annulation gratuite jusqu'à 1h avant le rendez-vous.</li>
                  <li className="flex items-center gap-2"><Handshake size={16} className="text-amber-500"/> Paiement sécurisé vers le Partenaire (Club/Salle).</li>
              </ul>
          </div>
          
          <div className="bg-background/50 px-6 py-6">
             <h4 className="text-lg font-semibold mb-4 text-center">Activités Boostées pour votre Date</h4>
             <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="-ml-4">
                    {boostedActivities.map((activity, index) => {
                        const activityImage = activityImages.find(img => img.id === activity.imageId);
                        return (
                            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/2">
                                <Card className="overflow-hidden bg-card border-border/20 shadow-md hover:shadow-accent/20 transition-shadow">
                                     <div className="relative h-32 w-full">
                                        {activityImage && (
                                            <Image src={activityImage.imageUrl} alt={activity.title} fill className="object-cover"/>
                                        )}
                                        <Badge className="absolute top-2 right-2 bg-yellow-400 text-black font-bold border-yellow-400">BOOST</Badge>
                                    </div>
                                    <CardContent className="p-4">
                                        <h5 className="font-bold truncate">{activity.title}</h5>
                                        <p className="text-sm text-muted-foreground">{activity.location} • {activity.time}</p>
                                        <div className="flex justify-between items-center mt-3">
                                            <span className="font-bold text-lg text-accent">{activity.price}</span>
                                            <Button onClick={bookActivity} size="sm" className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white text-xs">Réserver ce date</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
             </Carousel>
          </div>

          <Separator className="bg-border/20"/>
          
          <div className="p-6 flex flex-col gap-3">
             <Button onClick={() => {}} variant="outline" className="w-full" disabled>
                <Lock className="mr-2 h-4 w-4" />
                Chat verrouillé
            </Button>
            <Button onClick={closeMatchModal} variant="ghost" className="w-full text-muted-foreground">Passer pour cette fois</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
