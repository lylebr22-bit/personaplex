# FlipCheck

Snap a thrift-store tag → AI estimates resale value, best platform to list on, and a suggested listing title.

Two packages:
- `web/` — Next.js landing page + `/api/analyze` Claude Vision endpoint (your backend)
- `mobile/` — Expo iOS app (what ships to the App Store)

The Anthropic API key lives **only** on the backend. The mobile app talks to `/api/analyze`.

---

## Setup

### 1. Backend (Next.js)

```bash
cd web
npm install
cp ../.env.example .env.local
# edit .env.local and paste your Anthropic API key
npm run dev
```

The API runs at `http://localhost:3000`. Test the endpoint:

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d "{\"imageBase64\":\"$(base64 -i test.jpg)\",\"mediaType\":\"image/jpeg\"}"
```

Deploy to Vercel: `npx vercel` (set `ANTHROPIC_API_KEY` as an env var in the Vercel dashboard).

### 2. Mobile (Expo)

```bash
cd mobile
npm install
# point the app at your backend
export EXPO_PUBLIC_API_URL=http://localhost:3000     # or your deployed URL
npx expo start
```

Press `i` to open iOS Simulator (requires Xcode on macOS). Or scan the QR code with the Expo Go app on a physical iPhone.

---

## Configuration

| Env var | Where | Default | Notes |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | `web/.env.local` | — | **Required.** Server-side only. Get one at console.anthropic.com. |
| `ANTHROPIC_MODEL` | `web/.env.local` | `claude-opus-4-7` | Swap to `claude-sonnet-4-6` (~5x cheaper) or `claude-haiku-4-5` (~20x cheaper) once quality is dialed in. |
| `EXPO_PUBLIC_API_URL` | shell when running Expo | `http://localhost:3000` | Your deployed backend URL in production. |
| `FREE_SCANS_PER_MONTH` | `web/.env.local` | `3` | Soft paywall threshold enforced by the mobile app. |

---

## What's Built

- [x] `/api/analyze` — Claude Vision → structured JSON (value range, platform, title, tips). Uses prompt caching on the system prompt.
- [x] Landing page with pricing, feature list, FAQ
- [x] Expo iOS app: camera, scan, results, history, paywall stub
- [x] Free-scan counter in local AsyncStorage
- [x] Typed response schema shared between web and mobile

## Still TODO Before Shipping

- [ ] **Payments.** The paywall screen is a stub. iOS requires Apple IAP for subscriptions — integrate [RevenueCat](https://www.revenuecat.com) and create the subscription product in App Store Connect. Stripe does **not** work for iOS in-app subscriptions.
- [ ] **App Store Connect** — bundle ID, app icon (`mobile/assets/icon.png`), privacy policy URL, screenshots.
- [ ] **Auth (optional for V1).** Currently anonymous — scan count is per-device. Add Sign in with Apple if you want cross-device sync later.
- [ ] **LLC + Stripe.** See main chat — Wyoming or New Mexico LLC via Northwest Registered Agent or Doola for anonymity.
- [ ] **Analytics.** Recommend PostHog or Amplitude on a `scan_completed` event to tune conversion.

---

## Cost Math

With prompt caching warm (system prompt cached, only image + output counted):
- Opus 4.7: ~$0.02 per scan
- Sonnet 4.6: ~$0.014 per scan
- Haiku 4.5: ~$0.003 per scan

At $9.99/mo with ~30 scans/user/mo and Haiku = ~$0.10 COGS → 99% gross margin.
