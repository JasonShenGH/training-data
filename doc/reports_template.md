## Output Format Guidelines

AI systems should structure athlete reports consistently.  
See templates and examples below for annotated reference.

**Pre-Workout Reports must include:**
- Readiness assessment (HRV, RHR, Sleep vs baselines)
- Load context (TSB, ACWR, Load/Recovery, Monotony if elevated)
- Capability snapshot (Durability 7d mean + trend; TID drift if not consistent)
- Today's planned workout (or rest day + next session preview)
- Go/Modify/Skip recommendation with rationale

**Post-Workout Reports must include:**
- One-line session summary
- Completed session metrics (power, HR, zones, decoupling, VI, TSS vs planned)
- Plan compliance assessment
- Weekly running totals (polarization, durability 7d/28d + trend, TID 28d + drift, CTL, ATL, TSB, ACWR, hours, TSS)
- Interpretation (2-4 sentences: compliance, key quality observations, load context, recovery note)

**Weekly Reports must include:**
- Session breakdown with compliance status (✅/⚠️/❌)
- Quality session detail (top 2-3 intensity sessions: target vs actual, decoupling, VI)
- Polarization with Grey Zone and Quality tracking, plus TID 7d and TID 28d with drift status
- Durability subsection (7d/28d mean(X) counts, trend, high-drift count)
- Fitness deltas (CTL, ATL, TSB start → end with Δ)
- ACWR with acute/chronic components shown
- Wellness trends with directional arrows and threshold labels
- Section 11 flags (surfaced immediately, not deferred to block)

**Block Reports must include:**
- Week-by-week volume progression with CTL trajectory
- Compliance with reasons for misses/modifications
- Key performance markers with target comparison
- Polarization by week (catches grey zone creep), plus TID 28d as block-scale classification
- Durability by week (catches aerobic efficiency regression across the block)
- Wellness block-over-block comparison with assessment labels
- Phase Progression Check (criteria met Y/N, recommendation, rationale)
- Next block plan with specific targets



## Report Types

### Pre-Workout Briefing (~15-20 lines)
Generated **before** a planned session. Includes:
- Weather and coach note (optional, if location known)
- Current readiness (HRV, RHR, Sleep vs baselines)
- Load context (TSB, ACWR, Load/Recovery, Monotony if > 2.3)
- Capability snapshot (Durability 7d mean + trend; TID drift if not consistent)
- Planned workout summary (target power/HR, duration, TSS)
- Go/Modify/Skip recommendation with rationale

### Post-Workout Analysis (~25-30 lines)
Generated **after** a completed session. Includes:
- Execution summary (actual vs planned)
- Key metrics (power, HR, decoupling, VI, carbs)
- Zone distribution (Grey Zone and Quality tracking)
- Load impact (updated CTL, ATL, TSB, weekly totals)
- Capability update (Durability 7d/28d + trend, TID 28d + drift in weekly totals)
- Coaching interpretation

### Weekly Summary (~35-45 lines)
Generated **end of training week** (Saturday or Sunday morning). Includes:
- Session breakdown with compliance status for every day
- Quality session detail for top 2-3 intensity sessions
- Polarization (Z1+Z2, Grey Zone, Quality) with TID 7d and TID 28d + drift status
- Durability subsection (7d/28d mean(X) counts, trend, high-drift count)
- Fitness deltas with ramp rate and ACWR breakdown
- Wellness trends with week-over-week comparison and directional labels
- Section 11 flags triggered during the week
- Next week preview with any planned modifications

### Block Report (~45-60 lines)
Generated **end of each 3-5 week block**. Includes:
- Week-by-week volume and CTL progression
- Compliance summary with reasons for modifications
- Performance marker tracking (sweetspot, VO2max, decoupling trends)
- Polarization by week to catch grey zone creep, plus TID 28d as block-scale classification
- Durability by week to catch aerobic efficiency regression across the block
- Wellness block-over-block comparison with assessment labels
- Phase Progression Check with explicit criteria evaluation
- Next block plan with targets and key changes

---

## Brevity Rule

These templates follow Section 11's brevity principle:
- **Normal metrics:** Brief — 2-3 sentence interpretation + key data
- **Threshold breach:** Detailed — full analysis with recommendations
- **Rest day:** Minimal — confirm recovery status, preview next session
- **Athlete asks "why":** Deep dive on specific area

---

## Conditional Fields

Some fields appear only when relevant:
- **Weather:** Include if athlete location is available via profile or memory
- **Monotony:** Include only if > 2.3; omit entirely when normal
- **Load/Recovery tolerance note:** Include only when within 0.2 of threshold
- **Coach notes** (brief contextual tips) are encouraged to humanize recommendations
- **Quality Session Detail (weekly):** Cap at 2-3 key sessions; if 4+ hard days, prioritize most notable



# Report Hierarchy Overview

Section 11-compliant AI coaching reports follow a layered structure. Each level builds on the one below it.

---

## Report Types & Length Norms

| Report Type | Trigger | Target Length | Purpose |
|-------------|---------|---------------|---------|
| **Pre-Workout** | Before each session | ~15-20 lines | Readiness check, Go/Modify/Skip |
| **Post-Workout** | After each session | ~25-30 lines | Session analysis, execution quality |
| **Weekly** | End of training week | ~35-45 lines | Compliance, trends, weekly fitness delta |
| **Block** | End of 3-5 week block | ~45-60 lines | Phase assessment, progression decision |

---

## Information Flow Between Reports

```
Pre-Workout → Post-Workout → Weekly → Block
    │              │             │         │
    │              │             │         └─ Phase progression decision
    │              │             └─ Aggregates post-workout data
    │              └─ Quality metrics feed weekly detail
    └─ Readiness informs session execution
```

**Key principle:** Data flows upward. Each report level summarizes and contextualizes the level below.

- **Post-Workout** metrics (decoupling, VI, target compliance) appear in **Weekly** Quality Session Detail
- **Weekly** fitness deltas (CTL, ATL, TSB) appear week-by-week in **Block** Volume Progression
- **Section 11 Flags** surface at the **Weekly** level and are summarized with resolution in **Block** reports
- **Wellness trends** use week-over-week at Weekly level, block-over-block at Block level
- **Capability metrics** (durability, EF, TID drift) appear as one-liners in Pre/Post, get full treatment in Weekly/Block:
  - **Pre-Workout:** Durability 7d mean(X) + trend (one line). EF 7d mean(X) + trend (one line). TID 28d + drift as separate line, only if not "consistent"
  - **Post-Workout:** Per-session EF. Durability 7d/28d mean(X) + trend in weekly totals. EF 7d/28d mean(X) + trend in weekly totals. TID 28d classification + drift
  - **Weekly:** Durability subsection with mean(X) counts + high-drift count. EF subsection with mean(X) counts + trend. TID 7d + TID 28d on separate lines
  - **Block:** Durability by Week with mean(X) (trajectory across block). EF by Week with mean(X) (trajectory across block). TID 28d as block-scale classification. Per-week classification conditional (only when diverging from block TID)

---

## Consistency Rules

All report types share these formatting principles:

1. **Data first, prose for interpretation only** — structured line-by-line, not bullet summaries
2. **Scannable in 30 seconds** — most important info at the top
3. **Assessment labels in parentheses** — (good), (optimal), (flag) after metrics
4. **Directional arrows** — ↑/↓/→ for trends with threshold-based labels
5. **Section 11 flags surface immediately** — never deferred to a later report
6. **Capability metrics scale with report scope** — one-liner in pre/post, subsection in weekly, by-week breakdown in block
7. **Interpretation at the end** — 2-5 sentences of coaching interpretation



# Block Report Template

**Structure only — no data. Replace `[placeholders]` with actual values.**

Generated at end of each training block (3–5 weeks).

---

## Template Structure

```
Block [X] Report ([date range])
Weeks in block: [3/4/5]
Phase: [Base Build / Threshold Development / Peak / etc.]
Phase Timeline:
  Wk 1: [phase] ([confidence])
  Wk 2: [phase] ([confidence])
  Wk 3: [phase] ([confidence])
  [Wk 4: [phase] ([confidence])]

Volume Progression:
  Wk 1: [XX.X]h / [XXX] TSS | CTL [XX.X]
  Wk 2: [XX.X]h / [XXX] TSS | CTL [XX.X]
  Wk 3: [XX.X]h / [XXX] TSS | CTL [XX.X]
  [Wk 4: deload — [XX.X]h / [XXX] TSS | CTL [XX.X]]
  Block total: [XX.X]h / [XXXX] TSS

Compliance:
  Sessions: [XX/XX] completed ([XX]%)
  Missed/modified: [list with brief reason, or "None"]

Fitness Progression:
  CTL: [XX.X] → [XX.X] (Δ [+/-X.X])
  ATL: [XX.X] → [XX.X]
  TSB: [X.X] → [X.X]
  Avg ramp rate: [X.XX]/week
  FTP: [XXX]W → [XXX]W ([change or "unchanged"])
  eFTP: [XXX]W → [XXX]W

Key Performance Markers:
  Sweetspot power: [XXX]W → [XXX]W (target: [XXX]W — [hit/miss])
  VO2max power: [XXX]W → [XXX]W (target: [XXX]W — [hit/miss])
  Long ride duration: [XhYm] → [XhYm]
  Long ride decoupling trend: [X.X]% → [X.X]% [↑/↓/→]
  Best 20-min power: [XXX]W (week [X])
  Best 5-min power: [XXX]W (week [X])

Polarization (block average):
  Z1+Z2: [XX]%
  Z3 (Grey Zone): [X]% (target <5%)
  Z4+ (Quality): [X]% (target ~20% of intensity sessions)
  TID 28d (block-scale): [Classification] (PI: [X.XX])
  Hard days/week avg: [X.X]

Polarization by Week:
  Wk 1: Z1+Z2 [XX]%, Z3 [X]%, Z4+ [X]%
  Wk 2: Z1+Z2 [XX]%, Z3 [X]%, Z4+ [X]%
  Wk 3: Z1+Z2 [XX]%, Z3 [X]%, Z4+ [X]%
  Wk 4: Z1+Z2 [XX]%, Z3 [X]%, Z4+ [X]%

Durability by Week:
  Wk 1: mean([X]) dec [X.X]%, [X] high-drift
  Wk 2: mean([X]) dec [X.X]%, [X] high-drift
  Wk 3: mean([X]) dec [X.X]%, [X] high-drift
  Wk 4: mean([X]) dec [X.X]%, [X] high-drift
  Block trend: [improving/stable/declining]

Efficiency Factor by Week:
  Wk 1: mean([X]) EF [X.XX]
  Wk 2: mean([X]) EF [X.XX]
  Wk 3: mean([X]) EF [X.XX]
  Wk 4: mean([X]) EF [X.XX]
  Block trend: [improving/stable/declining]

HRRc by Week (omit section if block total < 3 qualifying sessions):
  Wk 1: mean([X]) [XX] bpm [or "— no data" if 0 qualifying]
  Wk 2: mean([X]) [XX] bpm
  Wk 3: mean([X]) [XX] bpm
  Wk 4: mean([X]) [XX] bpm
  Block trend: [improving/stable/declining]

Wellness (block avg vs previous block):
  HRV: [XX] ms (prev block: [XX] ms) [↑/↓/→] [assessment]
  RHR: [XX] bpm (prev block: [XX] bpm) [↑/↓/→] [assessment]
  Sleep: [XhYm] (prev block: [XhYm]) [↑/↓/→] [assessment]
  Avg Feel: [X.X]/5 ([X] sessions) (prev block: [X.X]/5)
  Avg RPE: [X.X]/10 ([X] sessions) (prev block: [X.X]/10)
  Avg RI: [X.XX] (prev block: [X.XX])
  Avg Monotony: [X.XX] ([note])

Section 11 Flags During Block:
  [List each flag with date and resolution, or "None"]

Phase Progression Check:
  Block objective: [what this block was designed to achieve]
  Criteria met: [Y/N — reference Section 11 phase detection triggers]
  Phase recommendation: [Continue current / Progress to next / Extend / Insert recovery]
  Rationale: [1-2 sentences explaining why, based on metrics above]

Interpretation:
[3-5 sentences — did the block achieve its goals? What adapted?
What stalled? Recovery status entering next block. Key wins and
concerns. Block-over-block comparison where relevant.]

Next Block Plan:
  Phase: [planned phase]
  Duration: [X] weeks
  Focus: [primary training objective]
  Key changes: [what's different from this block]
  Targets: [specific metrics to hit — CTL target, FTP test date, etc.]
```

---

## Field Definitions

| Field | Source | Notes |
|-------|--------|-------|
| **Volume Progression** | Weekly hours + TSS + CTL | Week-by-week CTL shows load trajectory, not just endpoints |
| **Compliance** | Planned vs completed across block | Include reasons for misses — illness, fatigue, life |
| **Fitness Progression** | Start vs end of block | CTL delta is the headline number |
| **eFTP** | Intervals.icu estimated FTP | Track alongside formal FTP — catches drift |
| **Performance Markers** | Best efforts + target comparison | Shows whether stimulus is producing adaptation |
| **Decoupling trend** | Long ride aerobic efficiency | Improving decoupling = aerobic base building |
| **Polarization by Week** | Weekly zone distributions | Catches grey zone creep within a block. Append classification + PI only when week diverges from block-scale TID |
| **Durability by Week** | Weekly mean decoupling from steady-state sessions | VI ≤ 1.05, ≥ 90min. Shows aerobic efficiency trajectory across block |
| **Efficiency Factor by Week** | Weekly mean EF from steady-state cycling | VI ≤ 1.05, ≥ 20min. Shows aerobic fitness trajectory across block |
| **HRRc by Week** | Weekly mean HRRc from qualifying sessions | Omit entire section if block has < 3 qualifying sessions total. Weeks with 0 qualifying show "— no data". Shows recovery quality trajectory |
| **Phase Timeline** | `phase_detected` from each weekly_180d row | Shows phase stability across block — did it hold Build the whole time or flip to Overreached? |
| **TID 28d** | Block-scale Seiler classification | 28d window roughly matches block length; confirms or challenges weekly TID |
| **Wellness assessment** | Directional + threshold label | "declining — monitor" / "stable — no concern" / "improving" |
| **Avg Feel** | Activity-level average from `weekly_180d.avg_feel` | 1=Strong to 5=Weak. Omit if 0 sessions across block. Rising feel (higher number) across block = accumulating fatigue |
| **Avg RPE** | Activity-level average from `weekly_180d.avg_rpe` | 1–10 Borg scale. Omit if 0 sessions across block. Rising RPE at constant load = fatigue signal |
| **Phase Progression Check** | Section 11 phase detection criteria | Explicitly states whether block met progression criteria |
| **Section 11 Flags** | All flags triggered during block | With dates and how they were resolved |

## Assessment Labels

### Wellness Direction
| Direction | Threshold | Label |
|-----------|-----------|-------|
| ↑ >5% improvement | HRV up, RHR down | "improving" |
| → <5% change | Stable | "stable — no concern" |
| ↓ 5–10% decline | Mild drift | "declining — monitor" |
| ↓ >10% decline | Significant | "declining — flag" |

### Phase Progression Criteria (Reference)
| Current Phase | Progress When | Stay When | Regress When |
|---------------|---------------|-----------|--------------|
| Base Build | CTL target met, decoupling <5%, compliance >85% | Approaching targets, no flags | HRV declining, compliance <70%, flags triggered |
| Threshold | FTP improved or eFTP trending up, key sessions hit targets | Making progress, manageable fatigue | Stalled power, wellness declining |
| Peak | Race-specific targets met, form (TSB) improving | Still sharpening | Overreached indicators |
| Deload | Hard sessions resume, CTL stabilized, wellness restored | TSS still reduced, wellness not yet recovered | Overreached indicators persist |
| Recovery | RI >0.90, HRV baseline restored, TSB >+10 | Still recovering | N/A — extend until criteria met |
| Overreached | ACWR <1.3, monotony <2.5, wellness improving | ACWR still elevated or monotony still high | N/A — mandatory recovery until resolved |

## Notes

- **Week-by-week CTL** is critical — the trajectory tells a different story than just start/end
- **Polarization by Week** catches grey zone creep that block averages can mask
- **Durability by Week** catches aerobic efficiency regression that single-session decoupling can miss; the block trend is the headline
- **Efficiency Factor by Week** catches aerobic fitness trends that complement durability; rising EF at same intensity = improving fitness
- **HRRc by Week** shows recovery quality trajectory across the block; omit entire section if fewer than 3 qualifying sessions in the block. Individual weeks with 0 qualifying sessions show "— no data". Context-dependent: varies with exercise intensity, type, and recording conditions
- **Phase Timeline** makes phase stability visible across the block — the Phase Progression Check is more meaningful when you can see the phase held steady or oscillated
- **Phase Progression Check** makes the protocol's decision logic transparent to the athlete
- **Next Block Plan** should flow directly from the Phase Progression Check — if criteria aren't met, explain what the next block does differently
- Keep "Interpretation" to coaching interpretation — the data is already presented above
- Block reports are the most detailed report type (~45-60 lines) — this is where the deep analysis lives

## Formatting Rule

- **Durations and sleep:** Always use `_formatted` fields from JSON (e.g., `sleep_formatted`, `duration_formatted`, `total_training_formatted`). Never convert decimal `_hours` fields to display format — the formatted values are pre-calculated from raw seconds and avoid rounding errors.

# Post-Workout Report Template

> This template defines the standard output format for post-workout reports.  
> Fields in `[brackets]` are placeholders. Omit fields that don't apply to the activity type.

---

```
Data (last_updated UTC: [YYYY-MM-DDTHH:MM:SS])

[One-line summary of completed session(s) and key observation.]

Completed workout: [ActivityType] [WorkoutName]
Start time: [HH:MM:SS]
Duration: [XhYm] (planned [XhYm])
Distance: [XX.X] km
Power: [XXX] W avg / [XXX] W NP
Power zones: [XX]% Zone 1, [XX]% Zone 2
Grey Zone (Z3): [XX]%
Quality (Z4+): [XX]%
Session profile: [Classification]
HR: [XXX] avg / [XXX] max
HR zones: [XX]% Zone 1, [XX]% Zone 2
Cadence: [XX] avg
Decoupling: [X.XX]%
EF: [X.XX]
HRRc: [XX] bpm [omit line if null]
Variability Index: [X.XX] ([assessment])
Calories: [XXXX] kcal
Carbs used: [XXX] g
TSS: [XXX] (planned [XXX])
Feel: [X/5] ([label])
RPE: [X/10]
Note: [description or chat_notes text]

[Repeat block for additional sessions]

Weekly totals:
Polarization: Z1+Z2 [XX]%, Z3 [X]%, Z4+ [X]% — [Classification] (PI: [X.XX])
Durability: [X.XX]% 7d mean([X]) / [X.XX]% 28d mean([X]) ([trend])
EF: [X.XX] 7d mean([X]) / [X.XX] 28d mean([X]) ([trend])
HRRc: [XX] bpm 7d mean([X]) / [XX] bpm 28d mean([X]) ([trend]) [omit if 28d < 3 sessions; if 7d = 0: "[XX] bpm 28d mean([X]) — 7d: no data"]
TID 28d: [Classification] (PI: [X.XX]) — drift: [consistent/shifting/acute_depolarization]
TSB: [X.XX]
CTL: [XX.XX]
ATL: [XX.XX]
Ramp rate: [X.XX]
ACWR: [X.XX] ([assessment])
Recovery Index: [X.XX]
Hours: [XhYm]
TSS: [XXX]

Interpretation:
[2-4 sentences: compliance check, key quality metrics, load context, recovery note if applicable.]
```

---

## Rounding Convention

Round zone percentages to the nearest **whole number** (1%). The JSON data source carries precise values for detailed analysis. A few seconds in a zone is noise, not signal — report `0%` not `0.1%`.

## Field Notes

| Field | When to include | Notes |
|-------|----------------|-------|
| Distance | Cycling, running | Omit for SkiErg, strength |
| Power / Power zones | Activities with power data | Omit if no power meter |
| Grey Zone / Quality | Always for cycling | Highlights polarization compliance |
| Cadence | Cycling, running | Omit for SkiErg, strength |
| Decoupling | Sessions ≥ 1 hour | Key aerobic efficiency marker. Per-session scale (<5% good) per Friel/Coggan. Aggregate durability uses tighter scale (<3% good) |
| EF | Activities with power + HR | Aerobic efficiency (NP ÷ HR); track trend over like-for-like sessions. Absolute value is individual-dependent |
| HRRc | Activities where HR exceeded threshold for >1min | Heart rate recovery (largest 60s HR drop in bpm). Higher = faster parasympathetic recovery. Absent on easy rides, rides stopped before cooldown, or no HR data. Omit line when null |
| Variability Index | Cycling with power | 1.00–1.05 = steady, >1.05 = variable. Assessment labels apply to steady-state only; omit label for interval sessions where high VI is expected |
| Carbs used | Sessions with power data | Omit if unavailable |
| Feel | Omit line if null | 1=Strong, 2=Good, 3=Normal, 4=Poor, 5=Weak. Set in Intervals.icu or pushed from device (e.g. Garmin post-ride prompt). Can appear on any activity type |
| RPE | Omit line if null | Rate of Perceived Exertion, 1–10 scale. Set in Intervals.icu or pushed from device. Can appear on any activity type |
| Note | Omit line if neither present | Athlete's own text or coach messages attached to the activity. If both `description` and `chat_notes` exist, combine. Omit line entirely when neither is present |
| Durability (weekly) | Aggregate decoupling 7d/28d | Steady-state sessions only (VI ≤ 1.05, ≥ 90min). Trend direction matters more than absolute value |
| EF (weekly) | Aggregate EF 7d/28d | Steady-state cycling only (VI ≤ 1.05, ≥ 20min). Trend direction matters more than absolute value |
| TID 28d (weekly) | 28d Seiler classification + drift | Shows whether acute TID matches chronic pattern. Always include drift label |
| Weekly totals | Always | Running totals through current day |

## Assessment Labels

| Metric | Good | Watch | Flag |
|--------|------|-------|------|
| Decoupling (per-session) | < 5% | 5–10% | > 10% |
| Variability Index | ≤ 1.05 | 1.05–1.10 | > 1.10 |
| ACWR | 0.8–1.3 | 1.3–1.5 | > 1.5 or < 0.8 |
| Grey Zone (Z3) | < 5% (base) | 5–10% | > 10% (base phase) |
| Durability (7d mean) | < 3% (good) | 3–5% (moderate) | > 5% (declining) |
| EF trend | improving/stable | — | declining |
| TID drift | consistent | shifting | acute_depolarization |

## Formatting Rule

- **Durations and sleep:** Always use `_formatted` fields from JSON (e.g., `sleep_formatted`, `duration_formatted`, `total_training_formatted`). Never convert decimal `_hours` fields to display format — the formatted values are pre-calculated from raw seconds and avoid rounding errors.


# Pre-Workout Report Template

> This template defines the standard output format for pre-workout reports.  
> Fields in `[brackets]` are placeholders. Omit fields that don't apply.

---

```
Data last_updated (UTC): [YYYY-MM-DDTHH:MM:SS]

Weather ([Location]): [icon] [temp]°C, [humidity]% humidity, [conditions], wind [speed] m/s from [direction].
Coach note: [Brief weather-relevant tip. Omit if no actionable weather context.]

Current Status Summary:
RHR: [XX] bpm (baseline: [XX] bpm)
HRV: [XX] ms (7d avg: [XX] ms)
Sleep: [XhYm]
Sleep Quality: [X/4]
TSB: [X.XX]
CTL: [XX.XX]
ATL: [XX.XX]
ACWR: [X.XX] ([assessment])
Recovery Index: [X.XX] ([assessment])
Ramp Rate: [X.XX]
Load/Recovery: [X.X] (tolerance [X.X]) — [context note if near edge]
Polarization: Z1+Z2 [XX]%, Z3 [X]%, Z4+ [X]% — [Classification] (PI: [X.XX])
TID 28d: [Classification] (PI: [X.XX]) — drift: [shifting/acute_depolarization] [only if not consistent]
Durability: [X.XX]% 7d mean([X]) ([trend])
EF: [X.XX] 7d mean([X]) ([trend])
Monotony: [X.XX] ([primary sport] [X.XX], total [X.XX]) — [note]
Total hours, last 7 days: [XhYm]
Total activities, last 7 days: [XX]
Total TSS, last 7 days: [XXX]

Planned Workouts for Today (Planned TSS: [XXX]):
[WorkoutType] [Duration] — [structure/targets]

[If rest day: "Rest day — no sessions scheduled."]
[If rest day: "Next session: [Day] — [workout preview]"]

Recommendation: [readiness_decision.recommendation — Go / Modify / Skip]

Interpretation:
[2-4 sentences: readiness vs baselines, load context,
suitability (proceed/modify/skip with rationale), coach tip.
Use readiness_decision.signals for individual signal values.
If recommendation is Modify, reference readiness_decision.modification
for adjustment directions (intensity/volume/cap_zone).
AI may override the pre-computed recommendation with explicit rationale.]
```

---

## Conditional Fields

| Field | Rule |
|-------|------|
| Weather | Include if athlete location is available via profile or memory |
| Coach note (weather) | Include only if actionable (e.g., dress warm, indoor day) |
| Monotony | Include **only** if > 2.3. Omit entirely when normal |
| Durability | Include if qualifying sessions exist. Omit if 0 qualifying sessions in 7d |
| EF | Include if qualifying sessions exist. Omit if 0 qualifying sessions in 7d |
| TID 28d + drift | Include as separate line **only** if drift is "shifting" or "acute_depolarization". Omit entire line when "consistent" |
| Load/Recovery context | Include tolerance note only when within 0.2 of threshold |
| Next session | Include only on rest days |
| Modify/Skip rationale | Required when recommendation is not "Go" |

## Readiness Decision Logic

The `readiness_decision` object in `latest.json` provides a pre-computed go/modify/skip recommendation with priority level and individual signal statuses. Use this as the baseline.

**Signal statuses** are in `readiness_decision.signals` (hrv, rhr, sleep, tsb, acwr, ri — each with green/amber/red/unavailable and raw values).

**Phase-adjusted thresholds** are in `readiness_decision.phase_context` (shows which phase modifier shifted the amber threshold).

**Modification guidance** is in `readiness_decision.modification` when recommendation is "modify" (trigger categories + adjustment directions: intensity/volume/cap_zone).

> The AI may override the pre-computed recommendation with explicit rationale in the Interpretation section. The `readiness_decision` is the deterministic baseline, not a constraint. If contextual factors (dossier notes, conversation history, athlete-reported info) suggest a different call, explain why.

For the full priority ladder (P0–P3) and signal classification thresholds, see **Readiness Decision** in the protocol.

## Brevity Rule

- **Normal metrics, Go recommendation:** Keep interpretation to 2-3 sentences
- **Threshold breach or Modify/Skip:** Expand with specific reasoning
- **Rest day:** Brief — confirm recovery status, preview next session

## Formatting Rule

- **Durations and sleep:** Always use `_formatted` fields from JSON (e.g., `sleep_formatted`, `duration_formatted`, `total_training_formatted`). Never convert decimal `_hours` fields to display format — the formatted values are pre-calculated from raw seconds and avoid rounding errors.


# Weekly Report Template

**Structure only — no data. Replace `[placeholders]` with actual values.**

Generated at end of training week (Saturday or Sunday morning).

---

## Template Structure

```
Week [X] Summary ([date range])
Block: [Name] — Week [X/Y]
Phase: [Phase] — week [phase_duration_weeks] (confidence: [confidence])
  [If previous_phase differs: "Transitioned from [previous_phase]"]
  [If key reason_codes: "[1-2 codes in plain English]"]

Compliance: [X/X] sessions completed
Planned TSS: [XXX] | Actual TSS: [XXX] ([XX]%)
Hours: [XhYm] (prev week: [XhYm])

Session Breakdown:
  Mon: [workout name] — [XXX] TSS ✅/⚠️/❌
  Tue: [workout name] — [XXX] TSS ✅/⚠️/❌
  Wed: [workout name] — [XXX] TSS ✅/⚠️/❌
  Thu: [workout name] — [XXX] TSS ✅/⚠️/❌
  Fri: [workout name] — [XXX] TSS ✅/⚠️/❌
  Sat: [workout name] — [XXX] TSS ✅/⚠️/❌
  Sun: [workout name] — [XXX] TSS ✅/⚠️/❌

Quality Session Detail:
  [Session 1 name]:
    Target: [XXX]W | Actual: [XXX]W avg / [XXX]W NP
    Decoupling: [X.XX]% ([assessment])
    VI: [X.XX] ([assessment])
    HR: [XXX] avg / [XXX] max
  [Session 2 name]:
    Target: [XXX]W | Actual: [XXX]W avg / [XXX]W NP
    Decoupling: [X.XX]% ([assessment])
    VI: [X.XX] ([assessment])
    HR: [XXX] avg / [XXX] max

Polarization:
  Z1+Z2: [XX]%
  Z3 (Grey Zone): [X]% (target <5%)
  Z4+ (Quality): [X]% (target ~20% of intensity sessions)
  TID 7d: [Classification] (PI: [X.XX])
  TID 28d: [Classification] (PI: [X.XX]) — drift: [consistent/shifting/acute_depolarization]

Durability (steady-state sessions, VI ≤ 1.05, ≥ 90min):
  7d mean([X]): [X.XX]% | 28d mean([X]): [X.XX]%
  Trend: [improving/stable/declining] | High drift (>5%): [X] sessions

Efficiency Factor (steady-state cycling, VI ≤ 1.05, ≥ 20min):
  7d mean([X]): [X.XX] | 28d mean([X]): [X.XX]
  Trend: [improving/stable/declining]

HRRc (when 28d has ≥ 3 qualifying sessions):
  [If 7d ≥ 1]: [XX] bpm 7d mean([X]) / [XX] bpm 28d mean([X]) ([trend])
  [If 7d = 0]: [XX] bpm 28d mean([X]) — 7d: no data

Fitness:
  CTL: [XX.X] → [XX.X] (Δ [+/-X.X])
  ATL: [XX.X] → [XX.X]
  TSB: [X.X] → [X.X]
  Recovery Index: [X.XX] ([assessment])
  Ramp rate: [X.XX]
  ACWR: [X.XX] ([interpretation])
  Acute (7d): [XXX] TSS | Chronic (28d avg): [XXX] TSS
  Monotony: [X.XX] ([note]) (omit if ≤2.3)
  Strain: [XXXX] (omit if no monotony flag)

Wellness Trends:
  HRV: [XX]–[XX] ms (avg [XX], prev week [XX]) [↑/↓/→]
  RHR: [XX]–[XX] bpm (avg [XX], prev week [XX]) [↑/↓/→]
  Sleep: [XhYm] avg, quality [X.X]/4 avg [↑/↓/→]
  Avg Feel: [X.X]/5 ([X] sessions) [↑/↓/→]
  Avg RPE: [X.X]/10 ([X] sessions) [↑/↓/→]

Section 11 Flags: [list any triggered flags, or "None"]

Interpretation:
[2-4 sentences — week assessment, compliance, what went well, any flags,
recovery status. Reference Section 11 flag triggers if any were hit.]

Next Week Preview:
[Key sessions planned, any modifications based on this week's data,
focus areas. Reference load targets and phase progression.]
```

---

## Field Definitions

| Field | Source | Notes |
|-------|--------|-------|
| **Compliance** | Planned vs completed activities | ✅ completed as planned, ⚠️ modified, ❌ missed |
| **Quality Session Detail** | Hard/intensity sessions only | Matches post-workout report metrics for consistency |
| **Grey Zone %** | Z3 time / total time | Per Seiler — minimize; target <5% of weekly volume |
| **Quality Intensity %** | Z4+ time / total time | The work that drives adaptation |
| **TID 7d vs 28d** | Seiler classification comparison | Consistent = stable, shifting = classification changed, acute_depolarization = PI dropped |
| **Durability** | Aggregate decoupling from steady-state sessions | VI ≤ 1.05, ≥ 90min, power data. Trend direction matters more than absolute values |
| **Efficiency Factor** | Aggregate EF from steady-state cycling | VI ≤ 1.05, ≥ 20min, power+HR. Rising EF = improving aerobic fitness. Compare like-for-like only |
| **HRRc** | Aggregate heart rate recovery from capability.hrrc | Largest 60s HR drop after threshold. Higher = better. Omit entire section if 28d < 3 qualifying sessions. Display only when `hrrc` is non-null per activity |
| **ACWR breakdown** | 7d acute / 28d chronic | Show components so athlete understands the ratio |
| **Wellness arrows** | Week-over-week comparison | ↑ improving, ↓ declining, → stable |
| **Avg Feel** | Activity-level average from `weekly_180d.avg_feel` | 1=Strong to 5=Weak. Count = sessions with feel populated. Omit line if 0 sessions. Lower is better |
| **Avg RPE** | Activity-level average from `weekly_180d.avg_rpe` | 1–10 Borg scale. Count = sessions with RPE populated. Omit line if 0 sessions |
| **Section 11 Flags** | Protocol flag triggers | Surface mid-week flags here, don't wait for block report |
| **Ramp rate** | CTL change per week | >1.5 = aggressive, monitor closely |

## Assessment Labels

| Metric | Good | Watch | Flag |
|--------|------|-------|------|
| ACWR | 0.80–1.30 (optimal) | 1.30–1.50 (elevated) | >1.50 (high risk) |
| Ramp rate | <1.0 (conservative) | 1.0–1.5 (moderate) | >1.5 (aggressive) |
| Grey Zone % | <5% (good) | 5–10% (watch) | >10% (too much Z3) |
| Decoupling (per-session) | <5% (good) | 5–10% (elevated) | >10% (flag) |
| Durability (7d mean) | <3% (good) | 3–5% (moderate) | >5% (declining) |
| Durability trend | improving/stable | declining | declining >2% vs 28d |
| EF trend | improving/stable | declining | declining >0.05 vs 28d |
| HRRc trend | improving (7d >10% above 28d) | stable (within 10%) | declining (7d >10% below 28d) |
| TID drift | consistent | shifting | acute_depolarization |
| HRV trend | ↑ or → (stable) | ↓ <5% (minor) | ↓ >10% (flag) |

## Notes

- **Session Breakdown** starts on Monday (or user's configured week start)
- **Phase narrative** is constructed from `phase_detection` fields: `phase_detection.phase` + `phase_detection.phase_duration_weeks` + `phase_detection.confidence`. If `phase_detection.previous_phase` differs from current phase, add transition note. Optionally surface 1-2 key `reason_codes` in plain English (e.g., `BUILD_HISTORY_REDUCED_LOAD_REBOUND_CONFIRMED` → "load resumed after deload")
- **Quality Session Detail** only includes hard/intensity sessions — omit recovery/endurance rides unless metrics were notable. Cap at 2–3 key sessions per week; if 4+ hard days occurred, prioritize sessions with the most notable targets, flags, or breakthroughs
- **HRRc** — three display cases: (1) omit entirely if 28d < 3 qualifying sessions; (2) show full trend line if both 7d and 28d have data; (3) show `[XX] bpm 28d mean([X]) — 7d: no data` if 28d qualifies but 7d has no qualifying sessions. Per-session HRRc can still appear in Quality Session Detail when present. HRRc is context-dependent: varies with exercise intensity, type, and when recording stopped. Trend direction over multiple sessions matters; single-session values are noisy
- **Section 11 Flags** should surface immediately in weekly reports, not deferred to block reports
- **Wellness arrows** use simple thresholds: >5% change from previous week = ↑ or ↓, otherwise →
- Keep "Interpretation" concise — this is coaching interpretation, not data repetition

## Formatting Rule

- **Durations and sleep:** Always use `_formatted` fields from JSON (e.g., `sleep_formatted`, `duration_formatted`, `total_training_formatted`). Never convert decimal `_hours` fields to display format — the formatted values are pre-calculated from raw seconds and avoid rounding errors.
