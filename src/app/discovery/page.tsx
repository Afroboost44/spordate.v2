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
import { 
   Carousel, 
   CarouselContent, 
   CarouselItem, 
   CarouselPrevious, 
   CarouselNext 
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';

const initialProfiles = [
  { id: 1, name: 'Julie, 28', location: 'Paris', sports: ['Afroboost', 'Danse'], bio: 'Passionnée d\'Afroboost, je cherche un partenaire pour danser !', imageId: 'discovery-1' },
  { id: 2, name: 'Marc, 32', location: 'Lyon', sports: ['Danse', 'Fitness'], bio: 'Danseur confirmé, fan de rythmes africains.', imageId: 'discovery-2' },
  { id: 3, name: 'Sophie, 25', location: 'Marseille', sports: ['Afroboost', 'Fitness'], bio: 'Coach Afroboost, je partage ma passion avec énergie !', imageId: 'discovery-3' },
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
          <Button onClick={resetProfiles} variant="outline">
            <Undo2 className="mr-2 h-4 w-4" />
            Recommencer
          </Button>
        </div>
      )}

        <Dialog open={isMatch} onOpenChange={setIsMatch}>
        <DialogContent className="max-w-2xl w-full bg-[#0f0f0f] border-violet-500/20 text-foreground p-0 overflow-hidden">
             
          <DialogHeader className="items-center p-6 pb-2 bg-gradient-to-b from-violet-900/10 to-transparent">
            <DialogTitle className="text-3xl sm:text-5xl font-black tracking-tighter text-white flex items-center gap-3 drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                IT'S A MATCH <Zap className="text-yellow-400 fill-yellow-400 h-8 w-8 sm:h-10 sm:w-10" />
            </DialogTitle>
            <DialogDescription className="text-center text-base sm:text-lg text-gray-300 mt-2">
              Pour discuter avec <span className="text-violet-400 font-bold">{currentProfile?.name.split(',')[0]}</span>, réservez une activité.
            </DialogDescription>
          </DialogHeader>
          
          <div className="px-6 sm:px-8 py-2">
              <ul className="flex flex-col sm:flex-row justify-between gap-2 sm:gap-4 text-xs text-gray-400 border-y border-white/5 py-4 text-center sm:text-left">
                  <li className="flex items-center justify-center sm:justify-start gap-2"><CheckCircle size={14} className="text-green-500"/> Chat débloqué après paiement</li>
                  <li className="flex items-center justify-center sm:justify-start gap-2"><RefreshCcw size={14} className="text-blue-500"/> Annulation gratuite (-1h)</li>
                  <li className="flex items-center justify-center sm:justify-start gap-2"><Handshake size={14} className="text-amber-500"/> Paiement sécurisé</li>
              </ul>
          </div>
          
          <div className="bg-white/5 px-6 sm:px-8 py-6">
             <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-bold text-white flex items-center gap-2">🔥 Activités recommandées</h4>
                <Badge variant="outline" className="border-yellow-500/50 text-yellow-500">Boosted</Badge>
             </div>
             
             <div className="relative px-0 sm:px-8">
                  <Carousel opts={{ align: "start", loop: true }} className="w-full">
                    <CarouselContent className="-ml-4">
                        {boostedActivities.map((activity, index) => {
                            const activityImage = activityImages.find(img => img.id === activity.imageId);
                            return (
                                <CarouselItem key={index} className="pl-4 basis-full sm:basis-1/2">
                                    <Card className="overflow-hidden bg-[#1a1a1a] border-white/10 hover:border-violet-500/50 transition-all group">
                                         <div className="relative h-32 w-full">
                                            {activityImage && (
                                                <Image src={activityImage.imageUrl} alt={activity.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500"/>
                                            )}
                                            <div className="absolute top-2 right-2 bg-yellow-400 text-black text-xs font-bold px-2 py-0.5 rounded">BOOST</div>
                                        </div>
                                        <CardContent className="p-3">
                                            <h5 className="font-bold text-white truncate">{activity.title}</h5>
                                            <p className="text-xs text-gray-400 mb-3">{activity.location} • {activity.time}</p>
                                            <Button onClick={bookActivity} className="w-full bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white text-xs font-bold h-8">
                                                Réserver • {activity.price}
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            )
                        })}
                    </CarouselContent>
                    <CarouselPrevious className="absolute -left-2 sm:-left-4 top-1/2 -translate-y-1/2" />
                    <CarouselNext className="absolute -right-2 sm:-right-4 top-1/2 -translate-y-1/2" />
                  </Carousel>
             </div>
          </div>

          <Separator className="bg-white/5"/>
          
          <div className="p-6 flex flex-col gap-3">
             <Button onClick={() => router.push('/chat')} variant="outline" className="w-full border-gray-700 text-gray-500 cursor-not-allowed">
                <Lock className="mr-2 h-4 w-4" />
                Chat verrouillé
            </Button>
            <Button onClick={closeMatchModal} variant="ghost" className="w-full text-gray-500 hover:text-white">Passer pour cette fois</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
