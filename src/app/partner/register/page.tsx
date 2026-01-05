"use client";
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Building, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function PartnerRegisterPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();
    const { toast } = useToast();
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '', ide: '' });
    const [error, setError] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirm) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        // SAUVEGARDE PERSISTANTE
        const currentDB = JSON.parse(localStorage.getItem('spordate_db') || '[]');
        const newPartner = {
            id: Date.now(),
            name: formData.name,
            email: formData.email,
            password: formData.password, // En vrai projet, à hasher !
            ide: formData.ide,
            status: 'pending', // IMPORTANT : Statut en attente
            date: new Date().toLocaleDateString()
        };
        
        const updatedDB = [newPartner, ...currentDB];
        localStorage.setItem('spordate_db', JSON.stringify(updatedDB));
        
        setIsSubmitted(true);
        toast({ title: "Candidature envoyée", description: "En attente de validation admin." });
    };

    if (isSubmitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-[#05090e] p-4">
                 <Card className="max-w-md w-full bg-green-900/20 border-green-800 text-center p-6">
                    <ShieldCheck className="h-16 w-16 text-green-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-green-400 mb-2">Candidature Envoyée !</h2>
                    <p className="text-gray-300 mb-6">Votre dossier est enregistré. L'administrateur doit le valider avant que vous puissiez vous connecter.</p>
                    <Button onClick={() => router.push('/')} variant="outline" className="w-full">Retour à l'accueil</Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#05090e] p-4">
            <Card className="max-w-md w-full bg-[#0a111a] border-cyan-900/50">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="text-center">
                        <Building className="h-10 w-10 text-cyan-400 mx-auto mb-2" />
                        <CardTitle className="text-xl font-bold text-white">Devenir Partenaire</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <Input placeholder="Nom du Club" required onChange={e => setFormData({...formData, name: e.target.value})} className="bg-black/50 text-white border-gray-700"/>
                        <Input placeholder="Numéro IDE" required onChange={e => setFormData({...formData, ide: e.target.value})} className="bg-black/50 text-white border-gray-700"/>
                        <Input type="email" placeholder="Email Pro" required onChange={e => setFormData({...formData, email: e.target.value})} className="bg-black/50 text-white border-gray-700"/>
                        <Input type="password" placeholder="Mot de passe" required onChange={e => setFormData({...formData, password: e.target.value})} className="bg-black/50 text-white border-gray-700"/>
                        <Input type="password" placeholder="Confirmer" required onChange={e => setFormData({...formData, confirm: e.target.value})} className="bg-black/50 text-white border-gray-700"/>
                        <Button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-black font-bold">Envoyer ma candidature</Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
