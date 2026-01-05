"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '@/components/ui/textarea';

const initialOffers = [
    { id: 1, name: 'Session Privée', price: '25 CHF', location: 'Neon Fitness Club', active: true },
    { id: 2, name: 'Match 1h', price: '40 CHF', location: 'City Tennis Court', active: true },
    { id: 3, name: 'Cours Duo', price: '30 CHF', location: 'Zen Yoga Studio', active: false },
];

export default function PartnerOffersPage() {
    const [offers, setOffers] = useState(initialOffers);
    const [open, setOpen] = useState(false);

    const handleCreateOffer = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // In a real app, this would handle form submission
        setOpen(false);
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-10">
                <header>
                    <h1 className="text-4xl font-bold text-gray-100">Gestion des Offres</h1>
                    <p className="text-gray-500">Ajoutez, modifiez ou supprimez vos activités.</p>
                </header>
                 <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-base h-12 px-6">
                            <PlusCircle className="mr-2" /> Créer une offre
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-[#0a111a] border-cyan-900/50">
                        <form onSubmit={handleCreateOffer}>
                            <DialogHeader>
                                <DialogTitle className="text-cyan-400 text-2xl">Nouvelle Offre</DialogTitle>
                                <DialogDescription>
                                Remplissez les détails de votre nouvelle activité.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-gray-400">Nom de l'offre</Label>
                                    <Input id="name" placeholder="Ex: Cours de Boxe" className="bg-black border-gray-700" />
                                </div>
                                 <div className="grid grid-cols-2 gap-4">
                                     <div className="grid gap-2">
                                        <Label htmlFor="price" className="text-gray-400">Prix (CHF)</Label>
                                        <Input id="price" type="number" placeholder="35" className="bg-black border-gray-700" />
                                    </div>
                                     <div className="grid gap-2">
                                        <Label htmlFor="location" className="text-gray-400">Lieu</Label>
                                        <Input id="location" placeholder="Votre club" className="bg-black border-gray-700" />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-gray-400">Description courte</Label>
                                    <Textarea id="description" placeholder="Une brève description de l'activité." className="bg-black border-gray-700" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="image-url" className="text-gray-400">Lien de votre image</Label>
                                    <Input id="image-url" placeholder="https://example.com/image.jpg" className="bg-black border-gray-700" />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="secondary">Annuler</Button>
                                </DialogClose>
                                <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold">Créer l'offre</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-[#0a111a] border-cyan-900/50">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800 hover:bg-gray-900/50">
                                <TableHead className="text-cyan-400">Nom de l'offre</TableHead>
                                <TableHead className="text-cyan-400">Lieu</TableHead>
                                <TableHead className="text-cyan-400">Prix</TableHead>
                                <TableHead className="text-cyan-400">Statut</TableHead>
                                <TableHead className="text-right text-cyan-400">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {offers.map((offer) => (
                                <TableRow key={offer.id} className="border-gray-800 hover:bg-gray-900/50">
                                    <TableCell className="font-medium text-gray-200">{offer.name}</TableCell>
                                    <TableCell className="text-gray-400">{offer.location}</TableCell>
                                    <TableCell className="text-gray-300 font-mono">{offer.price}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                            offer.active 
                                            ? 'bg-green-500/20 text-green-400' 
                                            : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                            {offer.active ? 'Actif' : 'Inactif'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500/70 hover:text-red-500">
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
