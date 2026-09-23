<h1 align="center">🎧 AI Customer Dispute Assistant</h1>

<p align="center">
  <b>A multimodal customer-support agent built with n8n: customers send a text, a photo or a voice message on Telegram,<br/>
  the AI understands the request, checks the customer file, then either answers automatically or escalates to a human — and logs every case.</b>
</p>

<p align="center">
  <img alt="n8n" src="https://img.shields.io/badge/n8n-workflow-EA4B71?logo=n8n&logoColor=white" />
  <img alt="Telegram" src="https://img.shields.io/badge/Telegram-bot-26A5E4?logo=telegram&logoColor=white" />
  <img alt="Llama 3.3" src="https://img.shields.io/badge/Llama%203.3%2070B-Groq-F55036" />
  <img alt="Whisper" src="https://img.shields.io/badge/Whisper-speech--to--text-412991" />
  <img alt="GPT-4o-mini" src="https://img.shields.io/badge/GPT--4o--mini-vision-10A37F" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase&logoColor=white" />
  <img alt="License MIT" src="https://img.shields.io/badge/license-MIT-blue" />
</p>

<p align="center">
  <img src="docs/screenshots/workflow-overview.svg" alt="Workflow overview" width="100%" />
</p>

---

## The problem

Customer-service teams receive disputes in every format: a written complaint, a photo of a damaged parcel, a voice message. Each request has to be read, understood, linked to the right customer, prioritised and answered. Simple questions take time away from the cases that really need a human, and urgent disputes can wait too long in the queue.

## The solution

This project is an **automated first line of customer support** for disputes and complaints. It accepts requests in three formats, turns them into text, enriches them with the customer's file, and lets a language model decide what to do:

- **simple, low-risk questions** → answered instantly and automatically;
- **real disputes, refunds or sensitive cases** → escalated to the support team on Slack with a priority level and a short summary, while the customer receives an acknowledgement.

Every request, whatever the outcome, is recorded as a ticket in a database for follow-up and audit.

I designed and built this workflow myself, from the process design to the prompts, the code nodes and the database schema.

## How it works

| Step | What happens | Technology |
|---|---|---|
| **1. Reception** | The customer writes to a Telegram bot. | Telegram Bot API |
| **2. Normalisation** | The message type is detected (text, photo or audio) and converted into a common format with a unique tracking ID. | JavaScript code node |
| **3a. Text** | Used as is. | — |
| **3b. Photo** | The image is downloaded and analysed; the model summarises the observable facts in 5 lines max. | GPT-4o-mini (vision) via OpenRouter |
| **3c. Audio** | The voice message is transcribed into French text. | Whisper large-v3 via Groq |
| **4. Customer context** | The customer's file (name, email, service tier) is loaded from the database. | Supabase (PostgreSQL) |
| **5. AI decision** | The model returns a strict JSON decision: action, priority, category, confidence score, reply and reasoning summary. | Llama 3.3 70B via Groq (temperature 0.1) |
| **6. Safety fallback** | If the model's answer is not valid JSON or the action is unknown, the case is **automatically escalated to a human**. | JavaScript code node |
| **7a. Auto-reply** | The answer is sent to the customer and a ticket is logged. | Telegram + Supabase |
| **7b. Escalation** | Slack alert to the support team, acknowledgement to the customer, ticket logged. | Slack + Telegram + Supabase |

### Example of an AI decision

A customer writes *"My delivery is 6 days late, I want a refund."* The model returns:

```json
{
  "action": "escalate",
  "priority": "high",
  "category": "delivery",
  "confidence": 0.72,
  "reply": "Thank you for your message. Your request needs to be checked by our team, who will get back to you shortly.",
  "reasoning_summary": "Refund request linked to a significant delay: requires human validation."
}
```

More scenarios (damaged product photo, simple question answered automatically): [`docs/demo-examples.md`](docs/demo-examples.md)

## Design choices

- **Human in the loop by default** — the AI only answers on its own when it is confident the request is simple; anything uncertain or invalid goes to a person.
- **Multimodal input, single pipeline** — photos and voice messages are converted into text first, so the same decision logic handles every format.
- **Structured, predictable output** — low temperature and strict JSON make the decision machine-readable and easy to route.
- **Traceability** — every case gets a tracking ID and a ticket with its category, priority, action and reasoning.
- **No secrets in the code** — all API keys are read from environment variables ([`.env.example`](.env.example)).

## What this project demonstrates

- **Process analysis and automation** — mapping a real customer-service process and redesigning it as an automated, measurable workflow.
- **Applied generative AI** — prompt design, structured LLM outputs, and combining several models (language, vision, speech).
- **Reliability thinking** — fallback logic so that an AI error never leaves a customer without an answer.
- **Data modelling** — relational schema for customers and tickets with constraints and indexing ([`docs/supabase-schema.sql`](docs/supabase-schema.sql)).
- **API integration** — Telegram, Groq, OpenRouter, Supabase and Slack orchestrated in one n8n pipeline.

## Repository structure

```
.
├── n8n/workflows/workflow.json   # Workflow definition: nodes, code, prompts and connections
├── docs/
│   ├── workflow-setup.md         # Node-by-node setup guide
│   ├── architecture.md           # Design decisions and roadmap
│   ├── demo-examples.md          # Anonymised example scenarios
│   ├── supabase-schema.sql       # Tables `clients` and `tickets`
│   ├── README-n8n.md             # Detailed technical documentation (French)
│   └── screenshots/              # Workflow and database diagrams
├── .env.example                  # Required environment variables
└── LICENSE
```

## Getting started

1. Create the tables by running [`docs/supabase-schema.sql`](docs/supabase-schema.sql) in the Supabase SQL editor.
2. Create a Telegram bot with BotFather and get API keys for Groq and OpenRouter (plus a Slack bot token for escalations) — see [`.env.example`](.env.example).
3. Build the workflow in n8n from [`n8n/workflows/workflow.json`](n8n/workflows/workflow.json), following the node-by-node guide in [`docs/workflow-setup.md`](docs/workflow-setup.md).
4. Test it with a text message, a photo and a voice message sent to your bot.

## Roadmap

- Knowledge-base retrieval (RAG) on FAQs, procedures and anonymised ticket history
- Connectors to help-desk tools such as Zendesk or Intercom
- Dashboard of escalation rate, response time and average confidence

## Author

**Omar Grif** — engineering student at EMINES – UM6P (Ben Guerir, Morocco)
GitHub: [@omargrif](https://github.com/omargrif)

Released under the [MIT License](LICENSE).
