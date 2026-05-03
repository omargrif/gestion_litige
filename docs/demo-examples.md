# Exemples (anonymisés)

Ces exemples sont fournis pour montrer le comportement du routeur IA (support/litiges) sans exposer de données réelles.

## Exemple 1 — Livraison en retard (texte)

**Input (Telegram)**

- Type: `text`
- Message: "Ma livraison est en retard de 6 jours, je veux un remboursement."

**Contexte (Supabase — `clients`)**

- `client_name`: "Client inconnu"
- `client_tier`: `standard`

**Décision attendue (LLM JSON)**

```json
{
  "action": "escalate",
  "priority": "high",
  "category": "delivery",
  "confidence": 0.72,
  "reply": "Merci pour votre message. Votre demande nécessite une vérification humaine. Notre équipe vous répond rapidement.",
  "reasoning_summary": "Demande de remboursement liée à un retard important: nécessite une validation humaine."
}
```

**Actions**
- Slack: alerte à l’équipe support
- Telegram: accusé de réception
- Supabase: création d’un ticket (audit)

---

## Exemple 2 — Produit endommagé (photo)

**Input (Telegram)**

- Type: `photo`

**Analyse vision (résumé)**

- "Colis visiblement endommagé; produit cassé; étiquette livraison visible; état non conforme à la réception." (exemple)

**Décision attendue (LLM JSON)**

```json
{
  "action": "escalate",
  "priority": "critical",
  "category": "quality",
  "confidence": 0.81,
  "reply": "Merci. Nous avons bien reçu la photo. Notre équipe va analyser le dossier et revenir vers vous rapidement.",
  "reasoning_summary": "Preuve visuelle de dommage: traitement litige + vérification humaine."
}
```

---

## Exemple 3 — Question simple (auto-reply)

**Input (Telegram)**

- Type: `text`
- Message: "Quels sont vos horaires du support ?"

**Décision attendue (LLM JSON)**

```json
{
  "action": "auto_reply",
  "priority": "low",
  "category": "other",
  "confidence": 0.9,
  "reply": "Notre support est disponible du lundi au vendredi, 9h–18h (heure locale).",
  "reasoning_summary": "Question générale, réponse standard, faible risque."
}
```

**Actions**
- Telegram: réponse
- Supabase: ticket log (audit)

---

## Notes

- Le workflow force une sortie JSON stricte, mais applique aussi un **fallback** (si le modèle renvoie du texte ou un JSON invalide) → escalade par défaut.
- À adapter selon tes règles métiers (SLA, catégories, seuils de confiance).
