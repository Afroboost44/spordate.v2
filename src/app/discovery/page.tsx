"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, MapPin, Undo2, Zap, Lock, CheckCircle, RefreshCcw, Handshake, Share2, CreditCard, Smartphone, Check, Ticket, Loader2 } from 'lucide-react';
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
import { useRouter, useSearchParams } from 'next/navigation';
import { 
   Carousel, 
   CarouselContent, 
   CarouselItem, 
   CarouselPrevious, 
   CarouselNext 
} from '@/components/ui/carousel';
import { Separator } from '@/components/ui/separator';
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Revenue storage key for admin sync
const REVENUE_STORAGE_KEY = 'spordate_revenue';
const TICKETS_STORAGE_KEY = 'spordate_tickets';

const initialProfiles = [
  { id: 1, name: 'Julie, 28', location: 'Paris', sports: ['Afroboost', 'Danse'], bio: 'Passionnée d\'Afroboost, je cherche un partenaire pour danser !', imageId: 'discovery-1', price: 25 },
  { id: 2, name: 'Marc, 32', location: 'Lyon', sports: ['Danse', 'Fitness'], bio: 'Danseur confirmé, fan de rythmes africains.', imageId: 'discovery-2', price: 30 },
  { id: 3, name: 'Sophie, 25', location: 'Marseille', sports: ['Afroboost', 'Fitness'], bio: 'Coach Afroboost, je partage ma passion avec énergie !', imageId: 'discovery-3', price: 35 },
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
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'twint'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmedTickets, setConfirmedTickets] = useState<number[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Load confirmed tickets from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const saved = localStorage.getItem(TICKETS_STORAGE_KEY);
    if (saved) {
      try {
        setConfirmedTickets(JSON.parse(saved));
      } catch (e) {
        console.warn('Failed to parse tickets');
      }
    }
    
    // Check for referral in URL
    const ref = searchParams.get('ref');
    const profileId = searchParams.get('profile');
    if (ref && profileId) {
      toast({
        title: "Invitation reçue ! 🎉",
        description: `Vous avez été invité via le code ${ref}`,
      });
    }
  }, [searchParams, toast]);

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

  // Share profile with referral code
  const handleShareProfile = async () => {
    if (typeof window === 'undefined') return;
    
    const userCode = localStorage.getItem('spordate_user_code') || 'SPORT-USER';
    const shareUrl = `https://spordateur.com/discovery?ref=${userCode}&profile=${currentProfile?.id}`;
    const shareText = `Regarde ce profil sur Spordateur, on va faire une séance ensemble ? 💪🔥`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${currentProfile?.name} sur Spordateur`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      toast({
        title: "Lien copié ! 📋",
        description: "Partage ce profil avec tes amis WhatsApp !",
      });
    }
  };

  // Open payment modal
  const handleBookSession = () => {
    setShowPaymentModal(true);
  };

  // Process payment
  const handlePayment = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Update revenue in localStorage for admin sync (+25€)
    const currentRevenue = parseInt(localStorage.getItem(REVENUE_STORAGE_KEY) || '1250');
    const newRevenue = currentRevenue + 25;
    localStorage.setItem(REVENUE_STORAGE_KEY, newRevenue.toString());
    
    // Save confirmed ticket
    const newTickets = [...confirmedTickets, currentProfile?.id || 0];
    setConfirmedTickets(newTickets);
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(newTickets));
    
    setIsProcessing(false);
    setShowPaymentModal(false);
    
    toast({
      title: "Paiement confirmé ! ✅",
      description: `Votre séance Afroboost avec ${currentProfile?.name.split(',')[0]} est réservée.`,
    });
  };

  const currentProfile = profiles[currentIndex];
  const profileImage = discoveryImages.find(img => img.id === currentProfile?.imageId);
  const hasTicket = currentProfile && confirmedTickets.includes(currentProfile.id);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] p-4">
      {currentProfile ? (
        <div className="w-full max-w-sm mx-auto">
          <Card className="relative bg-card border-border/20 shadow-lg shadow-accent/10 rounded-2xl overflow-hidden">
            {/* Ticket Badge */}
            {hasTicket && (
              <div className="absolute top-4 right-4 z-20">
                <Badge className="bg-green-500 text-white px-3 py-1 flex items-center gap-1">
                  <Ticket className="h-3 w-3" />
                  Ticket Confirmé
                </Badge>
              </div>
            )}
            
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
                      {sport === 'Afroboost' && <Zap className="h-3 w-3 mr-1" />}
                      {sport}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg mb-2">Bio</h3>
                <p className="text-foreground/70 text-sm">{currentProfile.bio}</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2 mt-4">
                {!hasTicket ? (
                  <Button 
                    onClick={handleBookSession}
                    className="flex-1 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white"
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Réserver une séance • {currentProfile.price}€
                  </Button>
                ) : (
                  <Button 
                    disabled
                    className="flex-1 bg-green-600 text-white cursor-default"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Séance Réservée
                  </Button>
                )}
                <Button 
                  onClick={handleShareProfile}
                  variant="outline"
                  size="icon"
                  className="border-primary/50 text-primary hover:bg-primary/10"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Like/Dislike Buttons */}
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

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="max-w-md w-full bg-[#0a0a0a] border-violet-500/30 text-white p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0 bg-gradient-to-b from-violet-900/20 to-transparent">
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Zap className="h-6 w-6 text-yellow-400" />
              Réserver une séance Afroboost
            </DialogTitle>
            <DialogDescription className="text-gray-400">
              Séance avec {currentProfile?.name.split(',')[0]} à {currentProfile?.location}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/* Price Summary */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">Séance Afroboost (1h)</span>
                <span className="font-semibold">{currentProfile?.price}€</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Frais de service</span>
                <span className="text-gray-500">0€</span>
              </div>
              <Separator className="my-3 bg-white/10" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-green-400">{currentProfile?.price}€</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm text-gray-400">Méthode de paiement</Label>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant={paymentMethod === 'card' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('card')}
                  className={`h-16 flex flex-col items-center gap-1 ${
                    paymentMethod === 'card' 
                      ? 'bg-violet-600 border-violet-500' 
                      : 'bg-transparent border-gray-700'
                  }`}
                >
                  <CreditCard className="h-5 w-5" />
                  <span className="text-xs">Carte</span>
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === 'twint' ? 'default' : 'outline'}
                  onClick={() => setPaymentMethod('twint')}
                  className={`h-16 flex flex-col items-center gap-1 ${
                    paymentMethod === 'twint' 
                      ? 'bg-violet-600 border-violet-500' 
                      : 'bg-transparent border-gray-700'
                  }`}
                >
                  <Smartphone className="h-5 w-5" />
                  <span className="text-xs">Twint</span>
                </Button>
              </div>
            </div>

            {/* Card Form */}
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-gray-400">Numéro de carte</Label>
                  <Input 
                    placeholder="4242 4242 4242 4242"
                    className="bg-black border-gray-700 mt-1"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs text-gray-400">Expiration</Label>
                    <Input 
                      placeholder="MM/AA"
                      className="bg-black border-gray-700 mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-400">CVC</Label>
                    <Input 
                      placeholder="123"
                      className="bg-black border-gray-700 mt-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Twint */}
            {paymentMethod === 'twint' && (
              <div className="text-center py-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-16 h-16 mx-auto mb-3 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-2xl font-black text-black">T</span>
                </div>
                <p className="text-sm text-gray-400">
                  Vous serez redirigé vers l'app Twint
                </p>
              </div>
            )}

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 rounded-lg p-3">
              <Lock className="h-4 w-4" />
              <span>Paiement sécurisé par Stripe. Vos données sont chiffrées.</span>
            </div>

            {/* Pay Button */}
            <Button 
              onClick={handlePayment}
              disabled={isProcessing}
              className="w-full h-12 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white font-semibold text-lg"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Traitement...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-5 w-5" />
                  Payer {currentProfile?.price}€
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Match Modal */}
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
