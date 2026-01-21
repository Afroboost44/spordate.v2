"use client";

import { AlertTriangle, Settings, Key, Database, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ConfigErrorScreenProps {
  missingKeys: string[];
}

export function ConfigErrorScreen({ missingKeys }: ConfigErrorScreenProps) {
  const getKeyIcon = (key: string) => {
    if (key.includes('FIREBASE')) return <Database className="h-4 w-4" />;
    if (key.includes('STRIPE')) return <CreditCard className="h-4 w-4" />;
    return <Key className="h-4 w-4" />;
  };

  const getKeyDescription = (key: string): string => {
    const descriptions: Record<string, string> = {
      'NEXT_PUBLIC_FIREBASE_API_KEY': 'Clé API Firebase pour l\'authentification',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID': 'ID du projet Firebase',
      'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': 'Domaine d\'authentification Firebase',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': 'Clé publique Stripe pour les paiements',
      'STRIPE_SECRET_KEY': 'Clé secrète Stripe (côté serveur)',
    };
    return descriptions[key] || 'Variable d\'environnement requise';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-lg w-full bg-[#0a0a0a] border-red-500/30 text-white">
        <CardHeader className="text-center pb-2">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-red-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-400">
            Configuration Requise
          </CardTitle>
          <p className="text-gray-400 mt-2">
            L'application nécessite une configuration pour fonctionner en mode production.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Missing Keys */}
          <div>
            <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Variables manquantes
            </h3>
            <div className="space-y-2">
              {missingKeys.map((key) => (
                <div
                  key={key}
                  className="flex items-start gap-3 p-3 bg-red-500/10 rounded-lg border border-red-500/20"
                >
                  <div className="mt-0.5 text-red-400">
                    {getKeyIcon(key)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <code className="text-xs text-red-300 bg-red-500/20 px-2 py-0.5 rounded">
                      {key}
                    </code>
                    <p className="text-xs text-gray-500 mt-1">
                      {getKeyDescription(key)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Key className="h-4 w-4 text-violet-400" />
              Comment configurer ?
            </h4>
            <ol className="text-xs text-gray-400 space-y-2 list-decimal list-inside">
              <li>
                Créez un fichier <code className="text-violet-300">.env.local</code> à la racine du projet
              </li>
              <li>
                Ajoutez les variables manquantes avec leurs valeurs
              </li>
              <li>
                Redémarrez le serveur de développement
              </li>
            </ol>
          </div>

          {/* Example */}
          <div className="bg-[#1a1a1a] rounded-lg p-4 border border-white/10">
            <p className="text-xs text-gray-500 mb-2">Exemple .env.local :</p>
            <pre className="text-xs text-green-400 font-mono overflow-x-auto">
{`# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...`}
            </pre>
          </div>

          {/* Status */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <Badge variant="outline" className="border-red-500/50 text-red-400">
              Mode Production Requis
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
