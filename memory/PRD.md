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
- **Intégration Stripe Checkout** (remplace la simulation)
  - API Route: `/api/checkout` - Crée une session de paiement
  - API Route: `/api/checkout/status/[sessionId]` - Vérifie le statut
- **Option Duo** (J'invite mon partenaire) - 50€ pour 2 places
- **Pré-sélection du lieu** depuis la section partenaires
- Prix fixes côté serveur (Solo: 25€, Duo: 50€) - sécurisé
- Polling du statut de paiement après retour Stripe

### 4. Success Modal Features ✅
- Confirmation visuelle avec badge Solo/Duo
- **Ajouter à mon calendrier:**
  - Google Calendar (lien direct)
  - Fichier .ics téléchargeable
- **Message WhatsApp dynamique:**
  - Solo: invitation à rejoindre
  - Duo: message cadeau avec place offerte
- Adresse du partenaire incluse

### 5. Notifications ✅
- Service de notifications (`/lib/notifications.ts`)
- Log console pour les réservations (à remplacer par email en prod)
- Notification partenaire avec détails de réservation

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
- **Payments:** Stripe Checkout API
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
```

## Data Schema
- **users/{userId}**: email, sports[], level, referralCode, referredBy?
- **bookings/{bookingId}**: userId, profileId, amount, date, meetingPlaceId?, isDuo
- **stats/global**: totalRevenue, totalBookings, lastUpdated
- **partners/{partnerId}**: name, address, city, type, referralID, active

## Latest Changes (Jan 21, 2026)
- ✅ Transition Mode Démo → Production
- ✅ Écran "Configuration Requise" si clés manquantes
- ✅ Intégration Stripe Checkout (API routes)
- ✅ Service de notifications partenaires
- ✅ Retrait du bandeau "Mode Démo" et bouton démo
- ✅ Validation des clés Firebase et Stripe

## API Routes
- `POST /api/checkout` - Crée une session Stripe Checkout
- `GET /api/checkout/status/[sessionId]` - Vérifie le statut du paiement

## Security
- Montants de paiement définis côté serveur uniquement (anti-fraude)
- Clés Stripe secrètes dans variables d'environnement serveur
- Validation stricte des clés Firebase (format AIzaSy...)

## Files of Reference
- `/app/src/app/discovery/page.tsx` - Page Discovery avec Stripe
- `/app/src/app/api/checkout/route.ts` - API Stripe Checkout
- `/app/src/lib/firebase.ts` - Configuration Firebase avec validation
- `/app/src/lib/notifications.ts` - Service de notifications
- `/app/src/components/ConfigErrorScreen.tsx` - Écran d'erreur config

## Next Steps (P1)
- [ ] Ajouter clés Firebase réelles
- [ ] Ajouter clés Stripe de production
- [ ] Remplacer notifications console par email (SendGrid/Resend)
- [ ] Webhook Stripe pour confirmation serveur

## Credentials (Dev)
- **Admin Sports:** Code `AFRO2026`
- **Admin Dashboard:** Email `contact.artboost@gmail.com`
