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
    { user: 'Frank', offer: 'Session Privée', date: '2024-07-26', revenue: '25 CHF' },
];

export default function PartnerDashboardPage() {
    return (
        <div className="text-gray-300">
            <header className="mb-12">
                <h1 className="text-4xl font-bold text-gray-100 flex items-center gap-3">
                    <BarChart className="h-8 w-8 text-cyan-400" />
                    Dashboard
                </h1>
                <p className="text-gray-500">Aperçu de vos performances sur Spordate.</p>
            </header>
            
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {kpis.map((kpi, index) => (
                     <Card key={index} className="bg-[#0a111a] border-cyan-900/50 shadow-md shadow-cyan-900/20">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">{kpi.title}</CardTitle>
                            {kpi.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-100">{kpi.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </section>

            <section>
                <Card className="bg-[#0a111a] border-cyan-900/50">
                    <CardHeader>
                        <CardTitle className="text-xl text-gray-200">Dernières Réservations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="border-gray-800 hover:bg-gray-900/50">
                                    <TableHead className="text-gray-400">Utilisateur</TableHead>

                                    <TableHead className="text-gray-400">Offre</TableHead>
                                    <TableHead className="text-gray-400">Date</TableHead>
                                    <TableHead className="text-right text-gray-400">Revenu</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBookings.map((booking, index) => (
                                    <TableRow key={index} className="border-gray-800 hover:bg-gray-900/50">
                                        <TableCell className="font-medium text-gray-200">{booking.user}</TableCell>
                                        <TableCell className="text-gray-400">{booking.offer}</TableCell>
                                        <TableCell className="text-gray-400">{booking.date}</TableCell>
                                        <TableCell className="text-right font-mono text-cyan-400">{booking.revenue}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}