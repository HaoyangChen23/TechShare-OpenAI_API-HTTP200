# SOP AI Analyzer (Tech Share Demo)

A demo application showcasing how to securely integrate OpenAI's Web API into a Vue frontend using Firebase Functions (Serverless) as a proxy. This architecture ensures API keys remain hidden and allows for enforcing structured JSON output from the LLM.

## Tech Stack
- **Frontend**: Vue 3 + Vite
- **Backend**: Firebase Functions (Node.js)
- **AI**: OpenAI API (GPT-4o-mini)

## Prerequisites
- Node.js (v16+)
- Firebase CLI (`npm install -g firebase-tools`)
- An OpenAI API Key

## Setup & Installation

### 1. Clone & Install
```bash
# Install Frontend dependencies
cd frontend
npm install

# Install Backend dependencies
cd ../functions
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `functions/` directory to store your OpenAI API Key:

**`functions/.env`**
```env
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY
```

### 3. Run Locally (Development)
You need two terminals running simultaneously.

**Terminal 1: Backend (Firebase Emulator)**
```bash
# Run from the project root directory
firebase emulators:start --only functions
```
*Note: Since we configured `.firebaserc` with `demo-techshare`, the function URL should be `http://127.0.0.1:5001/demo-techshare/us-central1/analyzeSop`.*

**Terminal 2: Frontend (Vite)**
```bash
cd frontend
npm run dev
```

### 4. Test
Open the localhost URL provided by Vite (usually `http://localhost:5173`). Paste a paragraph of text and click "Analyze".

### 5. Live Demo
You can access the deployed live demo here:

- **URL**: https://techshare-bef7e.web.app


## Key Concepts Demonstrated
1. **Security**: API Key is stored in backend `process.env`, never exposed to the browser.
2. **Serverless Proxy**: Frontend calls our Firebase Function, which then calls OpenAI.
3. **Structured Output**: System prompt and `response_format: { type: "json_object" }` ensure the AI returns valid JSON for easy UI rendering.
