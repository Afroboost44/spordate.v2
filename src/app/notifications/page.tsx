
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Heart, CheckCircle, Clock, DollarSign } from 'lucide-react';

const notifications = [
  {
    icon: <DollarSign className="h-6 w-6 text-green-400" />,
    title: "Paiement reçu !",
    text: "Vous avez reçu 25.00 CHF pour l'activité 'Session Privée'.",
    time: 'Il y a 2 min',
  },
  {
    icon: <Heart className="h-6 w-6 text-rose-500 fill-rose-500" />,
    title: "Nouveau Match !",
    text: 'Marc a liké votre profil. Réservez une activité pour discuter.',
    time: 'Il y a 15 min',
  },
  {
    icon: <CheckCircle className="h-6 w-6 text-cyan-400" />,
    title: "Offre Validée",
    text: "Votre activité 'Afroboost' a été approuvée par l'admin.",
    time: 'Il y a 1h',
  },
  {
    icon: <Clock className="h-6 w-6 text-gray-500" />,
    title: "Rappel",
    text: 'Votre séance de Tennis commence demain à 18h.',
    time: 'Hier',
  },
];


export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3 font-headline">
          Activité Récente
          <Bell className="h-8 w-8 text-accent animate-pulse"/>
        </h1>
        <Button variant="outline">Tout marquer comme lu</Button>
      </header>

      <div className="space-y-4">
        {notifications.map((notification, index) => (
          <Card key={index} className="bg-card border-border/20 shadow-lg shadow-accent/5 hover:bg-card/80 transition-colors">
            <CardContent className="p-4 flex items-start gap-4">
              <div className="mt-1">{notification.icon}</div>
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
