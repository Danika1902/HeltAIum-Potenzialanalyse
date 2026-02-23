# HeltAIum Potenzialanalyse – Deployment Guide

## 🚀 In 5 Minuten live (Vercel – kostenlos)

### Schritt 1: Projekt auf GitHub pushen

```bash
# Im Projektordner:
git init
git add .
git commit -m "Potenzialanalyse v1"

# Neues Repo auf github.com erstellen, dann:
git remote add origin https://github.com/DEIN-USERNAME/heltaium-potenzialanalyse.git
git branch -M main
git push -u origin main
```

### Schritt 2: Vercel verbinden

1. Gehe zu **[vercel.com](https://vercel.com)** → mit GitHub einloggen
2. Klicke **"Add New Project"**
3. Wähle dein `heltaium-potenzialanalyse` Repository
4. Framework: **Vite** (wird automatisch erkannt)
5. Klicke **"Deploy"** → fertig! 🎉

Deine Seite ist sofort live unter: `heltaium-potenzialanalyse.vercel.app`

### Schritt 3: Eigene Domain verbinden (optional)

In Vercel → Project Settings → Domains:
- `analyse.heltaium.com` hinzufügen
- DNS-Eintrag bei deinem Domain-Anbieter setzen (CNAME → `cname.vercel-dns.com`)

---

## ⚡ WICHTIG: Webhook-URL eintragen

Öffne `src/Potenzialanalyse.jsx` und ersetze die Webhook-URL (Zeile ~20):

```js
const WEBHOOK_URL = "https://DEINE-N8N-INSTANZ.app/webhook/potenzialanalyse";
```

Mit deiner echten n8n-Webhook-URL.

### n8n Workflow Setup:

1. Neuen Workflow erstellen
2. **Webhook-Node** als Trigger (Method: POST)
3. Die Webhook-URL kopieren und oben einsetzen
4. Danach z.B.: Google Sheets / CRM / E-Mail Notification anbinden

---

## 🔧 Lokal testen

```bash
npm install
npm run dev
```

Öffnet sich unter `http://localhost:5173`

---

## 📦 Projekt-Struktur

```
potenzialanalyse-app/
├── index.html              ← HTML mit SEO Meta-Tags
├── package.json            ← Dependencies
├── vite.config.js          ← Vite Config
└── src/
    ├── main.jsx            ← Entry Point
    └── Potenzialanalyse.jsx ← Hauptkomponente
```

---

## 🌐 Später in bestehende Website einbauen

Falls du die Analyse in deine HeltAIum-Website integrieren willst:

**Option A – iFrame Embed:**
```html
<iframe src="https://analyse.heltaium.com" width="100%" height="100vh" frameborder="0"></iframe>
```

**Option B – React-Komponente importieren:**
Falls deine Website auch React nutzt, kopiere einfach `Potenzialanalyse.jsx` rein und importiere sie.

**Option C – WordPress Embed:**
Nutze ein Plugin wie "Advanced iframe" oder bette es als Custom HTML Block ein.
