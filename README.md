# Blood Donation App v3 — Client

This repository is the frontend for the Blood Donation App v3. It is a Vite + React single-page application that uses Tailwind/DaisyUI for styling, Firebase for auth/storage helpers, and the Stripe JS libraries for payments. The app communicates with the backend API over an environment-configured base URL.

Quick facts (repo analysis):
- Framework: React + Vite
- Dev server: `npm run dev` (Vite)
- Production build: `npm run build` → output directory: `dist/`
- Preview: `npm run preview` (Vite preview)
- Key dependencies: react, react-dom, react-router, @tanstack/react-query, firebase, @stripe/*, tailwindcss, daisyui, axios

Requirements
- Node.js 18+ (recommended)
- npm (use the lockfile: package-lock.json)
- A running backend API and required environment variables (see below)

Environment variables — create a local `.env` file (do not commit secrets)
- VITE_API_BASE_URL=https://api.example.com       # Base URL of the backend API
- VITE_FIREBASE_API_KEY=your_firebase_api_key
- VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
- VITE_FIREBASE_PROJECT_ID=your_project_id
- VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
- VITE_STRIPE_PUBLISHABLE_KEY=pk_live_or_pk_test_...
- VITE_SENTRY_DSN= (optional)
- NODE_ENV=development|production

Local development
1. Clone the repo:
   git clone https://github.com/jahan-d/blood-donation-app-v3-client.git
2. Install dependencies:
   npm ci
3. Start the dev server:
   npm run dev
4. Open the app at http://localhost:5173 (Vite default)

Production build & deploy
1. Build production assets:
   npm run build
2. The production-ready files are in `dist/` — verify and publish to your static host.

Recommended hosting options
- Vercel or Netlify: Connect the repository and let the platform build & deploy.
- S3 + CloudFront: Upload `dist/`, configure caching and invalidation.
- Serve behind a CDN with TLS, Brotli/gzip compression and long cache TTLs for static assets.

Docker (example multi-stage for static serving)
```
# Stage 1: build
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: serve
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# Optionally add a custom nginx.conf to enable security headers
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

CI recommendation (GitHub Actions)
- Steps: `actions/checkout`, `actions/setup-node`, `npm ci`, `npm run lint`, `npm run build`, and optional `firebase deploy` or upload to hosting provider.

Testing
- Add unit tests (Jest/Vitest) and E2E tests (Cypress/Playwright) and run them in CI.

Observability & security
- Add client error tracking (Sentry or LogRocket) and Real User Monitoring.
- Keep secrets out of the client. Use server-side endpoints for any sensitive operations.
- Add a Content Security Policy at the CDN or reverse proxy level.

Maintenance & contribution
- Use branches and PRs. Ensure CI passes before merging.
- Keep the `package-lock.json` committed and run `npm audit` regularly.

License & contact
- Add a LICENSE file (e.g., MIT) at the repo root.
- For questions, open an issue or contact: jahanebnadelower@gmail.com
