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

\*Without `DATABASE_URL` the app runs on the built-in in-memory PGLite
fallback: fine for previews, but users and settings reset on restart.

3. Deploy. `npm run build` runs the app build plus pending DB migrations.

## Scripts

- `npm run dev` — dev server on :8080
- `npm run build` — production build + migrations
- `npm run typecheck` / `npm run lint` / `npm test` — gates
