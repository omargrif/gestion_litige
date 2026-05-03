# Guide d’implémentation (nœud par nœud)

Ce document décrit la configuration **prête à copier** du workflow n8n (multimodal, stable, sans clés en dur).

## Credentials / variables

Le workflow est conçu pour fonctionner avec des variables d’environnement (ou des credentials n8n équivalents) :

- `TELEGRAM_BOT_TOKEN`
- `SUPABASE_URL`, `SUPABASE_KEY` (si tu utilises le node Supabase via env/credentials)
- `OPENROUTER_API_KEY` (Vision)
- `GROQ_API_KEY` (LLM + transcription)
- `SLACK_BOT_TOKEN` (optionnel)
- `GMAIL_OAUTH_TOKEN` (optionnel)

Template: .env.example

## Workflow

### 1) Telegram Trigger
- Node: `Telegram Trigger`
- Updates: `message`

### 2) Normalize Input (Code)
- Node: `Code`
- Nom: `Normalize Input`
- Objectif: détecter `text|photo|audio` et normaliser en un format commun.

### 3) Switch Type (Rules)
- Node: `Switch`
- Rules: `message_type == text | photo | audio`

---

## Branche TEXTE

### 4T) Unified Text (Set)
- Champs:
  - `content`: `{{ $json.text_input }}`
  - `source_modality`: `text`

---

## Branche PHOTO

### 4P) Telegram getFile (photo)
- HTTP GET
- URL: `https://api.telegram.org/bot{{$env.TELEGRAM_BOT_TOKEN}}/getFile`
- Query: `file_id={{ $json.photo_file_id }}`

### 5P) Download Photo Binary
- HTTP GET
- URL: `https://api.telegram.org/file/bot{{$env.TELEGRAM_BOT_TOKEN}}/{{ $json.result.file_path }}`
- Response: `File` (binary `data`)

### 6P) Vision (OpenRouter)
- HTTP POST
- URL: `https://openrouter.ai/api/v1/chat/completions`
- Headers:
  - `Authorization: Bearer {{$env.OPENROUTER_API_KEY}}`
  - `Content-Type: application/json`
- Body: modèle vision (ex: `openai/gpt-4o-mini`) + `image_url` en base64

### 7P) Parse Vision Output (Code)
- Extrait `choices[0].message.content` → `content`

---

## Branche AUDIO

### 4A) Telegram getFile (audio)
- HTTP GET
- URL: `https://api.telegram.org/bot{{$env.TELEGRAM_BOT_TOKEN}}/getFile`
- Query: `file_id={{ $json.audio_file_id }}`

### 5A) Download Audio Binary
- HTTP GET
- URL: `https://api.telegram.org/file/bot{{$env.TELEGRAM_BOT_TOKEN}}/{{ $json.result.file_path }}`
- Response: `File` (binary `data`)

### 6A) Transcription Groq (Whisper)
- HTTP POST
- URL: `https://api.groq.com/openai/v1/audio/transcriptions`
- Header: `Authorization: Bearer {{$env.GROQ_API_KEY}}`
- FormData:
  - `model=whisper-large-v3`
  - `language=fr`
  - `file` = binary `data`

### 7A) Parse Audio Output (Code)
- `content = $json.text`

---

## Pipeline commun

### 8) Supabase Get Client
- Table: `clients`
- Filtre: `telegram_chat_id = {{ $json.chat_id }}`

### 9) Build Context (Code)
- Ajoute `client_name`, `client_email`, `client_tier`

### 10) Decision LLM (Groq)
- HTTP POST
- URL: `https://api.groq.com/openai/v1/chat/completions`
- Modèle: `llama-3.3-70b-versatile`
- Consigne: **répondre en JSON strict** (`action`, `priority`, `category`, `confidence`, `reply`, `reasoning_summary`).

### 11) Parse Decision JSON (Code)
- Parse robuste: si le modèle renvoie autre chose que du JSON, fallback vers `escalate`.

### 12) Switch Action
- `auto_reply` → réponse Telegram + log Supabase
- `escalate` → Slack + ack Telegram + log Supabase

## Notes de vitrine GitHub

- Ajoute des captures dans docs/screenshots/
- Ajoute une démo (gif / vidéo courte) si possible
- Ajoute des exemples anonymisés de messages (inputs/outputs)
