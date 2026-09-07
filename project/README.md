# Habit Tracker — web + mobile, one backend

A small habit tracker built to relearn Next.js: App Router, Server Components,
Server Actions, Route Handlers, Prisma, and a REST API shared with a React
Native (Expo) mobile app. Both clients hit the same Postgres database.

```
project/
  web/      Next.js 15 app — dashboard (Server Components/Actions) + REST API
  mobile/   Expo app — talks to the REST API with a bearer token
```

## 1. Run the web app locally

**Get a free Postgres database** — https://neon.tech (or supabase.com).
Create a project, copy the connection string.

```bash
cd web
npm install
cp .env.example .env
# edit .env: paste your DATABASE_URL, and set JWT_SECRET to the output of:
#   openssl rand -base64 32

npx prisma migrate dev --name init   # creates the tables
npm run dev                          # http://localhost:3000
```

Open http://localhost:3000, sign up, add a habit, mark it done. That's the
whole web app working end to end.

## 2. Run the mobile app locally

```bash
cd mobile
npm install
```

Find your computer's LAN IP (`ipconfig getifaddr en0` on Mac, `ipconfig` on
Windows) and put it in `mobile/lib/api.ts`:

```ts
export const API_BASE_URL = "http://YOUR_LAN_IP:3000";
```

Then:

```bash
npx expo start
```

Install **Expo Go** (free) on your phone from the App Store / Play Store,
scan the QR code. Make sure your phone and computer are on the same wifi.
Sign up in the app — it's hitting the same database as the web app, so a
habit you add on your phone will show up if you refresh the web dashboard.

## 3. Deploy for free

**Database:** Neon's free tier is already live once you created the project
above — nothing further to do.

**Web app → Vercel:**
1. Push the `web/` folder to a GitHub repo.
2. Go to vercel.com → New Project → import the repo.
3. Add environment variables `DATABASE_URL` and `JWT_SECRET` (same values as
   your local `.env`).
4. Deploy. Vercel's free tier is plenty for a personal project.
5. Run `npx prisma migrate deploy` once against the production database
   (from your machine, with `DATABASE_URL` pointed at prod) so the tables
   exist there too.

**Mobile app:** update `API_BASE_URL` in `mobile/lib/api.ts` to your Vercel
URL (e.g. `https://your-app.vercel.app`), then `npx expo start` and scan the
QR code again with Expo Go — no app store submission needed for personal
use. (If you ever want a real installable app icon on your phone instead of
running it through Expo Go, look at `eas build`, which also has a free tier
for a small number of builds a month.)

## What to extend first

Roughly in order of learning value:

1. **Switch middleware to `jose`** so token verification can happen at the
   edge, not just a cookie-presence check (see the comment in
   `src/middleware.ts`). This is the most "real Next.js" gap left on purpose.
2. **Add optimistic UI to the web dashboard** using `useOptimistic` — right
   now the Server Action round-trips before the UI updates; the mobile app
   already does this (see `handleToggle` in `HabitsScreen.tsx`) so you can
   compare the two approaches directly.
3. **Add a weekly heatmap** (GitHub-style contribution graph) — good excuse
   to pull in a charting lib on web and `react-native-svg` on mobile from
   the same `/api/habits` data.
4. **Push notifications** on mobile for a daily reminder (`expo-notifications`)
   — free, and a nice mobile-only feature that has no web equivalent, which
   is a useful exercise in where the two clients diverge.
5. **Rate limit the auth routes** and add password reset — the un-glamorous
   part of auth that most tutorials skip.
6. **Replace the hand-rolled JWT auth with Auth.js (NextAuth v5)** once you're
   comfortable with what it's abstracting away — worth doing by hand first
   so the library doesn't feel like magic.
