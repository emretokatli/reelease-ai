# design-sync notes — Reelease AI Components

Project: **Reelease AI Components** (claude.ai/design) — `9f6ff19d-1578-4b97-92ad-432ffb5d22ed`.
Scope: the 25 shadcn-style primitives in `src/components/ui/`. This repo is a **Next.js app, not a component library**, so the sync uses a hand-authored scoped entry rather than a dist build.

## How this repo is wired (package shape, synth-via-entry)

- **No dist / no library build.** `cfg.entry` → `.design-sync/entry.tsx` re-exports the 25 ui primitives as **named** exports so esbuild bundles only the DS (not the whole app). Adding/removing a ui component means editing BOTH `entry.tsx` AND `cfg.componentSrcMap`.
- **Default exports** (`Input`, `Label`, `PasswordInput`) are re-exported as named in `entry.tsx` (`export { default as X }`) — `export *` would drop them.
- **`@/` aliases** resolve via `cfg.tsconfig: tsconfig.json` (esbuild tsconfig-paths plugin).
- **CSS is compiled, not shipped.** `globals.css` is Tailwind v4 *source*. `node .design-sync/compile-css.mjs` (postcss + `@tailwindcss/postcss`, reads `.design-sync/tw-entry.css`) emits `.design-sync/compiled.css` (gitignored) → `cfg.cssEntry`. **Re-run it before every build, especially after editing previews** (new utility classes must be compiled in). tw-entry.css `@source`s `src/components/ui/**` and `.design-sync/previews/**`.
- **Redux provider for previews.** `Switch` → `useAppDirection()` → `useSelector(state.layout.direction)` throws without a `<Provider>`. `.design-sync/providers.tsx` supplies a minimal read-only store; wired via `cfg.extraEntries` + `cfg.provider: {component: "DSProvider"}`.
- **Overlays/wide** use `cfg.overrides`: Dialog/Popover/Select/DropdownMenu/Tooltip = `cardMode: single` + viewport (rendered open via `defaultOpen`); Table = `cardMode: column`.

## Render check / tooling

- Playwright is **not** a repo dep. Installed `playwright` (no browsers) into `.ds-sync/` and ran validate/capture with `DS_CHROMIUM_PATH="/c/Program Files/Google/Chrome/Application/chrome.exe"` (system Chrome). Set that env for any validate/capture/driver run.
- **Windows:** `ds-bundle` rmSync can `EPERM` if Chrome still holds a handle — kill chrome.exe before a rebuild.

## Known render warns (triaged — not new on re-sync)

- `[RENDER_THIN] XIcon` — icon-only SVG (renders three X brand logos fine); benign, paint measure is just small.
- `[TOKENS_MISSING]` (8 vars) — runtime/vendor: `--rdp-*` (react-day-picker), `--swiper-*` (swiper), plus `--popover-foreground`, `--card-border-color`, `--button-radius` which are **pre-existing gaps in the app's own `globals.css`** (cosmetic, non-blocking).
- `[FONT_MISSING] Cambria` — a generic fallback inside Tailwind's default `--font-serif` stack, **not a brand font**. The brand family is system-ui via `--font-sans`. Accepted: previews render in system fonts.
- **Toaster** ships the **floor card** by design — `sonner`'s toast region renders nothing statically (no `toast()` calls).

## Re-sync risks (watch-list)

- **`compiled.css` is gitignored & machine-generated** — a fresh clone must `node .design-sync/compile-css.mjs` before building or `cfg.cssEntry` is missing and validate's CSS checks fail.
- **`providers.tsx` store shape** is coupled to `useAppDirection` reading `state.layout.direction`. If that hook/slice path changes in the app, the `Switch` preview breaks — update providers.tsx.
- **`entry.tsx` + `componentSrcMap` are hand-maintained** — they don't auto-track new files in `src/components/ui/`.
- **All components land in one `general` group** (no per-component docs/`@category`). Fine for a flat primitive set; add doc stubs with frontmatter `category:` to regroup.
- **Tailwind `@tailwindcss/postcss` 4.3.1** assumed; a major bump could change compiled output — re-grade if the look shifts.
- Playwright/Chrome path is environment-specific (system Chrome at the path above). On another machine, install chromium or point `DS_CHROMIUM_PATH` at a local browser.
