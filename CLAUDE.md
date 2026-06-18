# CLAUDE.md — Reelease AI Frontend

Guidance for Claude Code when working in this repository.

## What this is

The **frontend / admin dashboard** for **Reelease AI**, an AI social-media management & content-generation SaaS. It is the only user-facing app; it talks to a separate Node/Express + MongoDB backend (repo: `reelease-ai-api`).

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5.9**
- **Tailwind CSS v4** (`@tailwindcss/postcss`) + Radix UI primitives + shadcn-style components
- **Redux Toolkit** + react-redux for global state
- **react-hook-form** / **Formik** + **yup** for forms & validation
- **i18next** + **react-i18next** + **i18next-browser-languagedetector** for localization
- socket.io-client (realtime), framer-motion, lucide-react, ApexCharts, CKEditor 5, Monaco, dnd-kit, next-themes, sonner, swiper

## Commands

```bash
npm run dev      # next dev (local, default port 3000 — set PORT to change)
npm run build    # next build (run this to verify a change compiles)
npm run start    # next start (production; PORT env controls port)
npm run lint     # eslint
```

Always run `npm run build` (or `npx tsc --noEmit`) after non-trivial changes to confirm the app still compiles.

## Architecture — Backend-for-Frontend (BFF)

The browser only ever talks to this app. It never calls the backend directly for normal API traffic.

- **API proxy:** Client code calls relative `/api/*`. Two layers handle it:
  - Route handlers in `src/app/api/**/route.ts` call `apiHandler()` in `src/utils/apiHandler.ts`, which proxies to the backend at `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:3000/api`).
  - `next.config.ts` has a `rewrites()` rule sending any other `/api/:path` (except `/api/uploads`) to `http://localhost:3000/api`.
- **Images / uploads:** `src/app/api/uploads/[...path]/route.ts` proxies to the backend using `NEXT_PUBLIC_STORAGE_URL`.
- **Realtime:** socket.io-client connects from the browser directly to `NEXT_PUBLIC_SOCKET_URL` (the backend's public URL). Event names live in `src/constants/socket.ts`.

## Environment (`.env.local`)

```
NEXT_PUBLIC_API_BASE_URL=https://api.klicklocal.app/api
NEXT_PUBLIC_STORAGE_URL=https://api.klicklocal.app
NEXT_PUBLIC_SOCKET_URL=https://api.klicklocal.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

`NEXT_PUBLIC_*` values are inlined into the client bundle. In production the backend lives at `api.klicklocal.app`; the frontend at `klicklocal.app`.

## Directory map

- `src/app/(auth)/` — login, register, verify-otp, forgot/reset password
- `src/app/(main)/` — authenticated app: dashboard, AI tools (text-to-image, image-to-image, text-to-video, image-to-video, video-motion), characters, media-library, prompt-library, ai-templates, social-media/*, plans, subscriptions, members, permissions, languages, blogs, faqs, pages, testimonials, app-settings, …
- `src/app/api/` — BFF proxy route handlers (see Architecture)
- `src/app/p/[slug]/` — public CMS pages
- `src/components/feature/` — feature-specific components
- `src/components/ui/` — shadcn-style primitives
- `src/components/reusable/`, `src/components/shared/` — shared widgets
- `src/lib/` — `i18n.ts`, store/config; `src/hooks/`, `src/context/`, `src/utils/`, `src/data/`

## Localization (i18n) — important

- Config + **all translation strings** live in a single file: `src/lib/i18n.ts`.
- Shape: `i18n.init({ resources: { en: { translation: { ...~880 keys... } } }, detection: {...}, interpolation: { escapeValue: false }, react: { useSuspense: false } })`.
- **English (`en`) is the only language currently embedded and is the source of truth.** There is no `fallbackLng` or `supportedLngs` set; language is auto-detected (querystring → localStorage → cookie → … → navigator) and cached in `localStorage`.
- Available languages for the switcher are listed in `src/data/languages.json` (German `de` is already present).
- Usage in components: `const { t } = useTranslation()` then `t('some_key')`. Some strings use interpolation: `{{count}}`, `{{app_name}}`, `{{date}}`, `{{field}}`, `{{module}}`, and a few single-brace tokens like `{language}` / `{model}`. Some values contain `\n`.

### To add a new language

1. Add a sibling block in `resources`, e.g. `de: { translation: { ...same keys, translated... } }`.
2. Keep **every key name identical** to `en`; translate values only.
3. Preserve all interpolation placeholders, `\n`, and brand/technical tokens (Reelease AI, Stripe, PayPal, Razorpay, Meta, Instagram, Facebook, WhatsApp, Telegram, SMTP, SendGrid, API, URL, PDF, CSV, JSON, OTP, SEO).
4. Add `fallbackLng: 'en'` to the init so any missing key falls back to English.
5. Verify the language switcher (uses `src/data/languages.json`) lists and switches to the new locale, and that the choice persists via localStorage.

## Conventions

- TypeScript throughout; follow existing file/folder naming (`PascalCase.tsx` for components, feature-grouped folders).
- Use the existing `t()` i18n calls for any user-facing text — do not hardcode UI strings.
- Don't commit `.env.local`, `node_modules`, or `.next` (already in `.gitignore`).

## Deployment (production)

Built with `npm run build`, run under PM2 on port 3001:
```
PORT=3001 pm2 start npm --name reelease-ai-frontend -- start
```
Nginx routes `klicklocal.app` → frontend (3001); `api.klicklocal.app` → backend (3000). Both behind Let's Encrypt SSL.
