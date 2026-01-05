import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Rocket, Zap } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PartnerBoostPage() {
    return (
        <div>
            <header className="mb-10">
                <h1 className="text-4xl font-bold text-gray-100 flex items-center gap-3">
                    <Rocket className="h-8 w-8 text-cyan-400" />
                    Booster ma visibilité
                </h1>
                <p className="text-gray-500">Mettez vos offres en avant auprès des utilisateurs qui matchent.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
                <Card className="bg-[#0a111a] border-cyan-900/50 shadow-lg shadow-cyan-900/20">
                    <CardHeader>
                        <CardTitle className="text-2xl text-cyan-300">Configurer votre Boost</CardTitle>
                        <CardDescription className="text-gray-500">Ciblez les bonnes personnes, au bon moment.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid gap-2">
                            <Label className="text-gray-400">Villes ciblées</Label>
                            <Select>
                                <SelectTrigger className="bg-black border-gray-700 h-12">
                                    <SelectValue placeholder="Choisir les villes" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a111a] border-cyan-900/50 text-white">
                                    <SelectItem value="lausanne">Lausanne</SelectItem>
                                    <SelectItem value="geneve">Genève</SelectItem>
                                    <SelectItem value="fribourg">Fribourg</SelectItem>
                                    <SelectItem value="partout">Toute la Suisse Romande</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label className="text-gray-400">Durée du boost</Label>
                            <Select>
                                <SelectTrigger className="bg-black border-gray-700 h-12">
                                    <SelectValue placeholder="Choisir la durée" />
                                </SelectTrigger>
                                <SelectContent className="bg-[#0a111a] border-cyan-900/50 text-white">
                                    <SelectItem value="24h">24 heures</SelectItem>
                                    <SelectItem value="3d">3 jours</SelectItem>
                                    <SelectItem value="7d">1 semaine</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <div className="border-t border-cyan-900/50 pt-6 mt-4">
                            <div className="flex justify-between items-baseline">
                                <span className="text-lg text-gray-300">Prix du boost :</span>
                                <span className="text-4xl font-bold text-cyan-400">50 CHF</span>
                            </div>
                        </div>

                        <Button className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-lg h-14 mt-4">
                            <Zap className="mr-2"/> Payer et Activer
                        </Button>
                    </CardContent>
                </Card>

                <div className="text-gray-400 space-y-6 p-4 rounded-lg bg-cyan-900/10">
                    <h3 className="text-xl font-bold text-cyan-400 border-b border-cyan-800 pb-2">Comment ça marche ?</h3>
                    <p>
                        Un "Boost" place votre activité directement dans la fenêtre "IT'S A MATCH" des utilisateurs qui correspondent aux critères de votre offre.
                    </p>
                    <p>
                        C'est le meilleur moyen de transformer un match en réservation ferme, en présentant votre lieu comme la solution idéale pour leur premier rendez-vous sportif.
                    </p>
                    <ul className="list-disc list-inside space-y-2 pl-2 text-gray-500">
                       <li>Augmente la visibilité jusqu'à <span className="font-bold text-cyan-500">10x</span>.</li>
                       <li>Ciblage précis par ville.</li>
                       <li>Apparaît comme une offre "recommandée".</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
