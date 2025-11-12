# 🎌 Anime Character Guessing Game

A full-stack game where players question an AI to uncover a hidden anime character. The AI only uses curated character data, so every round feels like an anime-themed 20 Questions challenge.

## 🎮 Core Features

- **AI Q&A engine** powered by OpenAI through Spring AI
- **Secure accounts** with JWT auth and optional Google OAuth2 login
- **Chat-style gameplay** with question history and guess tracking
- **Responsive UI** built with Tailwind CSS and Framer Motion
- **Admin-ready APIs** documented via Swagger/OpenAPI

## 🛠️ Tech Stack

- **Backend:** Spring Boot 3.2, Spring Security, PostgreSQL, Flyway, Maven
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, React Query, React Hook Form, Zod
- **Integrations:** OpenAI, SendGrid (email), Sentry (monitoring), Cloudflare
- **DevOps:** Docker, Docker Compose, GitHub Actions, Render (backend), Vercel (frontend)

## 🚀 Getting Started

```bash
# Clone the project
git clone https://github.com/yourusername/anime-guess-game.git
cd anime-guess-game

# Backend setup
cd backend
cp .env.example .env   # populate with database + API keys
./mvnw spring-boot:run
# Backend runs on http://localhost:8080

# Frontend setup
cd ../frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL, etc.
npm run dev
# Frontend runs on http://localhost:3000
```

Prefer containers? `docker-compose up --build` from the repo root will launch both services.

## 🌍 Deployment

- **Render (backend):** create a Web Service, connect GitHub, set the same env vars as your backend `.env`.
- **Vercel (frontend):** import the repo, configure `NEXT_PUBLIC_API_URL` and any optional keys like Sentry.

## 📄 License

MIT License — see `LICENSE`.

## 📧 Contact

Questions or feedback? Open an issue on GitHub.

---

Made with ❤️ by developers who love anime and coding!
