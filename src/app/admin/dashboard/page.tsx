import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DollarSign, Users, Heart, BarChart } from 'lucide-react';

const kpis = [
    { title: 'Revenus Totaux', value: '1,250 CHF', icon: <DollarSign className="h-6 w-6 text-green-400" /> },
    { title: 'Utilisateurs Actifs', value: '42', icon: <Users className="h-6 w-6 text-blue-400" /> },
    { title: 'Matchs ce mois', value: '18', icon: <Heart className="h-6 w-6 text-rose-400" /> },
];

const recentUsers = [
    { name: 'Alice', city: 'Lausanne', sport: 'Yoga' },
    { name: 'Bob', city: 'Genève', sport: 'Tennis' },
    { name: 'Charlie', city: 'Fribourg', sport: 'Running' },
    { name: 'Diana', city: 'Sion', sport: 'Fitness' },
];

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 p-8">
            <div className="container mx-auto">
                <header className="mb-12">
                    <h1 className="text-4xl font-bold text-gray-100 flex items-center gap-3">
                        <BarChart className="h-8 w-8 text-blue-500" />
                        Admin Dashboard
                    </h1>
                    <p className="text-gray-500">Welcome to the control panel.</p>
                </header>
                
                <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {kpis.map((kpi, index) => (
                         <Card key={index} className="bg-[#111] border-gray-800 shadow-md shadow-blue-900/20">
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
                    <Card className="bg-[#111] border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-200">Derniers Inscrits</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-gray-800 hover:bg-gray-900/50">
                                        <TableHead className="text-gray-400">Nom</TableHead>
                                        <TableHead className="text-gray-400">Ville</TableHead>
                                        <TableHead className="text-gray-400">Sport Principal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentUsers.map((user, index) => (
                                        <TableRow key={index} className="border-gray-800 hover:bg-gray-900/50">
                                            <TableCell className="font-medium text-gray-200">{user.name}</TableCell>
                                            <TableCell className="text-gray-400">{user.city}</TableCell>
                                            <TableCell className="text-gray-400">{user.sport}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    );
}
