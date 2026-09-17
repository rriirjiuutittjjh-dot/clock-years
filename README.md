# Clock Years (System Space)

A cinematic New Year countdown: a six-unit clock ticking at 0.1s, event
countdowns (Grand Theft Auto VI — November 19, 2026 — plus an expandable
list of more upcoming releases), a 100-track mp3 playlist with a live
generative ambience, a clean minimal backdrop, dark/white themes, 11
languages, and member accounts with dashboard, settings, and admin orbits.
The playlist files are generated code (see `scripts/generate-music.mjs`).

## Develop

```bash
npm install
npm run dev        # http://localhost:8080
```

## Deploy to Vercel

The repo ships `vercel.json` (Nitro `vercel` preset) — zero config needed:

1. Push this branch, then Vercel → Add New → Project → Import the repo.
2. Set environment variables (Project Settings → Environment Variables):

| Variable             | Required | What it does                                               |
| -------------------- | -------- | ---------------------------------------------------------- |
| `BETTER_AUTH_URL`    | Yes      | Public URL, e.g. `https://clock-years.vercel.app`          |
| `BETTER_AUTH_SECRET` | Yes      | `openssl rand -hex 32` — signs sessions across instances   |
| `DATABASE_URL`       | No*      | Postgres (Neon/Supabase) for persistent users and settings |
| `ADMIN_EMAILS`       | No       | Comma-separated owner emails, e.g. `you@example.com`       |

\*Without `DATABASE_URL` the app runs on the built-in in-memory PGLite
fallback: fine for previews, but users and settings reset on restart.

3. Deploy. `npm run build` runs the app build plus pending DB migrations.

## Deploy to a VPS (Ubuntu)

Own-server path: Docker + Postgres, no Vercel involved (`vercel.json` is
ignored here — the build uses the Nitro `node-server` preset). Full steps
in **[DEPLOY-VPS.md](./docs/DEPLOY-VPS.md)** (Ubuntu 24.04, nginx, HTTPS):

```bash
cp .env.example .env   # set BETTER_AUTH_URL/SECRET, ADMIN_EMAILS, POSTGRES_PASSWORD
sudo docker compose up -d --build
```

## Run on Windows 24/7

No install step: unzip, double-click **`windows\start-windows.bat`**, keep the
window open. For always-on (start at logon + restart on crash), run
**`windows\install-service.ps1`** once as Administrator. Details in
**[WINDOWS.md](./docs/WINDOWS.md)** (needs Node.js 22 LTS).

## Install as an app (PWA)

On PC (Chrome/Edge: install icon in the address bar, or the **Install app**
button in the header) and Android (Chrome menu → *Install app*), the site
installs to your home screen / desktop with its own window and icon, and
keeps working offline: the app shell is precached and every playlist track
you have played is available without a network. iOS: Share → *Add to Home
Screen*.

## Roles & admin

Three roles: `member`, `admin`, `owner`. Staff (`admin`/`owner`) open `/admin`
for site appearance settings and the member list; only the `owner` changes
roles. Everyone manages their own profile and password at `/settings`.

The first account to sign up becomes owner. For a deterministic admin on
deploys, set `ADMIN_EMAILS` — a listed address is granted owner on sign-in
even if it registers late or was demoted (the env is the source of truth).

## Scripts

- `npm run dev` — dev server on :8080
- `npm run build` — production build + migrations
- `npm run typecheck` / `npm run lint` / `npm test` — gates
