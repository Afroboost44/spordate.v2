"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Banknote, CheckCircle, Clock } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const transfers = [
    { date: '25/07/2024', amount: '150.00 CHF', status: 'Terminé' },
    { date: '18/07/2024', amount: '225.00 CHF', status: 'Terminé' },
    { date: '11/07/2024', amount: '95.50 CHF', status: 'Terminé' },
];

export default function PartnerWalletPage() {
    const [isConnected, setIsConnected] = useState(false);

    return (
        <div className="text-gray-300 p-8 space-y-8 max-w-4xl mx-auto">
             <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-100 flex items-center gap-3">
                    <Wallet className="h-8 w-8 text-cyan-400" />
                    Mon Portefeuille
                </h1>
                <p className="text-gray-500">Gérez vos revenus et votre compte bancaire.</p>
            </header>

            <Card className="bg-[#0a111a] border-cyan-900/50 shadow-lg shadow-cyan-900/20">
                <CardHeader>
                    <CardTitle className="text-lg text-cyan-400">Solde disponible</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-5xl font-bold text-white">375.00 CHF</p>
                    <p className="text-gray-500 mt-2">Prochain virement automatique le 01/08/2024.</p>
                </CardContent>
            </Card>

            <Card className="bg-[#0a111a] border-cyan-900/50">
                <CardHeader>
                    <CardTitle className="text-xl text-gray-200">Compte Bancaire</CardTitle>
                    <CardDescription>Connectez votre compte pour recevoir vos paiements.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isConnected ? (
                        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-6 flex items-center gap-4">
                            <CheckCircle className="h-10 w-10 text-green-400" />
                            <div>
                                <h3 className="font-bold text-lg text-green-300">Compte relié avec succès</h3>
                                <p className="text-gray-400 font-mono">CH93 **** **** **** **** 45 (UBS)</p>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-6 flex flex-col items-center text-center">
                             <p className="mb-4 text-gray-400">Vous devez connecter un compte pour recevoir les fonds de vos réservations.</p>
                            <Button onClick={() => setIsConnected(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-base h-12 px-8">
                                <Banknote className="mr-2" /> Connecter mon compte (via Stripe)
                            </Button>
                             <p className="text-xs text-gray-600 mt-3">Vous serez redirigé vers Stripe pour une connexion sécurisée.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card className="bg-[#0a111a] border-cyan-900/50">
                <CardHeader>
                    <CardTitle className="text-xl text-gray-200">Historique des virements</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800">
                                <TableHead className="text-gray-400">Date</TableHead>
                                <TableHead className="text-gray-400">Montant</TableHead>
                                <TableHead className="text-right text-gray-400">Statut</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {transfers.map((transfer, index) => (
                                <TableRow key={index} className="border-gray-800">
                                    <TableCell className="text-gray-400">{transfer.date}</TableCell>
                                    <TableCell className="font-medium text-white">{transfer.amount}</TableCell>
                                    <TableCell className="text-right">
                                        <span className="flex items-center justify-end gap-2 text-green-400">
                                            <CheckCircle size={16}/> {transfer.status}
                                        </span>
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
