"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Heart, MapPin, Undo2, Zap, Lock, CheckCircle, RefreshCcw, Handshake, Share2, CreditCard, Smartphone, Check, Ticket, Loader2, Building2, Navigation, Clock, Users, Calendar, MessageCircle, Send, ChevronRight, Download, Gift } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { registerBooking, getConfirmedTickets, getPartners, DEFAULT_PARTNERS, type Partner } from "@/lib/db";

// Revenue storage key for admin sync (kept for backward compatibility)
const TICKETS_STORAGE_KEY = 'spordate_tickets';
const LAST_BOOKING_KEY = 'spordate_last_booking';

// Mock participants for social proof
const mockParticipants = [
  { id: 1, name: 'Julie', avatar: 'J', sport: 'Afroboost' },
  { id: 2, name: 'Marc', avatar: 'M', sport: 'Danse' },
  { id: 3, name: 'Sophie', avatar: 'S', sport: 'Fitness' },
];

// Mock upcoming sessions
const mockSessions = [
  { id: 1, title: 'Afroboost Débutant', day: 'Lundi', time: '19:00', spots: 3 },
  { id: 2, title: 'Danse Africaine', day: 'Mercredi', time: '18:30', spots: 5 },
  { id: 3, title: 'Cardio Dance', day: 'Vendredi', time: '20:00', spots: 2 },
];

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
  const [partners, setPartners] = useState<Partner[]>(DEFAULT_PARTNERS);
  
  // New states for social features
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [selectedMeetingPlace, setSelectedMeetingPlace] = useState<string>('');
  const [showTicketSuccess, setShowTicketSuccess] = useState(false);
  const [lastBooking, setLastBooking] = useState<{profile: string, partner: string, partnerAddress?: string, isDuo: boolean, amount: number} | null>(null);
  
  // Duo option state
  const [isDuoTicket, setIsDuoTicket] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  // Load partners function (extracted for reuse)
  const loadPartnersData = async () => {
    try {
      const loadedPartners = await getPartners();
      setPartners(loadedPartners.filter(p => p.active));
    } catch (e) {
      setPartners(DEFAULT_PARTNERS);
    }
  };

  // Load confirmed tickets and partners
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load tickets
    const tickets = getConfirmedTickets();
    setConfirmedTickets(tickets);
    
    // Load partners
    loadPartnersData();
    
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

  // Real-time sync: refresh partners when tab becomes visible
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        loadPartnersData();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Also refresh every 30 seconds when page is active
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        loadPartnersData();
      }
    }, 30000);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

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
    setSelectedMeetingPlace('');
    setIsDuoTicket(false);
    setShowPaymentModal(true);
  };

  // Calculate current price based on solo/duo
  const getCurrentPrice = () => {
    if (!currentProfile) return 25;
    return isDuoTicket ? 50 : currentProfile.price;
  };

  // Process payment
  const handlePayment = async () => {
    if (typeof window === 'undefined' || !currentProfile) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const finalPrice = getCurrentPrice();
    
    try {
      // Register booking in Firestore/localStorage
      const userId = localStorage.getItem('spordate_user_id') || `user-${Date.now()}`;
      const result = await registerBooking(
        userId,
        currentProfile.id,
        currentProfile.name,
        finalPrice
      );
      
      // Update local state
      const newTickets = [...confirmedTickets, currentProfile.id];
      setConfirmedTickets(newTickets);
      
      // Also save to localStorage for immediate UI update
      localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(newTickets));
      
      // Save last booking for share feature
      const meetingPartner = partners.find(p => p.id === selectedMeetingPlace);
      const bookingInfo = {
        profile: currentProfile.name.split(',')[0],
        partner: meetingPartner?.name || 'Non défini',
        partnerAddress: meetingPartner ? `${meetingPartner.address}, ${meetingPartner.city}` : undefined,
        isDuo: isDuoTicket,
        amount: finalPrice,
      };
      setLastBooking(bookingInfo);
      localStorage.setItem(LAST_BOOKING_KEY, JSON.stringify(bookingInfo));
      
      setIsProcessing(false);
      setShowPaymentModal(false);
      setShowTicketSuccess(true);
      
      // Show success with storage info
      toast({
        title: "Paiement confirmé ! ✅",
        description: meetingPartner 
          ? `RDV ${isDuoTicket ? 'Duo' : 'Solo'} avec ${currentProfile.name.split(',')[0]} à ${meetingPartner.name}`
          : `Séance ${isDuoTicket ? 'Duo' : 'Solo'} réservée avec ${currentProfile.name.split(',')[0]}`,
      });
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors du paiement.",
      });
    }
  };

  // Share ticket on WhatsApp - dynamic message for Solo/Duo
  const shareTicketOnWhatsApp = () => {
    if (!lastBooking) return;
    
    let message: string;
    if (lastBooking.isDuo) {
      // Duo ticket message - inviting partner
      message = encodeURIComponent(
        `🎁 Je t'offre une séance Afroboost avec ${lastBooking.profile} !\n\n📍 RDV à ${lastBooking.partner}\n💪 C'est gratuit pour toi, je t'ai déjà payé ta place !\n\nDétails sur Spordateur\nhttps://spordateur.com/discovery`
      );
    } else {
      // Solo ticket message
      message = encodeURIComponent(
        `Je vais m'entraîner à ${lastBooking.partner}, rejoins-moi ! 💪🔥\n\nRDV avec ${lastBooking.profile} sur Spordateur\nhttps://spordateur.com/discovery`
      );
    }
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  // Add to Google Calendar
  const addToGoogleCalendar = () => {
    if (!lastBooking) return;
    
    const ticketType = lastBooking.isDuo ? 'Duo' : 'Solo';
    const title = encodeURIComponent(`Séance Afroboost ${ticketType} avec ${lastBooking.profile}`);
    const location = lastBooking.partnerAddress 
      ? encodeURIComponent(lastBooking.partnerAddress)
      : encodeURIComponent('Spordateur');
    const details = encodeURIComponent(`🎟️ Ticket ${ticketType} - ${lastBooking.amount}€\nPartenaire: ${lastBooking.profile}\nLieu: ${lastBooking.partner}\n\nRéservé via Spordateur`);
    
    // Create event for tomorrow at 19:00
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(19, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(20, 0, 0, 0);
    
    const formatDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1);
    
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${formatDate(startDate)}/${formatDate(endDate)}&location=${location}&details=${details}`;
    
    window.open(calendarUrl, '_blank');
    toast({ title: "Google Calendar ouvert 📅", description: "Ajoutez l'événement à votre agenda !" });
  };

  // Download .ics calendar file
  const downloadIcsFile = () => {
    if (!lastBooking) return;
    
    const ticketType = lastBooking.isDuo ? 'Duo' : 'Solo';
    
    // Create event for tomorrow at 19:00
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(19, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setHours(20, 0, 0, 0);
    
    const formatIcsDate = (d: Date) => {
      return d.toISOString().replace(/-|:|\.\d+/g, '').slice(0, -1) + 'Z';
    };
    
    const location = lastBooking.partnerAddress || 'Spordateur';
    
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Spordateur//FR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${formatIcsDate(startDate)}
DTEND:${formatIcsDate(endDate)}
SUMMARY:Séance Afroboost ${ticketType} avec ${lastBooking.profile}
DESCRIPTION:🎟️ Ticket ${ticketType} - ${lastBooking.amount}€\\nPartenaire: ${lastBooking.profile}\\nLieu: ${lastBooking.partner}\\n\\nRéservé via Spordateur
LOCATION:${location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `spordateur-seance-${ticketType.toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({ title: "Fichier téléchargé 📅", description: "Ouvrez-le pour l'ajouter à votre calendrier !" });
  };

  // Select partner from "Où pratiquer?" list - pre-select for booking
  const handlePartnerSelect = (partner: Partner) => {
    if (selectedMeetingPlace === partner.id) {
      // If already selected, open detail modal
      setSelectedPartner(partner);
      setShowPartnerModal(true);
    } else {
      // Select this partner as meeting place
      setSelectedMeetingPlace(partner.id!);
      toast({
        title: `${partner.name} sélectionné ✓`,
        description: "Ce lieu sera pré-sélectionné pour votre réservation",
      });
    }
  };

  // Open partner detail modal (from other places)
  const handlePartnerClick = (partner: Partner) => {
    setSelectedPartner(partner);
    setShowPartnerModal(true);
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

          {/* Où pratiquer ? - Partner Section */}
          <div className="mt-8 w-full">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-bold">Où pratiquer ?</h3>
              <Badge variant="outline" className="ml-auto border-violet-500/50 text-violet-400 text-xs">
                Partenaires
              </Badge>
            </div>
            <div className="space-y-3">
              {partners.slice(0, 3).map((partner) => (
                <Card 
                  key={partner.id} 
                  className={`bg-card/50 border-border/20 transition-all duration-300 cursor-pointer group
                    hover:border-violet-500/60 hover:shadow-lg hover:shadow-violet-500/20 hover:scale-[1.02]
                    ${selectedMeetingPlace === partner.id ? 'border-violet-500 shadow-lg shadow-violet-500/30 bg-violet-500/10' : ''}
                  `}
                  onClick={() => handlePartnerSelect(partner)}
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-[#7B1FA2] to-[#E91E63] flex items-center justify-center text-white font-bold text-lg transition-transform group-hover:scale-110 ${selectedMeetingPlace === partner.id ? 'scale-110' : ''}`}>
                      {partner.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                        {partner.name}
                      </h4>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {partner.city}
                      </p>
                    </div>
                    {selectedMeetingPlace === partner.id ? (
                      <Badge className="bg-violet-500 text-white text-xs">Sélectionné</Badge>
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
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
        <DialogContent className="max-w-md w-full bg-[#0a0a0a] border-violet-500/30 text-white p-0 overflow-hidden max-h-[90vh] overflow-y-auto">
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
            {/* Duo Option Toggle */}
            <div data-testid="duo-option-toggle" className="bg-gradient-to-r from-violet-900/30 to-pink-900/30 rounded-xl p-4 border border-violet-500/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7B1FA2] to-[#E91E63] flex items-center justify-center">
                    <Gift className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">J'invite mon partenaire</p>
                    <p className="text-xs text-gray-400">Offrir la séance (2 places)</p>
                  </div>
                </div>
                <Switch
                  checked={isDuoTicket}
                  onCheckedChange={setIsDuoTicket}
                  className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-[#7B1FA2] data-[state=checked]:to-[#E91E63]"
                />
              </div>
              {isDuoTicket && (
                <div className="mt-3 pt-3 border-t border-white/10 text-xs text-violet-300">
                  ✨ Vous recevrez un lien WhatsApp à partager avec votre invité(e)
                </div>
              )}
            </div>

            {/* Price Summary */}
            <div data-testid="price-summary" className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-400">
                  {isDuoTicket ? 'Séance Duo Afroboost (2x 1h)' : 'Séance Afroboost (1h)'}
                </span>
                <span className="font-semibold">{getCurrentPrice()}€</span>
              </div>
              {isDuoTicket && (
                <div className="flex justify-between items-center text-sm text-violet-300 mb-2">
                  <span className="flex items-center gap-1">
                    <Gift className="h-3 w-3" /> Place offerte incluse
                  </span>
                  <span className="line-through text-gray-500">{(currentProfile?.price || 25) * 2}€</span>
                </div>
              )}
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Frais de service</span>
                <span className="text-gray-500">0€</span>
              </div>
              <Separator className="my-3 bg-white/10" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-green-400">{getCurrentPrice()}€</span>
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

            {/* Meeting Place Selection */}
            <div className="space-y-3">
              <Label className="text-sm text-gray-400 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Lieu de rendez-vous (optionnel)
              </Label>
              <Select value={selectedMeetingPlace} onValueChange={setSelectedMeetingPlace}>
                <SelectTrigger className="bg-black border-gray-700">
                  <SelectValue placeholder="Choisir un lieu partenaire..." />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id!}>
                      <div className="flex items-center gap-2">
                        <span>{partner.name}</span>
                        <span className="text-xs text-muted-foreground">• {partner.city}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                  Payer {getCurrentPrice()}€ {isDuoTicket && '(Duo)'}
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

      {/* Partner Detail Modal */}
      <Dialog open={showPartnerModal} onOpenChange={setShowPartnerModal}>
        <DialogContent className="max-w-md w-full bg-[#0a0a0a] border-violet-500/30 text-white p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0 bg-gradient-to-b from-violet-900/20 to-transparent">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7B1FA2] to-[#E91E63] flex items-center justify-center text-white font-bold text-2xl">
                {selectedPartner?.name.charAt(0)}
              </div>
              <div>
                <DialogTitle className="text-xl font-bold">{selectedPartner?.name}</DialogTitle>
                <DialogDescription className="text-gray-400 flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedPartner?.city}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 space-y-6">
            {/* Address */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex items-start gap-3">
                <Navigation className="h-5 w-5 text-violet-400 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Adresse complète</p>
                  <p className="text-xs text-gray-400">{selectedPartner?.address}</p>
                  <p className="text-xs text-gray-400">{selectedPartner?.city}</p>
                </div>
              </div>
            </div>

            {/* Upcoming Sessions */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-violet-400" />
                Prochaines sessions
              </h4>
              <div className="space-y-2">
                {mockSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <p className="text-sm font-medium">{session.title}</p>
                      <p className="text-xs text-gray-400">{session.day} • {session.time}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {session.spots} places
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Who's Participating */}
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-violet-400" />
                Qui participe ?
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-3">
                  {mockParticipants.map((p) => (
                    <Avatar key={p.id} className="border-2 border-[#0a0a0a] w-10 h-10">
                      <AvatarFallback className="bg-gradient-to-br from-[#7B1FA2] to-[#E91E63] text-white text-sm">
                        {p.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="text-white">{mockParticipants.map(p => p.name).join(', ')}</p>
                  <p className="text-xs text-gray-400">ont réservé récemment</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button 
                onClick={() => setShowPartnerModal(false)}
                className="flex-1 bg-gradient-to-r from-[#7B1FA2] to-[#E91E63]"
              >
                <Ticket className="mr-2 h-4 w-4" />
                Réserver ici
              </Button>
              <Button 
                variant="outline"
                className="border-gray-700"
                onClick={() => {
                  const msg = encodeURIComponent(`Découvre ${selectedPartner?.name} sur Spordateur ! 💪\nhttps://spordateur.com/discovery`);
                  window.open(`https://wa.me/?text=${msg}`, '_blank');
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Ticket Success Modal */}
      <Dialog open={showTicketSuccess} onOpenChange={setShowTicketSuccess}>
        <DialogContent className="max-w-sm w-full bg-[#0a0a0a] border-green-500/30 text-white text-center">
          <div className="py-6 space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-400" />
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-2">Réservation confirmée ! 🎉</h3>
              <p className="text-gray-400 text-sm">
                Votre séance {lastBooking?.isDuo ? 'Duo' : 'Solo'} avec {lastBooking?.profile} est réservée
                {lastBooking?.partner !== 'Non défini' && ` à ${lastBooking?.partner}`}
              </p>
            </div>

            {/* Ticket Summary */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-3">
                <Ticket className="h-5 w-5 text-violet-400" />
                <span className="font-semibold">Votre ticket {lastBooking?.isDuo ? 'Duo' : 'Solo'}</span>
                {lastBooking?.isDuo && (
                  <Badge className="bg-gradient-to-r from-[#7B1FA2] to-[#E91E63] text-white text-xs">
                    <Gift className="h-3 w-3 mr-1" />
                    2 places
                  </Badge>
                )}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Partenaire</span>
                  <span>{lastBooking?.profile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Lieu</span>
                  <span>{lastBooking?.partner}</span>
                </div>
                {lastBooking?.partnerAddress && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Adresse</span>
                    <span className="text-right text-xs max-w-[150px]">{lastBooking.partnerAddress}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-400">Montant</span>
                  <span className="text-green-400 font-semibold">{lastBooking?.amount}€</span>
                </div>
              </div>
            </div>

            {/* Calendar Buttons */}
            <div className="space-y-2">
              <p className="text-xs text-gray-500 mb-2">Ajouter à mon calendrier</p>
              <div className="flex gap-2">
                <Button 
                  onClick={addToGoogleCalendar}
                  variant="outline"
                  className="flex-1 border-violet-500/30 text-violet-300 hover:bg-violet-500/10"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Google Calendar
                </Button>
                <Button 
                  onClick={downloadIcsFile}
                  variant="outline"
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-700/30"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Fichier .ics
                </Button>
              </div>
            </div>

            {/* Share on WhatsApp */}
            <Button 
              onClick={shareTicketOnWhatsApp}
              className="w-full bg-green-600 hover:bg-green-500"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              {lastBooking?.isDuo 
                ? "Envoyer l'invitation à mon partenaire" 
                : "Envoyer le ticket à un ami"}
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => setShowTicketSuccess(false)}
              className="w-full text-gray-400"
            >
              Fermer
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
