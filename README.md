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
| Deployment | Vercel (free tier) |

## CI/CD

GitHub Actions runs automatically on every push/PR to `main`, installing dependencies, building the project, and (if configured) running linting/tests before deployment.

## Live Demo

- App: https://notes-ai-frontend.vercel.app/login

> The whole stack (Vercel frontend, Render backend, Aiven MySQL, and Groq API) runs entirely on free tiers — no paid infrastructure required to reproduce this setup.

## Related Project

- Backend: [notes-ai-backend](https://github.com/Jorge5115/notes-ai-backend) (Spring Boot, JWT + OAuth2, Groq AI, Docker, deployed on Render)

## Author

Jorge — Full Stack Developer | Java · Spring Boot · React · Docker · CI/CD
