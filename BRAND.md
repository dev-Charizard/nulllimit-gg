# null;limit — brand brief

Hand this file to a coding agent along with the `web/` folder. It covers what the mark
means, the palette, and exactly how to implement it.

---

## 0. The one rule that shapes everything

There are **two independent brand assets**:

1. **The mark** — two open rings. *Primary.*
2. **The wordmark** — `null;` or `null;limit` set in type. *Alternative.*

**They are never used together.** Not side by side, not stacked, not one small beside the
other. A given surface uses one or the other. Nav uses the mark. A footer might use the
wordmark. A page never shows both in the same lockup.

There is no combined logo file in this bundle, on purpose.

---

## 1. What the mark is

Two open rings sitting at the same x position. A bar arrives at the lower ring from the
left; a second bar leaves the upper ring to the right.

It is a **jump discontinuity** drawn to scale. In calculus, when a function approaches
one value from the left and a different value from the right, the two one-sided limits
disagree and the limit at that point **does not exist** — it is *undefined*. The hollow
circles are the standard notation for an excluded endpoint: the value the function
approaches but never actually takes.

The mark spells the company name. `null` — the value that isn't a value. `limit` — the
thing that doesn't exist here. The tagline *undefined by design* is the same sentence in
English.

Three properties that are load-bearing, not decoration:

- **The rings are open.** Filling or closing them inverts the meaning — a filled dot says
  the point *is* included.
- **The rings sit at different heights.** Levelling them removes the jump and the whole
  idea with it. Left bar low, right bar high, always.
- **The rings carry the metal, the bars do not.** The rings are the subject; the bars are
  the path leading to them.

## 2. What the wordmark is

`null;` set in **JetBrains Mono Bold at -0.03em tracking** — the same face and tracking
already on the site. `null;limit` is the long form, for legal lines, contracts and
invoices. Every glyph is an **outlined vector path**, not live text, so nothing depends
on the font being installed. Do not recreate it with a `<span>` and a font stack.

**Naming:** lowercase `null;` and `null;limit` in the marks. Title case `Null Limit` only
in legal strings — the LLC name, the copyright line.

## 3. Palette — graphite and metal

Replaces the old teal / purple / volt-green set entirely. The field is a **neutral**
near-black: no blue cast, no purple cast.

| Token | Hex | Role |
|---|---|---|
| `--bg` | `#0B0C0E` | page field |
| `--surface` | `#131518` | raised panel |
| `--surface-2` | `#1B1E22` | panel on panel |
| `--border` | `#262A2F` | hairline |
| `--border-hi` | `#363B42` | hover hairline |
| `--text` | `#E8EAED` | primary copy, and the mark's bars |
| `--text-2` | `#A8AEB5` | secondary copy |
| `--muted` | `#6B7278` | de-emphasised |
| `--dim` | `#464C52` | furthest back |

**Metals.** These separate by *tone and luminance*, never by hue — that is what keeps the
palette monochrome while still letting things be told apart.

| Token | Hex | Character |
|---|---|---|
| `--silver` | `#C9CFD6` | **the accent.** flat stand-in for the gradient |
| `--platinum` | `#DDE3E8` | lightest, coolest |
| `--steel` | `#9AA3AC` | neutral mid |
| `--titanium` | `#B8B2AA` | warm grey |
| `--nickel` | `#A9A29B` | warmer still |
| `--gunmetal` | `#5C646D` | dark metal — **use this as the accent on light backgrounds** |

**The gradient.** `--grad-silver` is the sheen: white → grey → white → grey across 135°.
It is what makes metal read as metal rather than as grey.

```css
--grad-silver: linear-gradient(135deg,
  #FFFFFF 0%, #B9BEC4 18%, #F4F6F8 38%, #8D949B 55%,
  #E6E9EC 72%, #A2A8AE 88%, #DFE3E6 100%);
```

### Where gradients go, and where they must not

Metal only convinces at size. Use the gradient on things that are **large or shiny** —
the mark at hero scale, display type, a hairline border, one key button edge. Use **flat
`--silver`** everywhere else.

Never gradient: body copy, anything under ~20px, long paragraphs, the favicon. A gradient
at small size is mud, and it costs you contrast for nothing.

### Migrating the old tokens

| Old | New |
|---|---|
| `--bg: #020208` | `--bg: #0B0C0E` (neutral, drops the blue cast) |
| `--NL: #00ffcc` | `--silver: #C9CFD6` + `--grad-silver` |
| `--text: #b8cce0` | `--text: #E8EAED` |
| `--muted: #384858` | `--muted: #6B7278` |
| `--agent: #8b74ff` | `--cat-agents: var(--platinum)` |
| `--tools: #38c8ff` | `--cat-tools: var(--silver)` |
| `--crypto: #f5c842` | `--cat-crypto: var(--titanium)` |
| `--consult: #00ffcc` | `--cat-consult: var(--steel)` |
| `--content: #ff7eb3` | `--cat-content: var(--nickel)` |
| `--future: #606080` | `--cat-future: var(--gunmetal)` |
| lime `#c8f547` on /consulting | drop it — the sub-brand uses `--platinum` instead |

The ecosystem categories used to separate by hue. Hue is gone, so they now run as a
luminance sequence, light to dark. Keep the order — it reads as a scale, not a rainbow.
Where two categories sit next to each other and still need separating, add a difference
in weight or opacity rather than reaching for a colour.

---

## 4. Two SVG families — pick the right one

The most common way to get this wrong.

**Themable** (`*-themable.svg`, `*-currentcolor.svg`) use `currentColor` and
`var(--nl-accent)`. They only work when the SVG markup is **inline in the HTML
document**. Pasted into `<img src="…">`, `background-image`, or `<object>`, the SVG
becomes an isolated document: the page's custom properties can't reach it,
`currentColor` falls back to black, and the logo vanishes on a dark background.

**Fixed-colour** (`mark-metal.svg`, `mark-silver.svg`, …) have literal values baked in.
Use these for `<img>`, CSS backgrounds, email, README badges.

Inline the themable mark for the site. It's ~1 KB, no extra request, and one CSS variable
rethemes it per section.

**Note on ids:** each themable SVG carries its own `<linearGradient id="nlSilver">`. If
you inline the mark twice on one page, that id is duplicated. Browsers use the first
definition and it still renders correctly — but if a bundler or linter complains, inline
it once and `<use>` it, or give the second copy a different id.

## 5. Implementation

Copy `web/mark`, `web/wordmark`, `web/icons`, `web/social` into the public directory.
`web/snippets` is reference material, not deployable assets.

**Nav and hero — the mark.** Paste `snippets/mark-inline.html` into the markup:

```css
.nl-mark {
  height: 28px; width: auto; display: block;
  color: var(--text);                /* the two bars */
  /* rings default to the gradient inside the SVG */
}
.nl-mark--nav   { height: 26px; }
.nl-mark--hero  { height: 120px; }
.nl-mark--small { --nl-accent: var(--silver); }   /* flat below ~28px */
.section--light .nl-mark { color: var(--bg); --nl-accent: var(--gunmetal); }
```

Set **height only** and let width follow — the SVG has an intrinsic aspect ratio, and
fixing both squashes it.

**Where the wordmark goes instead.** Anywhere the name has to be readable without prior
knowledge — the footer, an invoice header, an email signature, a slide title. Use
`snippets/wordmark-inline.html` and `.nl-wordmark`. Do not put it on the same surface as
the mark.

**Head.** `snippets/head.html` is ready to paste. It assumes `/icons/` and `/social/`;
set the `og:image` to an absolute URL — scrapers reject relative paths.

**React.** `snippets/NullLimitMark.jsx`, drop-in, `height` prop.

**CSS.** `snippets/tokens.css` is the palette; `snippets/metal.css` has the metallic
text, border, rule, panel and button treatments plus the logo classes.

## 6. Sizing

| Asset | Minimum | Notes |
|---|---|---|
| Mark | 24px / 9mm | below this the ring counters close and it reads as two dots |
| Mark, small cut | 16px / 6mm | `mark-small-silver.svg` — wider rings, lighter stroke |
| Wordmark `null;` | 110px / 26mm | |

Clear space around either asset: **one ring diameter**, all four sides.

## 7. Files

```
web/
  mark/        THE PRIMARY ASSET
               mark-{metal,metal-onlight,silver,silver-onlight,white,black,steel,platinum}.svg
               mark-themable.svg          currentColor + var(--nl-accent), inline only
               mark-themable-flat.svg     same, flat accent default
               mark-currentcolor.svg      single colour, follows currentColor entirely
               mark-small-silver.svg      the small cut, for under 24px
               mark-square-*.svg          square viewBox, for avatars and tiles
               mark-badge-{circle,rounded}-{dark,light}.svg
               mark-{metal,silver,white,black}-{24…512}.png
               avatar-{circle,rounded}-{400,800}.png
  wordmark/    THE ALTERNATIVE
               wordmark-null-*.svg        null;
               wordmark-null-limit-*.svg  null;limit
               matching @1x/@2x/@3x PNGs
  icons/       favicon.ico, favicon.svg, 16/32/48, apple-touch-icon-180,
               icon.svg, icon-192/512/1024, icon-maskable-512, site.webmanifest
  social/      og-image.png 1200×630, social-square.png 1200×1200
  snippets/    mark-inline.html, wordmark-inline.html,
               tokens.css, metal.css, head.html, NullLimitMark.jsx
```

Colourway meanings: `metal` = gradient rings, on dark (**the default**). `metal-onlight` =
darker gradient ramp so it survives a white background. `silver` = flat accent, safe
anywhere. `silver-onlight` = flat gunmetal on light. `white` / `black` = single colour.
`steel`, `platinum` = quieter and brighter tonal cuts.

The favicon is deliberately **flat silver, small cut** — a gradient inside 16px is mud.

`icon-maskable-512.png` keeps the art inside the central 80% so Android can crop it to any
shape. Its smaller framing is intentional.

## 8. Never

- Put the mark and the wordmark together
- Close, fill, or level the rings
- Tint the metal — it stays neutral grey; no blue, gold, or green cast
- Apply the gradient to body copy or anything under ~20px
- Re-letter the wordmark in another typeface, or rebuild it from live text
- Put a themable SVG inside `<img>` and expect the CSS to reach it
- Use `Null Limit` title-case in either mark

## 9. Contact strings, verbatim

```
vitoshi@nulllimit.gg
nulllimit.gg
nullhoops.com
github.com/dev-Charizard
Null Limit LLC
```
