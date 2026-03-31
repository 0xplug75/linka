# CompanionAI

Système de suivi vocal des seniors, conçu pour réduire la charge cognitive des soignants.

## Architecture

```
Rounded.com (appel vocal)
    ↓ webhook POST /api/webhook/rounded
Backend Express
    ↓ transcript
Speechmatics → OpenAI GPT (triage : Green / Orange / Red)
    ↓ résultat JSON
PostgreSQL (Prisma)
    ↓ API REST
Frontend React/Tailwind
    ├── Dashboard soignant (triage, alertes critiques)
    └── Vue famille (timeline, réassurance)
```

## Démarrage rapide

### Backend

```bash
cd backend
cp .env.example .env   # remplir DATABASE_URL et OPENAI_API_KEY
npm install
npm run db:generate
npm run db:push
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Variables d'environnement

| Variable | Description |
|---|---|
| `DATABASE_URL` | URL PostgreSQL (ex: Supabase) |
| `OPENAI_API_KEY` | Clé API OpenAI |
| `VITE_API_URL` | URL du backend (défaut: http://localhost:3001) |

## Webhook Rounded.com

Configurer l'URL de webhook dans Rounded.com :
```
POST https://votre-domaine.com/api/webhook/rounded
Body: { "call_id": "...", "transcript": "...", "senior_tel": "+33..." }
```

## Pensée Systémique & Charge Cognitive

CompanionAI applique le principe de **réduction de charge cognitive** :
- Le soignant voit en 3 secondes l'état de tous ses patients (vert/orange/rouge)
- Les alertes critiques remontent automatiquement en haut de page
- L'IA résume chaque appel en 20 mots — pas besoin d'écouter l'enregistrement
- La famille reçoit un message chaleureux sans jargon médical
