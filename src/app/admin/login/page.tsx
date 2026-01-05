"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Shield } from 'lucide-react';

export default function AdminLoginPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            router.push('/admin/dashboard');
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-black">
            <Card className="mx-auto max-w-sm w-full bg-[#111] border-red-900/50 shadow-lg shadow-red-900/20">
                <form onSubmit={handleLogin}>
                    <CardHeader className="items-center text-center space-y-3">
                        <Shield className="h-10 w-10 text-red-500" />
                        <CardTitle className="text-2xl font-bold text-gray-200">Restricted Area</CardTitle>
                        <CardDescription className="text-gray-500">
                           Admin Access Only
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="admin-id" className="text-gray-400">ID Admin</Label>
                            <Input id="admin-id" required className="bg-black border-gray-700 text-gray-300 focus:border-red-500" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="security-code" className="text-gray-400">Code de sécurité</Label>
                            <Input id="security-code" type="password" required className="bg-black border-gray-700 text-gray-300 focus:border-red-500" />
                        </div>
                        <Button type="submit" className="w-full bg-red-800 hover:bg-red-700 text-white font-semibold" disabled={loading}>
                            {loading ? "Authenticating..." : "Entrer"}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
