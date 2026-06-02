---
name: look-alike-analysis
description: Finds 12-20 people who currently hold the user's target role (biased toward recent transitions, not 10-year veterans), analyzes their LinkedIn profiles via Claude in Chrome at human pace, and identifies the patterns that appear in 60%+ of the sample — common skills, certifications, headline structures, About-section conventions, career paths, activity patterns. Outputs a "look-alike checklist" with what the user already has, what's missing, and prioritized actions. Use when the user asks "what do successful X look like," "what should my profile have," "what credentials do I need," "look-alike analysis," "competitive analysis on my target role," or after the profile-audit identifies gaps that benchmarking could clarify. Read this skill whenever the user wants to know the patterns successful people in their target role share.
---

# Look-Alike Analysis

Finds people who recently got the user's target role and identifies the patterns they share. Output is a checklist of common features — skills, credentials, headline conventions, career trajectory markers — with explicit signals of strength (% of sample that has the pattern) and the user's status on each (have / don't have / partial).

This is competitive intelligence applied to your own profile, with the goal of "look credible to recruiters scanning for this role" — not "look identical to one specific person."

## Critical guardrails

This skill touches strangers' data more than any other. Read these before doing anything.

### Privacy and pace

- **Operate at human pace.** View one profile at a time, with realistic dwell time on each (30-90 seconds per profile). No parallel browser tabs, no rapid-fire navigation. The user's LinkedIn session is the rate limit.
- **Never store identifying information about the subjects.** No names, no profile URLs, no employer names tied to specific subjects in any persistent output. The output is *aggregate patterns*, never "Profile 4 (Jane Smith at Stripe) has X."
- **Anonymize during analysis too.** When taking notes during the run, use "P1, P2, P3..." not real names. The aggregate report should be reproducible by another instance of Claude without identifying the source profiles.
- **Respect LinkedIn's ToS.** The PRD's posture applies here: no faster than a fast human, no bulk export, no automated message sending or connection requests.
- **Sample size cap: 20 profiles per analysis.** More than 20 adds little signal and starts to look like systematic scraping. Less than 10 is statistical noise.

### Demographic mimicry prevention

**Never extract or report on:**
- Names, name patterns, ethnic indicators in names
- Photo characteristics (appearance, dress style, photo type)
- Race, ethnicity, perceived nationality
- Gender or gender presentation
- Age or apparent age, graduation year as age proxy
- Schools as prestige signals (you can note "common credentials" like "MBA" or "AWS cert" — but not "many went to Stanford")
- Geographic origin (you can note "common to be located in [region the user is targeting]" but not "people from [country] dominate this role")
- Language patterns that correlate with cultural background
- Marital status, family status, anything indicating protected class

**If a pattern you detect is demographic, drop it from the output.** "All 15 subjects were ___" where the blank is demographic is not a finding the user can or should act on.

### Survivorship bias mitigation

People who currently hold a role are not a random sample of people who tried to get it. Two specific filters:

1. **Bias toward recent transitions.** Prioritize subjects who got their current role in the last 12-24 months. People who've been in the role for 8+ years were hired against very different criteria.
2. **Match the user's starting point.** Sample subjects whose *prior* role looks similar to the user's *current* role. A Senior PM who got there from VP-of-Product is a different look-alike than one who got there from Senior Engineer. Pick the relevant cohort.

When neither filter can be satisfied (the user's pivot is unusual), report this honestly in the output and treat the analysis as directional, not definitive.

## How to run an analysis

### Step 1: Define the target

Pull from `job-profile` and `Saved Searches`:

- Target role title (e.g., "Senior Backend Engineer")
- Target seniority level
- Target industry/company stage (Fortune 500 vs. Series B vs. boutique consultancy)
- Target geography (remote OK / specific metro)

Confirm with the user before running. A look-alike for "Senior Backend Engineer at growth-stage SaaS, remote OK" is a different cohort than "Senior Backend Engineer at FAANG, in-person Bay Area."

### Step 2: Build the sample

Use Claude in Chrome to search LinkedIn for the target role with the relevant filters. From results, build a sample of **12-20 subjects** with this composition:

- **70% recent transitions** — in current role 6-24 months. These are the actionable look-alikes.
- **20% mid-tenure** — 2-5 years in current role. Stable but not stale.
- **10% long-tenure** — 5+ years. Tells you what staying in the role looks like.

Filter out before adding to the sample:
- Profiles with no current role listed (job seekers themselves)
- Profiles with <50% complete (no About, no current role description)
- Profiles where the role title looks inflated (founder/CEO of a one-person LLC listed as "Director of Engineering")
- Profiles of recruiters or career coaches who advise on the target role rather than perform it
- Profiles whose prior role suggests a completely different cohort than the user

Aim for diversity across:
- Company size (mix of FAANG/large/midsize/startup)
- Geography (within target constraints)
- Career path leading into the role (don't sample only people who came from one prior role)

### Step 3: Visit each profile and extract

For each subject, record into a temporary working notes file (deleted at end of session, never persisted) under an anonymous label (P1, P2, ...):

**Header layer:**
- Tenure in current role (months)
- Prior role (title, not employer)
- Years total professional experience

**Headline:**
- Character count
- Structure (e.g., "Title + Company + Optional value prop")
- Notable phrases (without identifying details)

**About / Summary:**
- Word count
- Number of paragraphs
- Lead pattern (hook? generic opener? direct statement?)
- Mentions of specific tools, methods, technologies
- Mentions of business outcomes vs. activities

**Experience descriptions (current role only):**
- Bullets vs. paragraphs
- Quantification: % of bullets with at least one number
- Action verb tense consistency

**Skills section:**
- Top 10 listed skills (the user-prioritized ones)
- Total skills count
- Whether endorsements are visible and roughly how many on top 5

**Credentials:**
- Certifications listed (specific ones — these are factual credentials, not demographic)
- Notable courses or formal training programs
- Degrees and field of study (field, not school)

**Recommendations:**
- Count
- Roles of recommenders (manager / peer / report / external partner)

**Activity:**
- Posting frequency (last 90 days)
- Topic mix
- Engagement signals (followers, comment activity)

**Career trajectory:**
- The sequence of roles leading to current
- Average tenure per role before this one
- Any patterns of lateral moves, geographic moves, industry pivots

**Anything anomalous:**
- One-of-a-kind credentials worth noting
- Unusual career paths that worked

### Step 4: Aggregate

Look for patterns appearing in **60%+ of the sample**. Below 60%, treat as "common but not dominant." Below 40%, drop entirely.

**Strong patterns (60%+):**
- "13 of 15 subjects list AWS as a top skill"
- "12 of 15 subjects have at least one industry-recognized certification"
- "11 of 15 subjects' About sections lead with a specific belief or POV rather than a generic intro"

**Weak patterns (40-60%):**
- "9 of 15 have a side project listed on LinkedIn"

**Drop (below 40%):**
- Idiosyncratic individual choices

**Drop regardless of frequency:**
- Any pattern involving demographics, photo style, school prestige, name characteristics, language, or anything from the "never extract" list above.

### Step 5: Output

A structured report with five sections:

```
Look-Alike Analysis: [Target Role]
─────────────────────────────────────
Sample: [N] subjects · Recent transitions: [N] · Mid-tenure: [N] · Long-tenure: [N]
Date: [YYYY-MM-DD]
Geographic scope: [scope]
Industry composition: [breakdown]

THE STRONG SIGNALS  (60%+ of sample)
─────────────────────────────────────
1. [Pattern] — [N of N] subjects have this.
   Your status: [HAVE / PARTIAL / MISSING]
   Action if missing: [specific, concrete]

2. [Pattern] — ...

THE COMMON-BUT-NOT-DOMINANT SIGNALS  (40-60%)
─────────────────────────────────────
1. [Pattern] — [N of N] subjects.
   Worth considering, not required.

CAREER PATH PATTERNS
─────────────────────────────────────
The most common path into this role (in your sample):
[Prior role A → Prior role B → Current role]

Average years experience at transition: [N]
Most common prior role: [title]

YOUR GAP ANALYSIS
─────────────────────────────────────
Of [N] strong signals, you have [X], are partial on [Y], and are missing [Z].

Highest-priority adds, in order:
1. [Action with effort estimate]
2. [Action with effort estimate]
3. [Action with effort estimate]

PATTERNS WE'RE *NOT* REPORTING
─────────────────────────────────────
A note on what was excluded: [N] patterns were demographic (race, gender,
school prestige, age signals, etc.) and dropped per the skill's guardrails.
You shouldn't try to optimize for those even if they appear in the data.

ANOMALIES WORTH KNOWING
─────────────────────────────────────
Things that appeared in <40% of the sample but are interesting:
[1-3 idiosyncratic-but-credible paths or credentials]
```

The "Patterns we're NOT reporting" section is important. It tells the user that the analysis is incomplete by design, and why — so they don't wonder what's missing.

### Step 6: Log

Write to the workbook:

1. **Look-Alike Analysis tab** — append a row with the summary metadata, top findings, action items.
2. **Events tab** — write a `Note Added` event:
   - Description: "Look-alike analysis: [Target Role], [N] subjects, top gap: [highest-priority missing pattern]."
   - Source: `Scheduled Task` or `User`

If the full report is produced as a separate markdown doc in Drive, link to it in the workbook row's URL column.

## Cadence

- **First run:** when the user starts a new search or pivots target role
- **Refresh:** every 6 months for an active search (the target role's norms shift)
- **On demand:** when profile-audit surfaces gaps and the user wants to benchmark

Don't run more than once a month for the same target role. The data doesn't change that fast and the privacy cost compounds.

## What to do with the results

The report is information, not prescription. The user has three options for each strong signal:

1. **Adopt** — actively work to add the missing pattern (get the cert, build the portfolio piece, restructure the About section).
2. **Substitute** — find an equivalent that matches their actual background ("AWS cert" can substitute with "5 years of production GCP work plus a GCP cert").
3. **Ignore** — decide the pattern is not them and accept the cost.

The user gets to pick per-signal. The skill's job is to surface the patterns clearly; deciding what to do with them is the user's call.

## When NOT to run this skill

- **Very early in a search.** Less than 2 weeks in, the user hasn't tested the basic search hypothesis yet. Benchmark when there's reason to think the profile is the constraint, not the search config.
- **The user is in a niche role with no comparable cohort.** A "VP of Engineering at a climate-tech startup specializing in industrial methane capture" has maybe 12 people in the world. The sample won't be statistically meaningful — be honest about that.
- **The user is changing industries radically.** A diesel mechanic targeting Senior UX Designer doesn't benefit from look-alike analysis of current Senior UX Designers — they need the profile-audit skill and the reality-check skill first. After bridging work has been done, look-alike analysis becomes useful.
- **Right after another look-alike run.** Repeated runs don't tell the user new things. Once a quarter, max.

## Interaction with other skills

- **`job-profile`** — read first for target role context.
- **`profile-audit`** — look-alike findings can be inputs to a profile audit. "Your skills section is missing 3 of the top 5 common skills" becomes a specific audit finding.
- **`reality-check`** — if the look-alike analysis reveals a deep mismatch (the user has none of the strong signals and the gap to acquire them is multi-year), hand off to reality-check rather than try to "close every gap."
- **`market-intelligence`** — look-alike runs on the *people*; market-intelligence runs on the *postings*. Two angles on the same target role.

## On using this responsibly

The point of this skill is to help the user understand what credible candidates for their target role look like — so they can make informed choices about their own profile. The point is NOT to clone someone else's profile, sound like someone they're not, or chase signals at the cost of authenticity.

If the analysis reveals that "successful people in this role write about [topic] in their About sections" and the user has nothing genuine to say about that topic, the right move is to find a different angle that's authentic — not to fake it. Hiring managers detect performative profile content. The look-alike analysis is a map, not a script.
