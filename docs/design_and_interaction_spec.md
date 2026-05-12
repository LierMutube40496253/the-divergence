# THE DIVERGENCE — Design & Interaction Specification
## Visual reference: Coffee Talk (Toge Productions, 2020)

---

## VISUAL REFERENCE

Look at screenshots of Coffee Talk before building anything. Key observations:
- Bar/cafe setting viewed from slightly behind the counter
- Warm amber interior light against dark exterior
- Characters shown chest-up as illustrated portraits on each side
- Dialogue box at the bottom, clean and readable
- Active speaker is sharp; inactive speaker is dimmed
- Atmosphere is intimate and slightly melancholic

This project is NOT pixel art. The aesthetic is warm, illustrated, literary.

---

## COLOR PALETTE

All CSS custom properties defined in :root in style.css.

Background layers (dark world):
--bg-deep:      #080610   /* deepest — almost black with warm undertone */
--bg-mid:       #0d0b18   /* main page background */
--bg-surface:   #16121f   /* panel surfaces */
--bg-overlay:   rgba(8,6,16,0.94)   /* dialogue panels */

Character accents:
--jiho-primary:   #e8b84b   /* warm gold — Ji-ho's color throughout */
--jiho-secondary: #b8860b   /* deeper amber */
--emeka-primary:  #4a9e6b   /* natural forest green — Emeka's color */
--emeka-secondary:#2d6b45   /* deeper green */

UI chrome:
--ui-copper:    #c47a2a   /* borders, ornaments, event markers on charts */
--ui-border:    #2a1f3d   /* structural borders */
--ui-border-lt: #3d2d5a   /* lighter border for active states */

Text:
--text-primary:   #e8d9b8   /* main dialogue text — warm cream */
--text-secondary: #9a8870   /* narrator text, captions */
--text-muted:     #6a5a7a   /* chart labels, metadata */

Chart-specific:
--chart-korea:    #e8b84b   /* Korea data — always Ji-ho's gold */
--chart-nigeria:  #4a9e6b   /* Nigeria data — always Emeka's green */
--chart-oil:      #c47a2a   /* oil price, event markers */
--chart-neutral:  #6a5a7a   /* other countries, faint lines */
--chart-grid:     #1e1530   /* barely visible gridlines */

---

## TYPOGRAPHY

Two Google Fonts only. Import both in HTML head.
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Lora:ital,wght@0,400;0,500;1,400&display=swap');

Playfair Display — used for:
  Main title on intro page (bold, large, with layered text shadow)
  Chapter labels in top bar
  Character name plates in dialogue boxes
  Button text
  Chart titles inside chart frames

Lora — used for:
  All dialogue body text
  Narrator text (italic weight)
  Choice option text
  Chart axis labels and tick labels (small size)
  Descriptive captions

No pixel fonts. No sans-serif. Consistent warm serif throughout.

---

## SCREEN LAYOUT — GAME PAGE

The game page has three vertical zones:

ZONE 1: TOP BAR — fixed, thin strip at very top
  Height: 24px
  Contains: chapter label (left) + 5 chapter progress diamonds (right)

ZONE 2: SCENE AREA — everything between top bar and dialogue panels
  Contains: background image, character sprites, chart area

ZONE 3: BOTTOM PANELS — the three-box layout, fixed to bottom
  Height: 30% of viewport height, minimum 180px

---

## THREE-BOX LAYOUT (BOTTOM PANELS)

Three side-by-side boxes spanning full width.

LEFT BOX — Ji-ho's dialogue (35% width)
CENTER BOX — Player choices / narrator text (30% width)
RIGHT BOX — Emeka's dialogue (35% width)

Thin 1px separator lines between boxes (var(--ui-border) color).

Box structure (each character box):
  - Top: character name in small bold Playfair Display, in their accent color
  - Below name: small circular portrait thumbnail (40px diameter)
  - Main area: dialogue text in Lora, var(--text-primary)
  - Bottom-right corner: click-to-continue indicator (›› symbol) when active

ACTIVE box state:
  Full opacity. Border in character's accent color with a subtle inward glow
  (box-shadow: inset 0 0 12px rgba of their accent color at 20% opacity).
  Name and thumbnail fully visible.

INACTIVE box state:
  Opacity 0.28. Border barely visible. No glow. Text area empty or hidden.

CENTER BOX states:
  EMPTY: No border visible, no content. Both character boxes are active or
         the current moment has no choices.
  NARRATOR: Italic Lora text, var(--text-secondary) color, subtle border
            in var(--ui-copper). No name or portrait.
  CHOICES: See CHOICE DISPLAY section below.
  FINAL DISSERTATION: Both character boxes active simultaneously. Center box
                      shows the three final choice buttons. See ENDING section.

---

## CHARACTER SPRITES

Ji-ho stands on the LEFT of the scene area.
Emeka stands on the RIGHT of the scene area.

Both shown roughly chest-up. Height: 70–80% of the scene area height.
Image rendering: standard (not pixelated — these are illustrated portraits).

File names: jiho_neutral.png, jiho_pleased.png, jiho_quiet.png
            emeka_amused.png, emeka_sharp.png, emeka_serious.png

Expression switching is INSTANT (no transition). Swap the img src attribute
on each new dialogue node. Each dialogue node specifies the expression to use.

ACTIVE character: opacity 1.0, CSS filter drop-shadow in their accent color
  (filter: drop-shadow(0 0 16px rgba(232,184,75,0.35)) for Ji-ho)
  (filter: drop-shadow(0 0 16px rgba(74,158,107,0.35)) for Emeka)

INACTIVE character: opacity 0.32, filter: brightness(0.5) grayscale(0.3)

CHART MODE (when a chart is displayed):
  Both characters shift toward their respective edges using CSS transform translateX.
  Ji-ho: translateX(-8%). Emeka: translateX(8%).
  Both drop to opacity 0.18.
  Transition: 250ms ease-out.

When chart is dismissed: characters return to normal positions and opacity,
250ms ease-out transition.

---

## CHART AREA

Position: centered in the scene area, between the two characters.
In normal (no chart) state: invisible, display:none.

When a chart activates:
  The chart area becomes visible and slides down from slightly above its
  final position. Animation: translateY from -10px to 0, opacity 0 to 1,
  duration 200ms, ease-out.

When dismissed (player picks option D to move to next chapter):
  Fade out: opacity 1 to 0, duration 150ms. Then display:none.

Chart area frame styling:
  Background: var(--bg-surface) — dark, not white or cream
  Border: 1px solid var(--ui-copper)
  Corner ornaments: at each corner, two 10px lines forming an L-shape in
  var(--jiho-primary) color. These are CSS pseudo-elements or small divs.
  Border-radius: 2px only — almost square, slightly softened.

Chart title: small Playfair Display inside the frame, top-left,
var(--text-muted) color, uppercase, letter-spacing: 0.12em.

Chart canvas: the D3 SVG renders here. Transparent background.
All SVG text uses Lora font, very small (10–11px), var(--text-muted) color.

MULTIPLE CHARTS: The chart area can display multiple chart panels simultaneously
when the player selects options that add new panels. When a second panel appears,
the chart area expands downward to accommodate it. New panels slide in from the
bottom. Each panel has the same frame styling as the main chart.
Maximum two panels visible simultaneously (the base chart + one additional panel).
If a third panel would be needed, the oldest additional panel is removed first.

---

## CHART INTERACTION MODEL

Each chapter's chart moment has options A, B, C, and D.

INITIAL STATE when a chart appears:
  All options (A, B, C, D) are visible as buttons in the center box.
  None are selected. The chart shows its base state.

SELECTING AN OPTION:
  The player clicks option A, B, or C.
  The button gets a SELECTED visual state: filled background in var(--ui-copper),
  text color becomes var(--bg-deep), a checkmark (✓) appears before the label.
  The chart updates (see per-chart behavior in story_and_charts_spec.md).
  The speaking character's dialogue box shows their reaction text with typewriter.
  After reaction text is complete, all options remain visible.
  The player can then select another option or click D.

RE-CLICKING A SELECTED OPTION:
  Does nothing. Once selected, an option stays selected.
  The player cannot deselect options.

OPTION D:
  Always labeled "That's enough for now — what's next?"
  Clicking D dismisses the chart, plays the bridge dialogue to the next chapter,
  and advances the story. D is never marked as selected — it just triggers the advance.

MULTIPLE OPTIONS SELECTED:
  Most charts are additive: selecting A then B shows both A's addition and B's
  addition on the same chart simultaneously.
  Exception: Chart 4 (see Chart 4 special behavior below).
  Exception: Chart 1 Option B (animation) — this is a trigger, not a toggle.
  After the animation plays, the map rests at 2007. The button shows as selected.

---

## CHART 4 SPECIAL BEHAVIOR (multiple simultaneous chart panels)

Chart 4 base: Two population area charts (Korea left, Nigeria right).

Option A — Fertility rate charts:
  A SECOND ROW of charts appears BELOW the population charts.
  Two new fertility rate line charts: Korea fertility (left) Nigeria fertility (right).
  The population charts remain visible above.
  The chart area expands to show both rows simultaneously.
  This is not a swap — both rows are visible at the same time.

Option B — Per-capita impact:
  A SECOND ROW appears (or replaces existing second row if A was already selected).
  Two bar/line panels showing: GDP growth rate vs population growth rate for each country.
  If A is already selected (fertility charts showing), Option B replaces the second row
  with the per-capita panels. The population charts on top remain.

Option C — Projections:
  Projection lines (dashed) extend on the EXISTING population area charts in the
  top row — extending the time axis forward to 2050.
  Does not add a new row. Works additively on the population charts.
  Can be combined with A or B without conflict.

---

## CHART STYLING RULES (apply to all 5 charts)

Background: transparent (the chart frame background shows through)
SVG background: none

Gridlines: horizontal only (usually), color var(--chart-grid), stroke-width 0.5,
  stroke-dasharray: 3,3. Barely visible.

Axes:
  Lines: var(--ui-border-lt) color
  Tick marks: same color, small (4px)
  Tick labels: Lora font, 10px, var(--text-muted) color

Korea data: always var(--chart-korea) — warm gold
Nigeria data: always var(--chart-nigeria) — natural green
Oil price: var(--chart-oil) — copper amber, dashed line
Norway data: var(--jiho-secondary) — deeper amber, clearly distinct from Korea
Other countries (faint): var(--chart-neutral) at 30–40% opacity
Event markers (vertical lines): var(--chart-oil), stroke-dasharray: 4,3

Line charts: stroke-width 2.5px for main lines, 1.5px for secondary lines
Area charts: fill at 25% opacity of the line color, stroke at full opacity

Tooltips on hover: small dark box (var(--bg-overlay) background,
var(--ui-copper) border) showing country name and exact value.
Font: Lora 11px.

Axis labels (the descriptive labels, not tick labels): Lora, 10px italic,
var(--text-secondary) color.

Chart title: Playfair Display, 11px, var(--text-muted), uppercase,
letter-spacing 0.1em. Sits inside the frame at top-left.

---

## ANIMATIONS

Typewriter effect: letters appear one at a time at 25ms per character.
  Clicking anywhere in the active character's box during typewriting skips to
  full text. After full text appears, the ›› indicator blinks.

Character opacity/filter transitions: 200ms ease-out. Applied when speaker changes.

Chart slide-in: translateY(-10px) → translateY(0), opacity 0 → 1, 200ms ease-out.

Chart fade-out: opacity 1 → 0, 150ms ease.

Additional chart panel slide-in (bottom): translateY(8px) → 0, opacity 0 → 1,
  180ms ease-out.

Choice buttons fade in with stagger: each button fades in 80ms after the previous.
  Total: button 1 at 0ms, button 2 at 80ms, button 3 at 160ms, button 4 (D) at 240ms.
  Each fade: opacity 0 → 1, translateY(4px) → 0, 150ms ease-out.

Chart 5 life expectancy lines: draw in from left to right using stroke-dashoffset
  technique. Duration: 3000ms (3 seconds, slow and deliberate). Both lines draw
  simultaneously. After drawing completes, pause 3 seconds. Then the annotation
  appears (fade in, 500ms).

Chart 1 animation (1952→2007): 
  A D3 transition that updates the choropleth colors through each 5-year increment.
  Total duration: 4000ms. Each year step: 300ms transition.
  A year label in the top-right of the map updates showing the current year.
  The animation plays once when triggered and stops at 2007.

Button hover states: instant (no transition). Background fills with var(--ui-border-lt).
  Cursor pointer. No smooth color transitions — hard state change.

Selected option button: instant state change. Background becomes var(--ui-copper).
  Text becomes var(--bg-deep). ✓ appears before label text.

Title glitch on intro page: every 12 seconds, the title shifts 2px right for 80ms,
  then 2px left for 80ms, then returns. Subtle — just enough to feel alive.

---

## INTRO PAGE

Full viewport. Background: bar_interior.png scaled to cover, darkened with a
  CSS overlay (background-color: rgba(8,6,16,0.55) over the image).

Centered content (vertically and horizontally):
  1. "THE DIVERGENCE" in Playfair Display bold, large (clamp 28px to 52px).
     Color: var(--jiho-primary). Text shadow: 3px 3px 0 var(--jiho-secondary),
     6px 6px 0 rgba(8,6,16,0.8). Apply title-glitch animation.
  2. Subtitle: "A tale of two economists" — Playfair Display italic, smaller,
     var(--ui-copper) color.
  3. Decorative rule: a 1px horizontal line with a small diamond shape in center.
     Both elements in var(--ui-border-lt). Full line: 200px max-width.
  4. Description: 2–3 sentences in Lora, small, var(--text-secondary).
     "Korea and Nigeria shared the same GDP per person in 1952. Within one lifetime,
     they became worlds apart. Two economists. Five charts. One question."
  5. BEGIN button: Playfair Display bold, var(--bg-deep) text on var(--jiho-primary)
     background. Border: 2px solid var(--jiho-secondary). Padding: 10px 32px.
     Corner bracket ornaments (CSS only — 8px L-shapes at each corner in
     var(--jiho-primary)). href="game.html".
  6. Five chapter progress diamonds: small squares rotated 45 degrees, 10px × 10px.
     Incomplete: var(--ui-border) fill, var(--ui-border-lt) border.
     Complete (read from localStorage key "divergence_chapter_N_complete"):
     var(--jiho-primary) fill.

Character portraits (Ji-ho left edge, Emeka right edge) at 15% opacity,
fading in from the sides. They are present but very subtle — just suggesting
who the story is about.

---

## ENDING PAGE

Receives ?end=A, ?end=B, or ?end=C via URL parameter.

Layout: Two-column.
  Left column (30–35% width): winning character's portrait, large, full height.
    Ending A: Ji-ho portrait (jiho_pleased.png), glow effect in var(--jiho-primary)
    Ending B: Emeka portrait (emeka_sharp.png), glow in var(--emeka-primary)
    Ending C: Both portraits, smaller, side by side. Neutral glow in var(--ui-copper)

  Right column: ending content
    - Ending label: "ENDING A · JI-HO'S ARGUMENT" — tiny Playfair Display,
      var(--text-muted), letter-spacing 0.25em, with decorative lines either side.
    - Quote: the ending quote in large italic Lora (see story_and_charts_spec.md).
      Color: winning character's accent color.
    - Decorative rule with diamond.
    - Three key numbers: 11× (wealth gap), 32 yrs (life expectancy gap), 1952 (start).
      Large Playfair Display bold in var(--jiho-primary). Small Lora labels below.
    - REPLAY button: same corner-bracket style as BEGIN button.
      Click: clear localStorage, navigate to index.html.
    - NOTEBOOK button: muted style, links to the explainer notebook.

---

## FINAL DISSERTATION (before the ending)

After Chart 5's options are explored and the player clicks D, both character boxes
activate SIMULTANEOUSLY — this is the only moment in the game where both boxes
show text at the same time. Ji-ho's box shows his final argument. Emeka's box shows
his final argument. Both use typewriter effect but start at the same time.

When both finish typing, the center box activates with three options:
  [A] "Ji-ho is right — disciplined choices and consistent policy are the answer."
  [B] "Emeka is right — structural barriers shaped this more than internal choices."
  [C] "Both of you are partially right. The truth is somewhere between."

Player's selection navigates to ending.html?end=A, ending.html?end=B, or ending.html?end=C.

---

## BUILD ORDER

1. CSS foundation: all variables, Google Fonts, base reset, dark background.
2. Intro page: static HTML, title, subtitle, rule, description, BEGIN button,
   chapter diamonds. No JavaScript yet.
3. Game page HTML skeleton: top bar, scene area with sprite placeholders,
   three bottom boxes with placeholder text.
4. Engine.js basics: load one hardcoded dialogue node, display in Ji-ho's box
   with typewriter effect.
5. Click-to-advance: clicking active box advances to a second hardcoded node in
   Emeka's box. Confirm box opacity switching works.
6. Portrait images: sprites display correctly, expression swapping works on node change.
7. Choice display: center box shows hardcoded options A/B/C/D with correct styling.
   Clicking an option marks it as selected. Clicking D advances story.
8. Chart area: the chart frame appears and disappears correctly with animation.
   Load Chart 2 (dual GDP line) as first test — no interactivity yet, just display.
9. Chart interactivity: Chart 2 options A and B add lines to the chart when selected.
10. All 5 base charts: build the base state of all five charts displaying correctly.
11. All chart options: build all A/B/C modifications for all five charts including
    Chart 4's dual-panel behavior and Chart 1's choropleth animation.
12. Full story: import story.js with all dialogue, run complete playthrough.
13. Chapter progress: save to localStorage, verify intro diamonds update.
14. Final dissertation: both boxes active simultaneously, center box shows final options.
15. Ending page: all three variants, correct portrait and text per ending.
16. Polish: all animations, spacing, font size checks, deploy to GitHub Pages.
