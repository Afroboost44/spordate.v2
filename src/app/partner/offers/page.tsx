"use client";

import { useState, FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type Offer = {
    id: number;
    name: string;
    price: string;
    location: string;
    horaire: string;
    imageUrl: string;
    active: boolean;
};

const initialOffers: Offer[] = [
    { id: 1, name: 'Session Privée', price: '25', location: 'Neon Fitness Club', horaire: 'Tous les jours, 18h00', imageUrl: '', active: true },
    { id: 2, name: 'Match 1h', price: '40', location: 'City Tennis Court', horaire: 'Weekend 10h-16h', imageUrl: '', active: true },
    { id: 3, name: 'Cours Duo', price: '30', location: 'Zen Yoga Studio', horaire: 'Mardi & Jeudi 19h00', imageUrl: '', active: false },
];

export default function PartnerOffersPage() {
    const [offers, setOffers] = useState<Offer[]>(initialOffers);
    const [open, setOpen] = useState(false);
    const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
    const { toast } = useToast();

    const handleOpenDialog = (offer: Offer | null = null) => {
        setEditingOffer(offer);
        setOpen(true);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const offerData = {
            name: formData.get('name') as string,
            price: formData.get('price') as string,
            location: formData.get('location') as string,
            horaire: formData.get('horaire') as string,
            imageUrl: formData.get('imageUrl') as string,
        };

        if (editingOffer) {
            setOffers(offers.map(o => o.id === editingOffer.id ? { ...editingOffer, ...offerData } : o));
            toast({
                title: "Offre mise à jour !",
                description: `L'activité "${offerData.name}" a été modifiée.`,
            });
        } else {
            const newOffer: Offer = {
                id: offers.length > 0 ? Math.max(...offers.map(o => o.id)) + 1 : 1,
                ...offerData,
                active: true,
            };
            setOffers(prevOffers => [...prevOffers, newOffer]);
            toast({
                title: "Offre publiée avec succès !",
                description: `Votre nouvelle activité "${newOffer.name}" est maintenant visible.`,
            });
        }
        
        setOpen(false);
        setEditingOffer(null);
    };

    const handleDelete = (offerId: number) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette offre ? L'action est irréversible.")) {
            setOffers(offers.filter(o => o.id !== offerId));
            toast({
                variant: 'destructive',
                title: "Offre supprimée",
            });
        }
    };

    return (
        <div className="p-4 sm:p-0">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                <header>
                    <h1 className="text-2xl sm:text-4xl font-bold text-gray-100">Gestion des Offres</h1>
                    <p className="text-gray-500">Ajoutez, modifiez ou supprimez vos activités.</p>
                </header>
                 <Button onClick={() => handleOpenDialog()} className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold text-base h-12 px-6 w-full sm:w-auto">
                    <PlusCircle className="mr-2" /> Créer une offre
                </Button>
            </div>
            
            <Dialog open={open} onOpenChange={(isOpen) => {
                setOpen(isOpen);
                if (!isOpen) setEditingOffer(null);
            }}>
                <DialogContent className="sm:max-w-[600px] bg-[#0a111a] border-cyan-900/50">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-cyan-400 text-2xl">{editingOffer ? "Modifier l'activité" : "Nouvelle Activité Sportive"}</DialogTitle>
                            <DialogDescription>
                            {editingOffer ? "Mettez à jour les détails de cette activité." : "Remplissez les détails de votre nouvelle activité pour la publier."}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-6">
                             <div className="grid gap-2">
                                <Label htmlFor="name" className="text-gray-400">Nom de l'offre</Label>
                                <Input id="name" name="name" defaultValue={editingOffer?.name} placeholder="Ex: Cours de Zumba" className="bg-black border-gray-700" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="price" className="text-gray-400">Prix (CHF)</Label>
                                    <Input id="price" name="price" type="number" defaultValue={editingOffer?.price} placeholder="35" className="bg-black border-gray-700" required/>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="location" className="text-gray-400">Lieu</Label>
                                    <Input id="location" name="location" defaultValue={editingOffer?.location} placeholder="Ex: Salle 3" className="bg-black border-gray-700" required/>
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="horaire" className="text-gray-400">Horaire</Label>
                                <Input id="horaire" name="horaire" defaultValue={editingOffer?.horaire} placeholder="Lundi 18h00" className="bg-black border-gray-700" required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="image-url" className="text-gray-400">Image de couverture</Label>
                                <Input id="image-url" name="imageUrl" defaultValue={editingOffer?.imageUrl} placeholder="https://example.com/image.jpg" className="bg-black border-gray-700" />
                                <p className="text-xs text-gray-500">Collez le lien de votre image ici.</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Annuler</Button>
                            </DialogClose>
                            <Button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-black font-bold">
                                {editingOffer ? "Mettre à jour l'offre" : "Publier l'offre"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Card className="bg-[#0a111a] border-cyan-900/50">
                <CardContent className="p-0 overflow-x-auto">
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
                                    <TableCell className="text-gray-300 font-mono">{offer.price} CHF</TableCell>
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
                                        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white" onClick={() => handleOpenDialog(offer)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-red-500/70 hover:text-red-500" onClick={() => handleDelete(offer.id)}>
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
