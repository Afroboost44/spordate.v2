'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Heart, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const initialNotifications = [
  {
    id: 1,
    icon: <DollarSign className="h-6 w-6 text-green-400" />,
    title: "Paiement reçu !",
    text: "Vous avez reçu 25.00 CHF pour l'activité 'Session Privée'.",
    time: 'Il y a 2 min',
    isRead: false,
    path: '/partner/wallet',
  },
  {
    id: 2,
    icon: <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />,
    title: "Nouveau Match !",
    text: 'Marc a liké votre profil. Réservez une activité pour discuter.',
    time: 'Il y a 15 min',
    isRead: false,
    path: '/discovery',
  },
  {
    id: 3,
    icon: <CheckCircle className="h-6 w-6 text-cyan-400" />,
    title: "Offre Validée",
    text: "Votre activité 'Afroboost' a été approuvée par l'admin.",
    time: 'Il y a 1h',
    isRead: false,
    path: '/partner/offers',
  },
  {
    id: 4,
    icon: <Clock className="h-6 w-6 text-gray-500" />,
    title: "Rappel",
    text: 'Votre séance de Tennis commence demain à 18h.',
    time: 'Hier',
    isRead: false,
    path: '/profile',
  },
];


export default function NotificationsPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [notifications, setNotifications] = useState(initialNotifications);
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleMarkAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        toast({
            title: "Notifications lues",
            description: "Toutes les notifications ont été marquées comme lues.",
        });
    };
    
    const handleNotificationClick = (path: string, id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        router.push(path);
    };

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
        {notifications.map((notification) => (
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
    </div>
  );
}
