import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPlus, Calendar, Handshake } from 'lucide-react';

export function ConceptSection() {
  const concepts = [
    {
      icon: <UserPlus className="h-10 w-10 mb-4 text-accent" />,
      title: 'Match',
      description: 'Create your profile and discover people with similar sports interests and skill levels in your area.',
    },
    {
      icon: <Calendar className="h-10 w-10 mb-4 text-accent" />,
      title: 'Book',
      description: 'Chat with your matches and easily book a time and place for your favorite sports activity.',
    },
    {
      icon: <Handshake className="h-10 w-10 mb-4 text-accent" />,
      title: 'Meet',
      description: 'Meet up with your new sports partner and enjoy your activity together. It\'s that simple!',
    },
  ];

  return (
    <section id="how-it-works" className="w-full py-20 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">How It Works</h2>
          <p className="mt-4 text-gray-400 md:text-xl">
            A simple three-step process to find your next sports partner.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {concepts.map((concept, index) => (
            <Card
              key={index}
              className="bg-card border-border/20 shadow-lg shadow-accent/10 hover:shadow-accent/20 transition-shadow duration-300 transform hover:-translate-y-2"
            >
              <CardHeader className="items-center text-center">
                {concept.icon}
                <CardTitle className="text-2xl font-bold">{concept.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-gray-400">
                <p>{concept.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
