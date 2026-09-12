# Clock Years (System Space)

A cinematic New Year countdown: a living solar system (clickable planets with
fact cards), a six-unit clock ticking at 0.1s, a 4D mouse-reactive warp
background, dark/white themes, 11 languages, and member accounts with
dashboard, settings, and admin orbits.

## Develop

```bash
npm install
npm run dev        # http://localhost:8080
```

## Deploy to Vercel

The repo ships `vercel.json` (Nitro `vercel` preset) — zero config needed:

1. Push this branch, then Vercel → Add New → Project → Import the repo.
2. Set environment variables (Project Settings → Environment Variables):

| Variable             | Required | What it does                                                |
| -------------------- | -------- | ----------------------------------------------------------- |
| `BETTER_AUTH_URL`    | Yes      | Public URL, e.g. `https://clock-years.vercel.app`           |
| `BETTER_AUTH_SECRET` | Yes      | `openssl rand -hex 32` — signs sessions across instances    |
| `DATABASE_URL`       | No*      | Postgres (Neon/Supabase) for persistent users and settings  |
| `ADMIN_EMAILS`       | No       | Comma-separated owner emails, e.g. `you@example.com`       |

\*Without `DATABASE_URL` the app runs on the built-in in-memory PGLite
fallback: fine for previews, but users and settings reset on restart.

3. Deploy. `npm run build` runs the app build plus pending DB migrations.

## Deploy to a VPS (Ubuntu)

Own-server path: Docker + Postgres, no Vercel involved (`vercel.json` is
ignored here — the build uses the Nitro `node-server` preset). Full steps
in **[DEPLOY-VPS.md](./DEPLOY-VPS.md)** (Ubuntu 24.04, nginx, HTTPS):

```bash
cp .env.example .env   # set BETTER_AUTH_URL/SECRET, ADMIN_EMAILS, POSTGRES_PASSWORD
sudo docker compose up -d --build
```

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
