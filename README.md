# Saha (Project Sakhi) — AI Citizen Companion for Indian Women

> **Built for "The Invisible Woman" Hackathon Challenge**  
> An empathetic, voice-first, zero-barrier AI assistant empowering women across all Indian states to independently discover, understand, and access verified government welfare schemes.

---

## 🌟 Why Saha?

Over 300 million women in India face digital, linguistic, and bureaucratic hurdles when trying to access vital welfare entitlements such as the **Pradhan Mantri Ujjwala Yojana (PMUY 2.0)**. Official portals are often desktop-oriented, text-heavy, and laden with complex administrative terminology.

**Saha** changes that by providing:
1. **Zero-Friction Access**: Opens immediately to conversational assistance — no compulsory registration, KYC, or login screens.
2. **Pan-India Multilingual Intelligence**: No dropdown menus forcing the user to pick a language. Users simply speak or type in their mother tongue, and Saha automatically responds in the exact same language and script.
3. **Multimodal Voice First**: Designed specifically for low-literacy users. Speak into the microphone and listen to crystal-clear voice playback ("Listen" button) in regional Indian languages.
4. **Grounded Scheme Facts**: Grounded exclusively in verified government data (`pmuy.gov.in`) with step-by-step eligibility verification, document checklists, and local LPG distributor contacts.
5. **Human-Centric UI**: Accessible design with high contrast, touch targets, and a royal violet/indigo aesthetic inspired by Indian women empowerment.

---

## 🇮🇳 Supported Languages

Saha is engineered to support Indian languages without language barriers:

| Language | Script / Dialect | Voice & Text Support |
| :--- | :--- | :--- |
| **Hindi** | हिन्दी | Full (Chat + Voice + TTS) |
| **Bengali** | বাংলা | Full (Chat + Voice + TTS) |
| **Telugu** | తెలుగు | Full (Chat + Voice + TTS) |
| **Marathi** | मराठी | Full (Chat + Voice + TTS) |
| **Tamil** | தமிழ் | Full (Chat + Voice + TTS) |
| **Gujarati** | ગુજરાતી | Full (Chat + Voice + TTS) |
| **Kannada** | ಕನ್ನಡ | Full (Chat + Voice + TTS) |
| **Malayalam** | മലയാളം | Full (Chat + Voice + TTS) |
| **Odia** | ଓଡ଼ିଆ | Full (Chat + Voice + TTS) |
| **Punjabi** | ਪੰਜਾਬੀ | Full (Chat + Voice + TTS) |
| **Assamese** | অসমীয়া | Full (Chat + Voice + TTS) |
| **Urdu** | اردو | Full (Chat + Voice + TTS) |
| **Sindhi** | سنڌي / सिंधी | Full (Chat + Voice + TTS) |
| **Indian English** | Transliterations (Hinglish, Tanglish) | Full (Chat + Voice + TTS) |

---

## 📱 Features & Highlights

- **Dynamic Voice Input**: Automatic detection of speech pauses, graceful browser permission handling, and fallback for browsers without Web Speech API.
- **High-Fidelity Regional TTS**: High-quality regional speech streaming via `/api/tts` that works across 100% of devices (Windows, Android, iOS, macOS) without relying on local system voice packs.
- **Smart Scheme Guidance Card**: Appears only when relevant queries (cooking gas, cylinder, stove, Ujjwala) are discussed. Features:
  - 1-question-at-a-time eligibility checker.
  - Interactive required documents checklist (Ration Card, Aadhaar, Bank Passbook).
  - Step-by-step application walkthrough.
  - One-tap national helpline (`1800-266-6696`).
- **Optional Guest Login**: Users can use all features anonymously or link their Google, Facebook, or Mobile (+91) OTP accounts at any time.

---

## 🛠️ Architecture & Tech Stack

```
├── api/
│   ├── chat.ts               # Gemini 2.5 Flash multimodal route + resilient multilingual fallback
│   └── tts.ts                # Regional language text-to-speech audio streaming endpoint
├── src/
│   ├── components/
│   │   ├── SahaLogo.tsx      # SVG emblem matching design mockup
│   │   ├── Header.tsx        # Top navigation, helpline link, and auth triggers
│   │   ├── InitialScreen.tsx # Saha greeting bubble, central mic, and quick input
│   │   ├── ChatArea.tsx      # High-contrast chat thread with "Listen" button & scheme card
│   │   ├── InputBar.tsx      # Bottom sticky input with mic toggle and pill input
│   │   ├── SchemeGuidance.tsx# PMUY 2.0 interactive eligibility, documents, & application steps
│   │   └── AuthModal.tsx     # Optional Google, Facebook, & Mobile OTP modal
│   ├── hooks/
│   │   ├── useSpeechRecognition.ts # Browser speech capture with locale auto-adaptation
│   │   └── useSpeechSynthesis.ts   # HTML5 audio player streaming from /api/tts
│   ├── data/schemes/
│   │   └── pmuy.ts           # Grounded PM Ujjwala Yojana 2.0 reference data
│   ├── App.tsx               # Root coordinator
│   └── main.tsx              # React 19 entry with ErrorBoundary
```

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Lucide Icons.
- **AI Engine**: Google GenAI SDK (`@google/genai`) with `gemini-2.5-flash`.
- **Audio Pipeline**: HTML5 Audio streaming + Web Speech API + Regional Google TTS gateway.

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd HackArena
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Add your Google Gemini API key:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Get a free API key at [Google AI Studio](https://aistudio.google.com/)). Saha includes an intelligent offline multilingual fallback so the app functions seamlessly even before an API key is supplied!*

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## ☁️ Deployment (Vercel)

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. In **Project Settings** > **Environment Variables**, add:
   - `GEMINI_API_KEY`: Your Gemini API key.
4. Deploy! Vercel will automatically configure the Vite frontend and serverless endpoints in `/api`.

---

## 📄 License

Developed for the HackArena Hackathon — Project Saha (Sakhi). Free for public welfare and non-commercial educational use.
