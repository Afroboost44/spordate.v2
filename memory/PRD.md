# Spordateur - Product Requirements Document

## Overview
Spordateur est une plateforme web de communauté sportive permettant aux utilisateurs de découvrir des partenaires d'entraînement et de réserver des séances dans des lieux partenaires.

## Core Features

### 1. Onboarding Flow ✅
- Inscription multi-étapes (Email/Pass -> Sports/Niveau -> Referral)
- Code de parrainage unique (format SPORT-XXXX)
- **Écran "Configuration Requise"** si Firebase non configuré

### 2. Discovery Page ✅
- Swipe-style profile cards
- Match system avec réservation de séance
- Section "Où pratiquer ?" avec partenaires

### 3. Payment & Booking System ✅
- **Intégration Stripe Checkout** complète
  - `POST /api/checkout` - Crée une session de paiement
  - `GET /api/checkout/status/[sessionId]` - Vérifie le statut
  - `POST /api/webhooks/stripe` - Webhook pour confirmation serveur
- **Option Duo** (J'invite mon partenaire) - 50€ pour 2 places
- **Pré-sélection du lieu** depuis la section partenaires
- Prix fixes côté serveur (Solo: 25€, Duo: 50€) - sécurisé
- **Loader anti-double clic** sur le bouton Payer

### 4. Email Notifications ✅
- **Service Resend** (`/lib/email.ts`) avec templates HTML professionnels
- **Email confirmation client** : "Ton ticket pour [LIEU] est prêt !" 
- **Email notification partenaire** : "Nouveau RDV sportif confirmé !"
- Templates responsive avec design violet/rose cohérent
- Fallback console.log si Resend non configuré

### 5. Success Modal Features ✅
- Confirmation visuelle avec badge Solo/Duo
- **Ajouter à mon calendrier:**
  - Google Calendar (lien direct)
  - Fichier .ics téléchargeable
- **Message WhatsApp dynamique:**
  - Solo: invitation à rejoindre
  - Duo: message cadeau avec place offerte
- Adresse du partenaire incluse

### 6. Partner Section ✅
- Effet hover glow sur les cartes
- Clic pour sélectionner comme lieu de RDV
- Synchronisation temps réel (visibilitychange + interval)

### 7. Admin Areas ✅
- `/admin/sports` (code: AFRO2026) - Gestion des sports
- `/admin/dashboard` (email: contact.artboost@gmail.com) - Stats, Users, Partenaires, QR codes

## Technical Stack
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
- **Database:** Firebase (Firestore) - Configuration requise
- **Payments:** Stripe Checkout API avec Webhook
- **Emails:** Resend API
- **QR Codes:** qrcode.react v4.2.0

## Environment Variables Required

### Firebase (Required)
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Stripe (Required)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... ou pk_live_...
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Email - Resend (Optional)
```
RESEND_API_KEY=re_...
SENDER_EMAIL=Spordateur <noreply@votredomaine.com>
```

## API Routes
- `POST /api/checkout` - Crée une session Stripe Checkout
- `GET /api/checkout/status/[sessionId]` - Vérifie le statut du paiement
- `POST /api/webhooks/stripe` - Reçoit les événements Stripe (checkout.session.completed)

## Webhook Events Handled
- `checkout.session.completed` - Confirme le paiement, envoie emails
- `checkout.session.expired` - Log l'expiration de session
- `payment_intent.payment_failed` - Log les échecs de paiement

## Security
- Montants de paiement définis côté serveur uniquement (anti-fraude)
- Vérification de signature webhook Stripe
- Clés Stripe secrètes dans variables d'environnement serveur
- Validation stricte des clés Firebase (format AIzaSy...)
- Bouton Payer désactivé pendant le traitement (anti-double clic)

## Latest Changes (Jan 21, 2026)
- ✅ Webhook Stripe `/api/webhooks/stripe` avec gestion checkout.session.completed
- ✅ Service email Resend avec templates HTML professionnels
- ✅ Loader et état disabled sur bouton Payer
- ✅ UI simplifiée (retrait sélecteur Carte/Twint - Stripe gère tout)
- ✅ Metadata complètes envoyées à Stripe (partenaire, adresse)

## Files of Reference
- `/app/src/app/discovery/page.tsx` - Page Discovery avec Stripe
- `/app/src/app/api/checkout/route.ts` - API Stripe Checkout
- `/app/src/app/api/webhooks/stripe/route.ts` - Webhook Stripe
- `/app/src/lib/email.ts` - Service email Resend avec templates
- `/app/src/lib/firebase.ts` - Configuration Firebase
- `/app/src/components/ConfigErrorScreen.tsx` - Écran erreur config

## Next Steps (P1)
- [ ] Configurer clés Firebase réelles
- [ ] Configurer clés Stripe de production
- [ ] Configurer Resend avec domaine vérifié
- [ ] Déployer webhook URL dans Stripe Dashboard

## Credentials (Dev)
- **Admin Sports:** Code `AFRO2026`
- **Admin Dashboard:** Email `contact.artboost@gmail.com`
