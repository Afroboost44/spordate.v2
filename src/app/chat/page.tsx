import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function ChatPage() {
    return (
        <div className="flex h-[calc(100vh-8rem)] bg-card-dark">
            <div className="container mx-auto p-4 flex flex-col h-full">
                <Card className="flex-1 flex flex-col bg-card border-border/20 shadow-lg shadow-accent/10">
                    <CardHeader className="flex flex-row items-center gap-4 p-4 border-b border-border/20">
                        <Avatar>
                            <AvatarImage src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBjcm9zc2ZpdHxlbnwwfHx8fDE3NjgyNTIyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Marc" />
                            <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-lg font-bold">Marc</CardTitle>
                            <p className="text-sm text-green-400">En ligne</p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
                        {/* Chat messages will go here */}
                         <div className="flex items-end gap-2 justify-start">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxtYW4lMjBjcm9zc2ZpdHxlbnwwfHx8fDE3NjgyNTIyNjZ8MA&ixlib=rb-4.1.0&q=80&w=1080" alt="Marc" />
                                <AvatarFallback>M</AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-lg p-3 max-w-xs">
                                <p className="text-sm">Hey ! Super, on a matché. Prêt pour la session de Crossfit ?</p>
                            </div>
                        </div>
                         <div className="flex items-end gap-2 justify-end">
                            <div className="bg-primary rounded-lg p-3 max-w-xs">
                                <p className="text-sm text-primary-foreground">Salut Marc ! Carrément prêt. Ça va être intense !</p>
                            </div>
                             <Avatar className="h-8 w-8">
                                <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="You" />
                                <AvatarFallback>Y</AvatarFallback>
                            </Avatar>
                        </div>
                    </CardContent>
                    <div className="p-4 border-t border-border/20">
                        <div className="relative">
                            <Input placeholder="Écrire un message..." className="pr-12" />
                            <Button size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-primary hover:bg-primary/80">
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
