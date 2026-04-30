# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a standalone React component (`interactive_image_prompt_builder.jsx`) for generating structured AI image editing prompts. It has no build system of its own — it is designed to be dropped into an existing React project (Next.js, Vite, etc.) that already provides Tailwind CSS and shadcn/ui.

## Dependencies (must be provided by host project)

- `react` — state via `useState`, memoization via `useMemo`
- `framer-motion` — UI animations
- `lucide-react` — icons (`Copy`, `Sparkles`, `RefreshCw`)
- `@/components/ui/card` and `@/components/ui/button` — shadcn/ui components
- Tailwind CSS — all styling is via Tailwind utility classes

## Architecture

**Single component file:** `interactive_image_prompt_builder.jsx`

The file is organized in layers (top → bottom):

1. **Options objects** — one per tab (`imgGenOptions`, `imgEditOptions`, `vidTextOptions`, `vidPhotoOptions`). Each holds arrays of dropdown values.
2. **Default state objects** — one per tab, keyed to the first option in each array.
3. **`TABS` array** — tab metadata (id, label, subtitle, lucide icon).
4. **Shared UI components** — `SelectBlock` (labeled `<select>`) and `TextBlock` (labeled `<textarea>`).
5. **Tab-specific form panels** — `ImageGenForm`, `ImageEditForm`, `VideoTextForm`, `VideoPhotoForm` — pure presentational components that receive `{ form, set, opts }`.
6. **`AIPromptBuilder`** (default export) — owns all state, builds prompts via four separate `useMemo` hooks, renders the tab bar and the two-column layout.

**State pattern:** Each tab has its own independent `useState` form object. `makeSet(setter)` is a factory that returns a `(key, value) => void` updater so form panels don't need to know which setter they're calling.

**Prompt assembly:** Each tab's prompt is a separate `useMemo` — changing one tab's form does not recompute the others. The active prompt is selected by `activeTab` and displayed in a `<pre>` block.

**Tab IDs:** `"imgGen"` | `"imgEdit"` | `"vidText"` | `"vidPhoto"`

## Extending the component

- **New dropdown in an existing tab:** add the key + array to that tab's options object, add the default value to that tab's default state, add a `SelectBlock` in the tab's form panel, and reference the field in that tab's `useMemo` prompt template.
- **New tab:** add an entry to `TABS`, create options/default/form-panel/useMemo for it, add the branch to `activePrompt` and `handleReset`.
- **Change prompt wording:** edit the template literal inside the relevant `useMemo` in `AIPromptBuilder`.

## Documentation

Two reference guides live alongside the component:
- `ai_image_editing_prompt_guide.md` — covers 13 editing scenarios, general prompt structure, body part terminology.
- `advanced_ai_image_prompt_guide.md` — modular prompt system, expanded pose/clothing/lighting libraries, frame-expansion and identity-lock strategies.

These are content references, not code. Consult them when adjusting prompt wording or adding new option values to stay consistent with the established conventions.
