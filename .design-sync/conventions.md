# Reelease AI UI — how to build with these components

A shadcn-style React + **Tailwind CSS v4** primitive set (Radix UI under the hood). Style with Tailwind utility classes via `className`; the design language lives in CSS custom properties (`var(--*)`) surfaced as Tailwind color/radius utilities. There is **no prop-based style system** — pass `className`, not `sx`/`tone` props.

## Setup & wrapping

- **Theme tokens are global CSS variables.** They load from `styles.css` (which `@import`s `_ds_bundle.css`). Everything resolves against `:root`; **dark mode** is the `.dark` class on an ancestor (`<html class="dark">`) — every token has a dark value.
- **`Tooltip` must be wrapped in `TooltipProvider`** (once, near the app root, or per tooltip) or it throws. `TooltipContent`, `DialogContent`, `PopoverContent`, `SelectContent`, `DropdownMenuContent` render through a portal — mount them inside their `*Trigger`/root.
- **`Switch` reads the app's Redux store** (`state.layout.direction`, for RTL) via `react-redux`. In an app without that store it throws — wrap in a `<Provider>` exposing `{ layout: { direction: 'ltr' } }`, or avoid `Switch` if you have no store.
- Most other primitives (`Button`, `Card`, `Input`, `Badge`, `Table`, `Tabs`, …) render standalone with no provider.

## Styling idiom — real class vocabulary

Compose layouts with Tailwind utilities bound to DS tokens (all defined in the bound `_ds_bundle.css`):

| Purpose | Classes |
|---|---|
| Surfaces / text | `bg-primary`, `bg-secondary`, `bg-destructive`, `bg-muted`, `text-foreground`, `text-muted-foreground`, `text-primary-foreground` |
| Glass + cards | `glass-card`, `inner-card`, `border-glass-border` |
| Brand accents | `primary-btn` (gradient fill), `title-color` (gradient text) |
| Radius | `rounded-radius`, `rounded-border-radius` (pill / large brand radii) |
| Spacing | `p-button-padding` |

Raw tokens are also available as `var(--primary)`, `var(--secondary)`, `var(--muted-foreground)`, `var(--glass-border)`, `var(--radius)`, `var(--background)`, `var(--foreground)`, etc. — use these for inline styles. Prefer the component's own variants (`<Button variant="premium">`, `<Badge variant="secondary">`) over re-styling with classes.

## Where the truth lives

- `styles.css` → `_ds_bundle.css`: the full token set (`:root`) and every utility class. Read it before inventing class names.
- `<Name>.prompt.md` and `<Name>.d.ts` per component: the usage notes and exact prop contract the agent should follow.

## Idiomatic snippet

```tsx
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '<pkg>'

<Card className="max-w-sm">
  <CardHeader>
    <CardTitle>Publish to Instagram</CardTitle>
  </CardHeader>
  <CardContent className="flex items-center justify-between gap-3">
    <span className="text-sm text-muted-foreground">Ready to schedule</span>
    <Badge variant="premium">+18%</Badge>
  </CardContent>
  <CardContent className="flex gap-2">
    <Button variant="premium">Schedule</Button>
    <Button variant="ghost">Save draft</Button>
  </CardContent>
</Card>
```
