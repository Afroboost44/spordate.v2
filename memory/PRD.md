# Spordateur - Product Requirements Document

## Overview
Spordateur est une plateforme web de communauté sportive permettant aux utilisateurs de découvrir des partenaires d'entraînement et de réserver des séances dans des lieux partenaires.

## Core Features

### 1. Onboarding Flow ✅
- Inscription multi-étapes (Email/Pass -> Sports/Niveau -> Referral)
- Code de parrainage unique (format SPORT-XXXX)
- Mode Démo avec localStorage pour preview sans Firebase

### 2. Discovery Page ✅
- Swipe-style profile cards
- Match system avec réservation de séance
- Section "Où pratiquer ?" avec partenaires

### 3. Payment & Booking System ✅
- Modal de paiement mock (Carte/Twint)
- **Option Duo** (J'invite mon partenaire) - 50€ pour 2 places
- **Pré-sélection du lieu** depuis la section partenaires
- Prix dynamique Solo (25€) / Duo (50€)

### 4. Success Modal Features ✅
- Confirmation visuelle avec badge Solo/Duo
- **Ajouter à mon calendrier:**
  - Google Calendar (lien direct)
  - Fichier .ics téléchargeable
- **Message WhatsApp dynamique:**
  - Solo: invitation à rejoindre
  - Duo: message cadeau avec place offerte
- Adresse du partenaire incluse

### 5. Partner Section ✅
- Effet hover glow sur les cartes
- Clic pour sélectionner comme lieu de RDV
- Synchronisation temps réel (visibilitychange + interval)
- Modal de détail partenaire

### 6. Admin Areas ✅
- `/admin/sports` (code: AFRO2026) - Gestion des sports
- `/admin/dashboard` (email: contact.artboost@gmail.com) - Stats, Users, Partenaires, QR codes

## Technical Stack
- **Frontend:** Next.js 15 (App Router), React, TypeScript, Tailwind CSS, ShadCN UI
- **Database:** Firebase (Firestore) avec Demo Mode localStorage fallback
- **QR Codes:** qrcode.react v4.2.0

## Data Schema
- **users/{userId}**: email, sports[], level, referralCode, referredBy?
- **bookings/{bookingId}**: userId, profileId, amount, date, meetingPlaceId?, isDuo
- **stats/global**: totalRevenue, totalBookings, lastUpdated
- **partners/{partnerId}**: name, address, city, type, referralID, active

## Latest Changes (Jan 21, 2026)
- ✅ Option Duo avec toggle switch (50€ pour 2 places)
- ✅ Pré-sélection du lieu depuis section partenaires
- ✅ Boutons calendrier (Google Calendar + .ics)
- ✅ Message WhatsApp dynamique Solo/Duo
- ✅ Sync temps réel des partenaires

## Known Issues
- **Proxy Preview:** L'URL de preview peut avoir des problèmes temporaires. Le serveur local (localhost:3000) fonctionne parfaitement.
- **Images Unsplash:** Certaines images placeholder peuvent retourner 404

## Next Steps (P1)
- [ ] Intégration Firebase complète (retirer Demo Mode)
- [ ] Passerelle de paiement réelle (Stripe/Twint)
- [ ] Refactoring des composants volumineux

## Files of Reference
- `/app/src/app/discovery/page.tsx` - Page principale Discovery
- `/app/src/app/admin/dashboard/page.tsx` - Dashboard Admin
- `/app/src/lib/db.ts` - Couche données Firestore/localStorage
- `/app/src/lib/firebase.ts` - Configuration Firebase

## Credentials
- **Admin Sports:** Code `AFRO2026`
- **Admin Dashboard:** Email `contact.artboost@gmail.com`
- **Demo User:** Bouton "Connexion Démo" sur la page d'accueil
