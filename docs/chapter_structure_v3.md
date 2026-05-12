# THE DIVERGENCE — Chapter Structure v3
## Enhanced Chapter Specification: Plots, Insights & Dialogue Direction

---

## OVERALL ASSESSMENT

The three-chapter structure is stronger than the previous five-chapter plan.
Fewer chapters, sharper focus, cleaner causal chain:

  Chapter 1 → WHAT happened (the divergence)
  Chapter 2 → WHY economically (export structure, oil dependency)
  Chapter 3 → HOW humanly (demographics, education, gender)

Each chapter earns the next. The 1997 Asian Financial Crisis comparison is
the most concrete, specific analytical moment in the whole project — keep it.
The volatility argument (Option B, Chapter 1) is analytically strong and
underused in development economics storytelling. The gender gap angle in
Chapter 3 is original and surprising. Overall this is a much tighter story.

One flag: Chapter 2 needs World Bank export CSVs (the files you downloaded).
Chapter 3 needs fertility rate data — available in the Gapminder package
as a separate dataset, or from the World Bank SE.SEC.ENRR indicator.

---

---

## CHAPTER 1 — THE DIVERGENCE
### *"They started equal. Then something happened."*

---

### Core Insight

In 1952, South Korea and Nigeria had almost identical GDP per capita (~$1,050).
By 2007, Korea was 11× richer. But the divergence did not happen overnight —
it accelerated in a specific window (1965–1985) that coincides precisely with
Korea's industrialisation drive and Nigeria's oil dependency trap. The line chart
makes this visible in a way no other chart type can.

---

### Main Plot — GDP per Capita Line Chart (1952–2007)

**Type:** Line chart
**X axis:** Year (1952–2007, every 5 years from Gapminder)
**Y axis:** GDP per capita (USD)
**Lines:** Korea (gold, C_KOREA) and Nigeria (green, C_NIGERIA)
**Data source:** Gapminder — `gap[gap['country'].isin(['Korea, Rep.','Nigeria'])]`

Both lines start close together in the lower left. Korea's line stays near
Nigeria's until the mid-1960s, then begins a steady, steep climb. Nigeria's
line rises modestly during the oil boom (1967–1980), then collapses back
toward its starting point after the 1982 oil crash and never meaningfully
recovers. By 2007 the gap between the two lines is the width of the chart.

**Base state:** Both lines drawn clean, no highlights, no annotations.
The chart speaks for itself — two lines that started together and ended
worlds apart.

---

### Option A — The Moment of Divergence

**What the chart does:**
A vertical shaded band highlights the period 1965–1980 as the critical
window when the lines separate. A clear annotation marks 1967 ("Nigeria
begins oil exports") and 1962 ("Korea's First Five-Year Plan"). These two
events, happening at almost the same moment in history, explain the fork.

**Insight being shown:**
The lines diverge not because of a single dramatic event but because both
countries made a structural choice at the same moment in history. Korea chose
to build. Nigeria chose to extract. The shaded band makes this fork visible.

**Dialogue direction:**
Ji-ho and Emeka look at the chart together for the first time.
Ji-ho points at the fork in the lines: *"That window. Right there.
That is where the story actually begins."*
Emeka does not disagree. He just says: *"The question is what was
happening inside that window."* — which is exactly what the next
chapter will show. Option A sets up the rest of the story.

---

### Option B — The Volatility Gap

**What the chart does:**
The base line chart remains but gains a secondary element: a rolling
variance or standard deviation band around each country's GDP growth rate.
The band around Nigeria's line is visibly wider — its growth was 4× more
volatile than Korea's. Korea's line has a narrow, tight confidence band
showing remarkably stable, consistent growth. Nigeria's band is wide,
erratic, suggesting an economy completely at the mercy of external forces.

Alternatively (simpler to build): show the annual GDP GROWTH RATE as
a separate bar chart panel below the main line chart, so the reader
can see Korea's consistently positive bars vs Nigeria's dramatic spikes
and crashes.

**Insight being shown:**
It is not just that Korea grew faster — it is that Korea grew
consistently. Predictable growth allows firms to invest, banks to lend,
families to plan. Nigeria's volatility made long-term investment nearly
impossible. A country cannot build a semiconductor industry on an economy
that might shrink 15% next year.

**Dialogue direction:**
Emeka: *"Look at the width of that band. Our economy was not just poorer —
it was unpredictable. You cannot build anything on ground that shifts
every time oil prices move in Texas."*
Ji-ho, studying the chart: *"The variance is striking. Nigeria's GDP growth
had a standard deviation four times Korea's. Four times."*
Emeka: *"And yet people still call it our fault for not investing more."*

---

### Option C — The Oil Argument

**What the chart does:**
No new chart element. The original line chart stays on screen.
This is a pure dialogue moment — the chart serves as backdrop.

**Dialogue direction:**
This is the confrontational moment. Ji-ho has been building to it.

Ji-ho, with a slight smile: *"You had oil. We had nothing.
No resources. No land. No natural advantages. And yet—"*
he gestures at the chart.

Emeka, cutting him off: *"You think the oil helped us."*

Ji-ho: *"Didn't it? You had revenue we could only dream of."*

Emeka: *"That oil was the reason we didn't develop. Not in spite of it —
because of it. When you find something the world will pay any price for,
you stop building everything else. Why make shoes when you can drill?
Why train engineers when the money just flows out of the ground?"*

Ji-ho, quieter: *"The Dutch Disease."*

Emeka: *"The Dutch Disease. Exactly. And we will show you
exactly what that looked like."*

→ Transition to Chapter 2.

---

### Data needed: Chapter 1
- Gapminder package (`from gapminder import gapminder as gap`)
- No additional downloads required

---

---

## CHAPTER 2 — THE EXPORT COMPLEXITY PARADOX
### *"What you sell to the world is what you become."*

---

### Core Insight

Korea and Nigeria did not just grow at different rates — they built
completely different economic structures. Korea's export basket in 1962
was mostly raw agricultural goods. By 1987 it was mostly manufactured
goods. By 2007 it was mostly electronics and high-tech products. Each
decade Korea moved up the value chain. Nigeria's export basket in 1962
was mostly agricultural goods. By 1977 it was 96% oil. By 2007 it was
still 96% oil. The contrast is not subtle — it is total.

The consequence of this structural difference is not just about wealth.
It is about resilience. A country that makes microchips can absorb an
oil price shock. A country that exports nothing but oil cannot.

---

### Main Plot — Side-by-Side Stacked Bar Charts

**Type:** Two stacked bar charts, side by side (Korea left, Nigeria right)
**X axis:** Selected years: 1962, 1972, 1982, 1992, 2002, 2007
**Y axis:** % of total merchandise exports (0–100%)
**Categories (stacked):**
  - Agriculture / Raw Materials (green)
  - Manufactures (gold/amber)
  - Fuel / Oil (orange-red)
  - Other (grey)
**Data source:** World Bank export CSVs:
  TX.VAL.MANF.ZS.UN (manufactures)
  TX.VAL.FUEL.ZS.UN (fuel)
  TX.VAL.AGRI.ZS.UN (agriculture)

**What it shows at a glance:**
Korea's chart looks like a staircase — agriculture shrinks, manufactures
grow, the stack changes dramatically decade by decade. Nigeria's chart
looks like a wall — oil (orange-red) swallows everything by 1977 and
stays dominant for the next 30 years. Two countries, same time period.
One moving, one frozen.

**Base state:** Both charts shown together, no highlights, no animation.
The contrast is immediately visible.

---

### Option A — The Animated Staircase vs The Wall

**What the chart does:**
The static stacked bar charts become animated — bars build year by year
from 1962 to 2007, showing the structural change accumulating over time.
For Korea, the viewer watches manufactures (gold) steadily consume the
agriculture (green) share, and then electronics emerge. For Nigeria,
the viewer watches oil (orange-red) swallow everything after 1967 and
never let go.

**Implementation note:** In the notebook this is a static sequence of
the same chart at key years shown as small multiples. In the website
version (Claude Code) this becomes a true animation with a play button.

**Insight being shown:**
The transformation of Korea's export structure was not accidental —
it was deliberate and sequential. Each Five-Year Plan targeted a
new export category. Nigeria's transformation was also not accidental —
oil's profitability made every other sector uncompetitive.

**Dialogue direction:**
Ji-ho is enjoying this chart. A little too much.
Ji-ho: *"Watch Korea's bar. Every ten years, a new color grows.
Textiles. Steel. Ships. Semiconductors. Each decade we climbed
one rung higher."*

Emeka: *"And watch Nigeria's bar. After 1977 — nothing changes.
Because nothing needed to change, apparently."*

Ji-ho: *"Apparently."*

Emeka, sharply: *"You think we did not try to diversify.
You think we did not have economists telling us exactly this.
Let me show you what happened every time we tried."*

→ Option B.

---

### Option B — The Shield vs The Exposure

**What the chart does:**
New chart replaces the stacked bars. A dual-panel line chart:

LEFT PANEL — GDP growth rate over time (1970–2007) for both countries.
Two key crisis events are marked:
  - 1997: Asian Financial Crisis (dashed vertical line, labeled)
  - 1982 and 1998: Major oil price crash years (shaded bands)

Korea during 1997: GDP growth drops sharply (dips to around -6%)
then recovers fully within 2 years. The recovery is visible and
dramatic.

Nigeria during 1982 oil crash: GDP collapses and does not
return to pre-crash levels for over a decade. During 1998 oil drop:
same pattern.

RIGHT PANEL — Oil price (USD/barrel) on same x axis for context,
showing that Nigeria's crashes align perfectly with oil price drops
while Korea's 1997 crash aligns with a currency crisis unrelated to oil.

**Insight being shown:**
Korea's diversified economy meant that even a severe financial crisis
was survivable and temporary. Nigeria's oil dependency meant that
global commodity markets — over which Nigeria had zero control —
determined whether Nigerians ate well or not. This is not a management
failure. It is a structural vulnerability that oil wealth itself created.

**Dialogue direction:**
Emeka: *"1997. The Asian Financial Crisis. Korea's GDP fell 6%
in a single year. Look at what happened next."*
Ji-ho: *"We recovered in two years. Painful, but temporary."*
Emeka: *"Now look at Nigeria in 1982. Same size crash.
We did not recover in two years. We did not recover in ten years.
Because we had nothing else to fall back on."*
Ji-ho, more carefully now: *"The difference is the buffer."*
Emeka: *"The difference is everything we didn't build
while the oil money was flowing."*

---

### Option C — Conclusion and Bridge

**What the chart does:**
Return to the main stacked bar chart, but now both countries are shown
simultaneously on the same chart as a comparison, rather than side by side.
A simple final annotation summarises the gap:
Korea 2007: 91% manufactured exports.
Nigeria 2007: 96% fuel exports.

**Insight being shown:**
The export structure is not just a symptom — it is the mechanism.
Korea's export complexity forced it to build institutions, train workers,
and invest in technology. Nigeria's oil exports required none of that.
The next chapter shows what this meant for the people living through it.

**Dialogue direction:**
Brief. Both economists look at the comparison chart quietly.
Ji-ho: *"One economy was forced to become more complex every decade.
The other was allowed to stay simple."*
Emeka: *"Allowed. That is one word for it."*
Both pause.
Emeka: *"But here is the part that keeps me up at night.
It is not just about what was exported. It is about who was doing the work.
And who was not."*

→ Transition to Chapter 3.

---

### Data needed: Chapter 2
- World Bank TX.VAL.MANF.ZS.UN (manufactures % of exports)
- World Bank TX.VAL.FUEL.ZS.UN (fuel % of exports)
- World Bank TX.VAL.AGRI.ZS.UN (agriculture % of exports)
- Oil price data (hardcoded in charts.js or from FRED CSV)
- Gapminder GDP growth rate (calculated from gdpPercap year-over-year)

---

---

## CHAPTER 3 — THE DEMOGRAPHIC DIVIDEND vs BURDEN
### *"An economy is just people. Which people, doing what?"*

---

### Core Insight

Korea's economic miracle was not just about policy — it was about people.
As Korea's economy grew, families had fewer children. As families had fewer
children, more resources went to each child — better nutrition, better
schooling, better health. Those better-educated children entered the workforce
and made the economy grow faster. And critically: Korea put all of its people
to work — men and women — doubling the effective workforce that could staff
those factories and offices.

Nigeria's story ran in the opposite direction. Oil wealth removed the economic
pressure to educate or employ women. Population grew faster than the economy.
Each dollar of oil revenue had to be divided among more people every year.
The demographic dividend never arrived because the conditions that trigger it —
broad education, female workforce participation, deliberate family planning —
were never created.

---

### Main Plot — Connected Scatter Plot (Fertility vs Life Expectancy)

**Type:** Connected scatter plot — also called a trajectory plot.
This chart type has NOT been used in any previous chapter.

**What it is:** A scatter plot where X = fertility rate (children per woman)
and Y = life expectancy. Each dot is one 5-year observation. The dots are
connected in chronological order by a line, creating a PATH through time.
The direction of the path (left = fertility falling, up = life expectancy
rising) tells the demographic transition story visually.

**Two paths on one chart:**
Korea's path: starts in the upper-right (high fertility ~6, moderate
life expectancy ~47) and moves dramatically left and up over 55 years,
ending at lower-left (fertility ~1.3, life expectancy ~79).
The path is long and sweeping — a full demographic transition.

Nigeria's path: starts similarly (high fertility ~6.9, low life
expectancy ~36) but barely moves. The path is short and upward
(life expectancy improved somewhat) but almost completely fails to
move left (fertility barely declined). Nigeria in 2007 looks like
Korea in 1955 on this chart.

**Why this chart type:**
The connected scatter plot is perfect for showing how two variables
evolve together over time for specific entities. It is more informative
than two separate line charts because it shows the RELATIONSHIP between
fertility and life expectancy as it changes — the demographic transition
theory visualised directly. It is visually distinctive and memorable.

**Data source:**
Fertility rate: Gapminder supplementary data or World Bank SP.DYN.TFRT.IN
Life expectancy: Gapminder main dataset (lifeExp column)

---

### Option A — The Gender Engine

**What the chart does:**
A new dual-panel chart appears.

LEFT PANEL: Female labour force participation rate over time
(Korea vs Nigeria, 1960–2007). Korea's female participation
rises from ~35% in 1960 to ~50% by 2000. Nigeria's stays low
and changes little.

RIGHT PANEL: A simple dumbbell plot for a key year (1990).
For each country, one dot for male enrollment, one dot for female
enrollment in secondary education, connected by a line.
Korea: male 93%, female 90% — almost no gap.
Nigeria: male 31%, female 17% — a 14 percentage point gap.

**Insight being shown:**
Korea did not just have more workers — it had twice as many effective
workers per family because it brought women into the economy. This is
not a soft social story. It is hard economics: doubling the productive
workforce at the same labour cost is the most powerful growth engine
available to a developing economy. Nigeria's gender gap in education
and workforce participation meant it was operating at effectively
half-capacity.

**Dialogue direction:**
Ji-ho: *"When Korea built those factories in the 1970s, half the
workers on the floor were women. That was not an accident.
It was a deliberate strategy — more workers, smaller families,
more savings per household."*
Emeka: *"Nigeria had the same women. We just did not put them
to work in the same way. And the education gap — by 1990,
a Nigerian girl was half as likely as a Nigerian boy to be
in secondary school."*
Ji-ho: *"That is not just an inequality problem.
That is an economic problem."*

---

### Option B — The Education Outlier

**What the chart does:**
A horizontal dot plot. X axis: secondary school enrollment rate (%).
Each dot is one country, circa 1990. Countries are sorted from
lowest to highest. Korea's dot is labeled and highlighted in gold
at the far right of the distribution — 91%.
Nigeria's dot is labeled and highlighted in green, stuck in the
middle-left cluster at 24%.
A vertical reference line marks the Scandinavian average (~95%).

Key visual moment: Korea's dot is closer to Denmark and Sweden
than it is to its fellow developing nations from 1950.
Nigeria's dot sits with the poorest-performing African countries.

**Insight being shown:**
By 1990, Korea had effectively solved its education problem.
Its secondary enrollment rate was comparable to wealthy European
nations — not to the developing-world peers it had been grouped
with 40 years earlier. This was not accidental. It was the result
of mandatory education, massive public investment, and a cultural
emphasis on academic achievement that the government deliberately
cultivated. Education was Korea's second industrial policy.
Nigeria's enrollment rate reflects a country where oil revenue
removed the urgency to build human capital.

**Dialogue direction:**
Ji-ho: *"By 1990, we were not comparing ourselves to Thailand
or Ghana anymore. We were comparing ourselves to Germany.
That is how much distance we had covered in forty years."*
Emeka: *"And Nigeria in 1990 — we are there, in that cluster
on the left. With countries that had none of our oil wealth.
We had the money to build those schools. Every economist
will tell you that."*
Ji-ho: *"So why didn't you?"*
Emeka, long pause: *"Because the money came too easily.
And things that come too easily do not build institutions.
They hollow them out."*

---

### Option C — The Conclusion

**What the chart does:**
Return to the connected scatter plot from the main chart.
But now add a third trajectory in light grey: the average
trajectory of all other developing nations that successfully
completed the demographic transition (South-East Asian average,
Latin American average). This shows that Korea's path was
exceptional even among successful transitions — and that Nigeria
is the outlier in the opposite direction.

A final annotation appears: a single text box summarising
the compounding effect:
"Korea: fertility halved → workforce doubled → education
investment per child tripled → GDP per capita ×22.
Nigeria: fertility unchanged → workforce growth absorbed
by subsistence → oil revenue divided among 4× more people."

**Dialogue direction:**
This is the final moment before the ending.
Both economists look at the chart. Neither speaks immediately.

Emeka: *"You know what this chart shows me?
It is not that we were unlucky. It is that every advantage
we had — the oil, the people, the land —
we found a way to turn it into a constraint."*

Ji-ho, quietly: *"And every constraint we had —
no resources, no land, a war that destroyed everything —
we found a way to turn it into a reason to build."*

Emeka: *"Is that the lesson? Is that what you want
the person reading this to walk away with?"*

Ji-ho: *"I want them to walk away with the data.
And their own conclusion."*

→ Final player choice → Ending.

---

### Data needed: Chapter 3
- Fertility rate: World Bank SP.DYN.TFRT.IN or Gapminder supplementary
- Life expectancy: Gapminder main dataset
- Female labour force participation: World Bank SL.TLF.CACT.FE.ZS
- Secondary school enrollment (total, male, female):
    World Bank SE.SEC.ENRR, SE.SEC.ENRR.MA, SE.SEC.ENRR.FE
- For the dot plot comparison countries: same SE.SEC.ENRR for ~30 nations

---

---

## CHART TYPE SUMMARY — ALL CHAPTERS

| Chapter | Main Plot | Option A | Option B | Option C |
|---------|-----------|----------|----------|----------|
| 1 | Line chart (GDP over time) | Annotated line (fork highlight) | Line + variance/growth rate bars | Same chart (dialogue only) |
| 2 | Stacked bar × 2 (export composition) | Animated/small-multiples bars | Dual-panel line (crises + oil price) | Combined comparison bar |
| 3 | Connected scatter (fertility vs life exp) | Dumbbell + line (gender gap) | Dot plot (education distribution) | Connected scatter + trajectories |

No chart type is repeated across main plots.
The connected scatter (Chapter 3) has not appeared anywhere in
Assignments 1 or 2, making it genuinely novel for this project.

---

## PLOT STYLE REFERENCE

All plots must match Assignment 1 and Assignment 2 visual style:
- Background: #f9f9f9
- No top or right spines
- Grid: light grey (#e0e0e0), linewidth 0.8
- Font: default matplotlib (DejaVu Serif or Sans)
- Colors: C_KOREA=#e8b84b, C_NIGERIA=#4a9e6b, C_USA=#c0392b, C_OTHER=#c8c6cc
- Libraries used: matplotlib, seaborn (for heatmaps), plotly (for
  interactive charts), folium (for any maps)
- Info boxes: placed using ax.transAxes coordinates, bottom-right corner,
  no arrow lines connecting to dots

---

## MY ASSESSMENT — DOES THIS HOLD TOGETHER?

**What is excellent:**
The causal chain is now airtight. Chapter 1 shows WHAT happened.
Chapter 2 explains WHY through the economic structure. Chapter 3 shows
HOW it manifested in human terms. Each chapter's Option C explicitly
bridges to the next chapter's question, creating genuine narrative momentum.

The 1997 Asian Financial Crisis comparison (Chapter 2, Option B) is
the strongest single analytical moment in the project — it is specific,
measurable, and directly answers the "so what?" question about export
diversity. Do not cut this.

The connected scatter plot (Chapter 3 main) is the most visually
original chart in the project and perfectly suited to the demographic
transition story. It will stand out to a grader who has seen fifty
line charts and bar charts.

**One concern:**
The World Bank export data needs to be loaded and cleaned carefully.
The CSV files from the World Bank come in wide format (years as columns)
and need melting. Make sure this is done before the plotting begins.

**The dialogue direction is right:**
Emeka's final line — *"things that come too easily do not build
institutions, they hollow them out"* — is the thesis of the entire
project expressed in one sentence. It is what the data shows.
Everything else in the story is evidence for that sentence.
