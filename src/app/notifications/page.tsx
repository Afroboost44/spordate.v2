'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Heart, CheckCircle, Clock, DollarSign, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';


// --- SIMULATION AUTHENTIFICATION & MIDDLEWARE ---
const useAuthGuard = () => {
    const router = useRouter();
    const [isAuthLoading, setIsAuthLoading] = useState(true);
    const isLoggedIn = true; // Remplacez par votre logique d'authentification réelle
  
    useEffect(() => {
      // Si l'utilisateur n'est pas connecté, on le redirige.
      if (!isLoggedIn) {
        router.replace('/login');
      } else {
        setIsAuthLoading(false);
      }
    }, [isLoggedIn, router]);

    return { isLoading: isAuthLoading, isLoggedIn };
};


const initialNotifications = [
  {
    id: 1,
    icon: <DollarSign className="h-6 w-6 text-green-400" />,
    title: "Paiement reçu !",
    text: "Vous avez reçu 25.00 CHF pour l'activité 'Session Privée'.",
    time: 'Il y a 2 min',
    isRead: false,
    path: '/partner/wallet', // Route réservée aux partenaires
    requiredRole: 'partner',
  },
  {
    id: 2,
    icon: <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />,
    title: "Nouveau Match !",
    text: 'Marc a liké votre profil. Réservez une activité pour discuter.',
    time: 'Il y a 15 min',
    isRead: false,
    path: '/discovery',
    requiredRole: 'user',
  },
  {
    id: 3,
    icon: <CheckCircle className="h-6 w-6 text-cyan-400" />,
    title: "Offre Validée",
    text: "Votre activité 'Afroboost' a été approuvée par l'admin.",
    time: 'Il y a 1h',
    isRead: false,
    path: '/partner/offers', // Route réservée aux partenaires
    requiredRole: 'partner',
  },
  {
    id: 4,
    icon: <Clock className="h-6 w-6 text-gray-500" />,
    title: "Rappel",
    text: 'Votre séance de Tennis commence demain à 18h.',
    time: 'Hier',
    isRead: false,
    path: '/profile',
    requiredRole: 'user',
  },
];

export default function NotificationsPage() {
    const { isLoading, isLoggedIn } = useAuthGuard();
    const router = useRouter();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState(initialNotifications);

    // --- SIMULATION DU ROLE & ISOLATION DES DONNEES ---
    // Dans une vraie app, le rôle viendrait du token JWT ou de la session.
    const currentUserRole = 'user'; // ou 'partner'
    
    // Simule la récupération de données filtrées par l'API (WHERE user_id = ...)
    // En ne montrant que les notifications qui correspondent au rôle de l'utilisateur.
    const userNotifications = notifications.filter(n => n.requiredRole === currentUserRole);

    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => userNotifications.find(un => un.id === n.id) ? { ...n, isRead: true } : n));
        toast({
            title: "Notifications lues",
            description: "Toutes les notifications ont été marquées comme lues.",
        });
    };
    
    const handleNotificationClick = (path: string, id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        router.push(path);
    };

    if (isLoading) {
      return (
          <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
      );
    }

    if (!isLoggedIn) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold flex items-center gap-3 font-headline">
          Activité Récente
          {unreadCount > 0 && (
            <div className="relative">
                <Bell className="h-8 w-8 text-accent"/>
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-rose-500 text-xs text-white font-bold">
                    {unreadCount}
                </span>
            </div>
          )}
        </h1>
        <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Tout marquer comme lu
        </Button>
      </header>

      <div className="space-y-4">
        {userNotifications.map((notification) => (
          <Card 
            key={notification.id} 
            className={cn(
                "bg-card border-border/20 shadow-lg shadow-accent/5 transition-all duration-300 cursor-pointer hover:bg-card/80 hover:border-accent/30",
                notification.isRead && "opacity-60 hover:opacity-100"
            )}
            onClick={() => handleNotificationClick(notification.path, notification.id)}
          >
            <CardContent className="p-4 flex items-start gap-4">
              <div className="relative mt-1">
                {notification.icon}
                {!notification.isRead && (
                    <span className="absolute -top-1 -left-1 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                    </span>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{notification.title}</h3>
                <p className="text-foreground/70">{notification.text}</p>
              </div>
              <p className="text-xs text-muted-foreground whitespace-nowrap">{notification.time}</p>
            </CardContent>
          </Card>
        ))}
      </div>

       {userNotifications.length === 0 && (
          <div className="text-center py-16 text-muted-foreground border-2 border-dashed border-border/20 rounded-lg">
              <Bell className="mx-auto h-12 w-12 mb-4"/>
              <h3 className="text-xl font-semibold">Aucune notification pour le moment.</h3>
              <p>Les nouvelles activités apparaîtront ici.</p>
          </div>
       )}
    </div>
  );
}
