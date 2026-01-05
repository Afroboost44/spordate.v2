"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CalendarCheck, Wallet, BarChart } from 'lucide-react';

const kpis = [
    { title: 'Vues des offres', value: '1,240', icon: <Eye className="h-6 w-6 text-cyan-300" /> },
    { title: 'Réservations confirmées', value: '15', icon: <CalendarCheck className="h-6 w-6 text-green-400" /> },
    { title: 'Revenus générés', value: '375 CHF', icon: <Wallet className="h-6 w-6 text-yellow-400" /> },
];

const recentBookings = [
    { user: 'Alice', offer: 'Session Privée', date: '2024-07-28', revenue: '25 CHF' },
    { user: 'Charlie', offer: 'Match 1h', date: '2024-07-27', revenue: '40 CHF' },
    { user: 'David', offer: 'Cours Duo', date: '2024-07-27', revenue: '30 CHF' },
];

export default function PartnerDashboardPage() {
    return (
        <div className="text-gray-300 p-8 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <BarChart className="h-8 w-8 text-cyan-400" />
                    Tableau de Bord Partenaire
                </h1>
                <p className="text-gray-400">Suivez vos performances en temps réel.</p>
            </header>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kpis.map((kpi, index) => (
                     <Card key={index} className="bg-[#111] border-cyan-900 shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                            {kpi.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="bg-[#111] border-cyan-900 mt-8">
                <CardHeader>
                    <CardTitle className="text-white">Dernières Réservations</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="border-gray-800">
                                <TableHead className="text-gray-400">Client</TableHead>
                                <TableHead className="text-gray-400">Activité</TableHead>
                                <TableHead className="text-gray-400">Date</TableHead>
                                <TableHead className="text-right text-gray-400">Montant</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentBookings.map((booking, index) => (
                                <TableRow key={index} className="border-gray-800">
                                    <TableCell className="font-medium text-white">{booking.user}</TableCell>
                                    <TableCell className="text-gray-400">{booking.offer}</TableCell>
                                    <TableCell className="text-gray-400">{booking.date}</TableCell>
                                    <TableCell className="text-right text-cyan-400">{booking.revenue}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}