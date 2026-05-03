# Architecture & décisions de conception

## Objectif

Automatiser la gestion de litiges / support client en **multimodal** (texte, photo, audio) :
- Normaliser l’entrée
- Enrichir le contexte client (Supabase)
- Décider l’action via un LLM
- Exécuter l’action (auto-réponse ou escalade)
- Logger la trace (audit)

## Principes

- Pas de secrets en dur: variables d’environnement / credentials n8n
- Pipeline déterministe autant que possible: `temperature` faible
- Sortie LLM en JSON strict + fallback robuste (sinon escalade)

## Points d’extension (roadmap)

- Ajouter une brique RAG vectorielle (Pinecone / pgvector) sur:
  - base de connaissances (FAQ, procédures)
  - historique anonymisé des tickets
- Ajouter des webhooks (Zendesk, Intercom)
- Ajouter des métriques (taux d’escalade, latence, confiance)
