# Notes AI — Frontend

React + Vite client for Notes AI, a smart note-taking app with AI-powered summarization and generation. Connects to the [notes-ai-backend](https://github.com/Jorge5115/notes-ai-backend) API for authentication, note management, and AI features.

## Features

- **Authentication** — email/password login (JWT) and "Sign in with Google" (OAuth2).
- **Notes management** — create, edit, and delete notes with a responsive UI.
- **AI actions** — summarize or auto-generate note content via the backend's Groq (Llama 3) integration.
- **CI/CD** — automated build/lint pipeline with GitHub Actions on every push.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React |
| Build tool | Vite |
| HTTP client | Fetch / Axios (adjust to match your implementation) |
| CI/CD | GitHub Actions |
| Deployment | Vercel |

## Getting Started

### Prerequisites

- Node.js 18+
- The [notes-ai-backend](https://github.com/Jorge5115/notes-ai-backend) running locally or deployed

### Environment Variables

Create a `.env` file in the project root:

```
VITE_API_BASE_URL=http://localhost:8080
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### Installation

```bash
git clone https://github.com/Jorge5115/notes-ai-frontend.git
cd notes-ai-frontend
npm install
```

### Run in development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for production

```bash
npm run build
npm run preview
```

## CI/CD

GitHub Actions runs automatically on every push/PR to `main`, installing dependencies, building the project, and (if configured) running linting/tests before deployment.

## Related Project

- Backend: [notes-ai-backend](https://github.com/Jorge5115/notes-ai-backend) (Spring Boot, JWT + OAuth2, Groq AI, Docker)

## Author

Jorge — Full Stack Developer | Java · Spring Boot · React · Docker · CI/CD
