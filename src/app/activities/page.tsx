import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const activities = [
  {
    title: 'Neon Fitness Club',
    description: 'Session Privée',
    price: '25 CHF',
    imageId: 'activity-gym',
  },
  {
    title: 'City Tennis Court',
    description: 'Match 1h',
    price: '40 CHF',
    imageId: 'activity-tennis',
  },
  {
    title: 'Zen Yoga Studio',
    description: 'Cours Duo',
    price: '30 CHF',
    imageId: 'activity-yoga',
  },
];

export default function ActivitiesPage() {
  const activityImages = PlaceHolderImages.filter(p => p.id.startsWith('activity-'));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline">
          Choisissez votre terrain de jeu
        </h1>
        <p className="mt-4 text-gray-400 md:text-xl">
          Réservez une séance avec votre match dans l'un de nos lieux partenaires.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activities.map((activity, index) => {
          const activityImage = activityImages.find(img => img.id === activity.imageId);
          return (
            <Card key={index} className="overflow-hidden bg-card border-border/20 shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="relative h-56 w-full">
                {activityImage && (
                  <Image
                    src={activityImage.imageUrl}
                    alt={activity.title}
                    fill
                    className="object-cover"
                    data-ai-hint={activityImage.imageHint}
                  />
                )}
                <div className="absolute inset-0 bg-black/40" />
              </div>
              <CardContent className="p-6">
                <h3 className="text-2xl font-bold mb-2">{activity.title}</h3>
                <p className="text-foreground/70 mb-4">{activity.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">{activity.price}</p>
                  <Button className="font-semibold bg-primary hover:bg-primary/90">Réserver & Payer</Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
