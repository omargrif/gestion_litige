# 🤖 Gestion des Litiges - Bot Support Multimodale avec n8n

Bot d'automatisation intelligente pour la gestion des litiges clients via **Telegram**, avec support **texte**, **photos** et **audio**. Utilise un pipeline **Contexte + LLM** pour router automatiquement ou escalader les demandes.

## 🎯 Vue d'ensemble

Ce workflow n8n offre une solution **end-to-end** de support client :
- ✅ **Multimodale** : accepte texte, images et audio (transcrits en français)
- ✅ **Vision IA** : analyse les photos de litiges avec GPT-4o
- ✅ **Transcription** : convertit l'audio en texte via Whisper (Groq)
- ✅ **Contexte client** : récupère les infos client depuis Supabase
- ✅ **Décision IA** : routeur intelligent avec LLM (Llama 3.3 / Groq)
- ✅ **Actions adaptées** : réponse automatique OU escalade (Slack, Gmail)
- ✅ **Audit** : chaque interaction est loggée dans Supabase

---

## 📊 Architecture du Workflow

```
Telegram Trigger
    ↓
Normalize Input (détection type: texte/photo/audio)
    ↓
Switch Type (branchement multimodale)
    ├─→ Texte → Set Unified
    ├─→ Photo → Telegram getFile → Download → Vision OpenRouter → Parse
    └─→ Audio → Telegram getFile → Download → Transcription Groq → Parse
            ↓
        Build Context (Supabase client lookup)
            ↓
        Decision LLM (Groq - router intelligent)
            ↓
        Switch Action
        ├─→ Auto-reply: Telegram + Supabase log
        └─→ Escalate: Slack alert + Gmail + Supabase log
```

**Nœuds clés :**
- **15 HTTP Requests** : Telegram API, OpenRouter, Groq, Supabase
- **4 Code nodes** : normalisation, parsing, routage
- **2 Switch nodes** : décision type + action
- **Supabase** : gestion clients et audit
- **Intégrations sortie** : Telegram, Slack, Gmail

---

## 🛠 Prérequis & Setup

### 1️⃣ Credentials n8n

Avant d'importer le workflow, crée ces credentials dans n8n :

| Credential | Clé n8n | Où la trouver |
|-----------|---------|------|
| **Telegram Bot** | `TELEGRAM_BOT_TOKEN` | [BotFather](https://t.me/botfather) → `/newbot` |
| **Supabase** | `SUPABASE_URL`, `SUPABASE_KEY` | Dashboard Supabase → Settings → API |
| **OpenRouter API** | `OPENROUTER_API_KEY` | [openrouter.ai](https://openrouter.ai) → Keys |
| **Groq API** | `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) → API Keys |
| **Slack** (optionnel) | Slack OAuth token | [Slack App](https://api.slack.com/apps) → OAuth Tokens |
| **Gmail** (optionnel) | Gmail OAuth | n8n → Gmail credential |

### 2️⃣ Supabase Tables

Crée 2 tables dans Supabase :

Le schéma recommandé est dans `docs/supabase-schema.sql`.

**Table `clients`** (extrait) :
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY,
  telegram_chat_id BIGINT UNIQUE,
  name TEXT,
  email TEXT,
    tier TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

**Table `tickets`** (extrait) :
```sql
CREATE TABLE tickets (
  id UUID PRIMARY KEY,
  correlation_id TEXT,
  chat_id BIGINT,
  category TEXT,
    priority TEXT,
    action TEXT,
  message TEXT,
  reply TEXT,
  reasoning_summary TEXT,
  created_at TIMESTAMP DEFAULT now()
);
```

### 3️⃣ Importer le Workflow

1. Importe `n8n/workflows/workflow.json`
2. Dans n8n → **Import Workflow** → colle le JSON
3. Configure les credentials (cli-click sur chaque nœud HTTP)
4. Active le **Telegram Trigger**

Guide pas à pas: `docs/workflow-setup.md`

---

## 🚀 Utilisation

### Scénarios

**Texte (Demande simple)** :
```
Utilisateur: "Ma livraison n'est pas arrivée"
→ Bot analyse le contexte client
→ Si score de confiance > 0.8 : répond automatiquement
→ Sinon : escalade vers équipe support (Slack)
```

**Photo (Litige visuel)** :
```
Utilisateur: [photo du produit endommagé]
→ GPT-4o analyse l'image
→ Résumé des faits en 5 lignes
→ Routed via décision LLM
```

**Audio (Demande vocale)** :
```
Utilisateur: [message vocal 30s en français]
→ Groq Whisper transcrit
→ Même flux que texte
```

---

## 📋 Variables d'Environnement

Crée un fichier `.env` (non commité) avec :

```env
TELEGRAM_BOT_TOKEN=7123456789:ABCDEFGHIJKLMNOPQRST...
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxx
GROQ_API_KEY=gsk_xxxxxxxxxxxx
SLACK_BOT_TOKEN=xoxb-xxxxx (optionnel)
GMAIL_OAUTH_TOKEN=ya29.xxxxx (optionnel)
```

Voir `.env.example` pour le template.

---

## 🔧 Personalisation

### Modifier le prompt de décision

Nœud **Decision LLM** → Body → `messages[1].content` :
- Ajoute domaines spécifiques
- Ajuste `temperature` (0.1 = déterministe, 1.0 = créatif)
- Ajoute des catégories (`billing`, `delivery`, `quality`, etc.)

### Ajouter une intégration sortie (ex: Zendesk)

1. Ajoute un nœud **HTTP Request** en parallèle après "Switch Action"
2. Configure l'endpoint Zendesk
3. Map les champs `priority`, `category`, `message`

### Limiter le RAG à X derniers tickets

Nœud **Build Context** → modifie la query Supabase :
```
SELECT * FROM tickets WHERE chat_id = {{ $json.chat_id }} 
ORDER BY created_at DESC LIMIT 5
```

---

## 📊 Monitoring & Logs

Tous les tickets sont sauvegardés dans `tickets` → visualise dans Supabase Dashboard :
- Taux d'escalade
- Catégories fréquentes
- Temps de réponse IA
- Confiance moyenne des décisions

---

## 🎓 Techstack

| Composant | Service |
|-----------|---------|
| **Orchestration** | n8n (self-hosted ou cloud) |
| **LLM - Texte/Décision** | Groq (Llama 3.3-70B) |
| **Vision** | OpenRouter (GPT-4o) |
| **Transcription** | Groq Whisper (Français) |
| **DB Clients** | Supabase (PostgreSQL) |
| **Audit** | Supabase (tickets table) |
| **Frontend** | Telegram Bot API |
| **Notifications** | Slack, Gmail (optionnel) |

---

## ⚠️ Limitations & Roadmap

**Limitations actuelles** :
- ⏱ Temps réel : dépend de la latence Groq (~5-15s par requête)
- 📦 Photos : max ~20MB (limite Telegram)
- 🌐 Langue : optimisé pour français (facile adapter)

**À venir** :
- [ ] Fine-tuning du modèle sur historique de litiges
- [ ] Intégration Pinecone pour vector store (RAG avancé)
- [ ] Dashboard web pour suivi en temps réel
- [ ] Webhooks personnalisés (Zapier, Make)

---

## 📝 Licences

- **Workflow** : MIT
- **Données clients** : RGPD compliant (loggées dans Supabase)
- **APIs utilisées** : respecter TOS OpenRouter, Groq, Supabase

---

## 👤 Auteur

**Omar Grif**  
📧 [Contactez-moi]  
🔗 [GitHub](https://github.com/omargrif)

---

## 🤝 Contribution

Améliorations bienvenues ! Issues & PRs :
- Améliorations du prompt de décision
- Support de langues supplémentaires
- Intégrations additionnelles (Zendesk, Intercom, etc.)

---

## 📚 Ressources

- [n8n Docs](https://docs.n8n.io)
- [Groq API Reference](https://console.groq.com/docs)
- [OpenRouter Docs](https://openrouter.ai/docs)
- [Supabase Guide](https://supabase.com/docs)

---

**Dernier update** : 30 avril 2026  
**Statut** : ✅ Production-ready
