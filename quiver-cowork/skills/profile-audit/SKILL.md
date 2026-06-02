---
name: profile-audit
description: Grades the user's LinkedIn profile and/or résumé against hiring-manager and recruiter criteria, identifies specific red flags (employment gaps, "Open to Work" signaling, vague titles, weak quantification, generic summary, missing recommendations), and outputs a prioritized fix list. Includes specific guidance on the "currently unemployed" problem and how to legitimately fill the gap with real consulting work rather than fabricating it. Use any time the user uploads a résumé, shares their LinkedIn URL, asks "grade my profile," "audit my résumé," "what's wrong with my LinkedIn," "how does this look," or before starting a search where the profile is the leading edge. Read this skill whenever a résumé file appears or the user wants honest feedback on how they're presenting themselves.
---

# Profile Audit

Grades the LinkedIn profile, the résumé, or both. Output is a structured grade card with category scores and a prioritized list of fixes. The framing is "good editor reviewing a manuscript" — specific, constructive, focused on what to change rather than what's wrong.

## What this skill assesses

Two surfaces, scored separately:

1. **LinkedIn profile** — accessed via Claude in Chrome at the user's profile URL (logged in as the user, so private fields are visible).
2. **Résumé** — accessed as an uploaded PDF or DOCX file.

When both are available, also check for **consistency** between them: same dates, same titles, same employers. Inconsistencies are themselves a red flag — recruiters cross-reference.

## Ethical guardrails

Before any specific advice:

- **Never recommend fabrication.** If the user has a gap and no consulting work, don't suggest claiming consulting work. Suggest *actually starting* consulting work, then listing it truthfully.
- **Never base advice on demographic signals.** Name, photo, school, country of origin, languages spoken — none of these are inputs to "soften this." If a recruiter discriminates on these bases, that's their bias to deal with, not the candidate's to hide.
- **Frame bias-driven advice as bias-driven.** When recommending a change because hiring managers have a bias (employment status, gaps, graduation year as age proxy), name the bias. The user chooses whether to mitigate or push back.
- **Never make this about the person.** "The current-role field is hurting you" is fine. "You look desperate" is not.

## The grading rubric

Twelve categories, each scored 0-10. Weighted into a letter grade.

### LinkedIn-specific categories

| # | Category | What earns 10/10 | What earns 0/10 |
|---|----------|------------------|-----------------|
| 1 | **Headline** | Specific role + value prop in 220 chars (e.g., "Staff Engineer building developer tools at Mid-Stage SaaS / Distributed systems, payments, devex") | "Open to Work" / "Seeking new opportunities" / "Unemployed" / blank |
| 2 | **About / Summary** | First 2 lines hook (LinkedIn preview cutoff); signature insight or POV; 3-5 paragraphs total; ends with what they're looking for | Generic ("Passionate professional with X years of experience…") or empty |
| 3 | **Current Role** | Real role with scope and outcomes; if consulting, real client work or projects; if employed, recent and substantive | "Open to Work" banner with no role / a "Looking for opportunities" placeholder / multi-year gap |
| 4 | **Experience** | Quantified bullets (numbers, metrics, scope); clear scope of each role; relevant roles emphasized | Job-description copies, no metrics, equal weight to every role |
| 5 | **Skills** | 20-40 relevant skills with 5+ endorsements on the top 5; matches target role keywords | Generic / fewer than 10 / misaligned with target role |
| 6 | **Recommendations** | 5+ recent (last 3 years) recommendations from former managers, peers, reports | 0-1 recommendations |
| 7 | **Activity** | Recent posts or comments (within 30 days) showing thinking in their field | No activity in 6+ months |
| 8 | **Photo & Banner** | Professional photo (clear face, neutral background, dressed for target industry); banner image relevant to industry | Default photo, default banner, low-quality photo |
| 9 | **URL** | Custom URL (linkedin.com/in/firstnamelastname) | Default URL with random digits |

### Résumé-specific categories

| # | Category | What earns 10/10 | What earns 0/10 |
|---|----------|------------------|-----------------|
| 10 | **Layout & Length** | 1 page if <10 years experience, 2 pages if more; clean typography; consistent formatting | 3+ pages / cluttered / inconsistent fonts |
| 11 | **Bullets & Metrics** | Every bullet leads with action verb past-tense (or present for current); quantified outcomes; STAR-aligned | "Responsible for X" / no numbers / equal length and weight everywhere |
| 12 | **ATS-friendliness** | Standard section headings, parseable structure, no graphics/text-in-images, keywords matching target roles | Two-column design / infographic résumé / image-based / no keyword alignment |

## Major red flags (each docks score)

These are specific patterns that recruiters consistently react to. Each one identified should appear in the output with the suggested fix.

### 🚩 "Currently unemployed" signal

The single most-discussed red flag, and the one Ryan called out specifically. Manifestations:

- "Open to Work" banner / "OPEN_TO_WORK" frame around photo
- Headline reads "Open to opportunities" / "Seeking" / "Available immediately"
- No current role listed (last role ended 3+ months ago)
- Current "role" is something vague like "Career Transition" or "Job Seeker"

**Why it matters:** Recruiters and hiring managers have a documented (and frankly unfair) preference for employed candidates over unemployed ones. Studies have shown response rates drop substantially when the candidate is currently unemployed, even controlling for everything else. This is bias. It's also reality.

**The legitimate fix: actually do consulting work.** Not pretend to. Real work.

This means:
1. **Set up a one-person consulting practice.** Pick a focus tied to actual expertise. In 2026, especially viable: AI integration consulting, fractional CTO/CMO, industry-specific advisory (e.g., "former healthtech VP advising digital health startups").
2. **Get one or two real engagements.** Former colleagues with side projects, friends with small businesses, open-source maintainers needing paid help. Even $500 of paid work establishes legitimacy.
3. **Build a single artifact.** A simple website (firstname-lastname-consulting.com), a one-page service description, a few public writeups. Doesn't need to be polished — needs to exist.
4. **Then update the profile honestly:**
   - **Headline:** "Independent consultant — [specific focus area]. Available for [specific kind of engagement]."
   - **Current role:** Real company name (can be the user's name, e.g., "Byrd Consulting") with start date, scope, and 2-3 actual outcomes.
   - **About:** Acknowledge the consulting move directly. "After [N] years at [type of company], I'm spending [N] months doing focused work on [specific problem]. Past clients include [if relevant]. I'm also actively exploring full-time roles where [conditions]."

**What this is NOT:**
- ❌ Listing yourself as a consultant when you've done no consulting work.
- ❌ Naming clients you haven't worked with.
- ❌ Overstating the size or duration of engagements.
- ❌ Using consulting as cover for not actively searching — both can run in parallel.

**Why this works:** Recruiters parse "currently consulting" as currently working. Hiring managers parse a clear pivot story as agency. The candidate has a current professional identity to talk about in interviews. And — critically — if asked "tell me about your consulting work," the candidate can answer truthfully because the work is real.

### 🚩 Vague titles

"Specialist," "Associate," "Consultant" (when not consulting), "Senior Professional" without context. Recruiters skim. Vague titles get skipped.

**Fix:** Use the industry-standard equivalent of the actual scope. If the official title is "Specialist III" but the work was that of a Senior Engineer, both can be listed: "Specialist III (Senior Engineer equivalent)."

### 🚩 Job hopping pattern

3+ roles under 18 months in the last 5 years, with no explanation.

**Fix:** Group consulting/contract roles under a single "Independent Consultant — [dates]" entry with the contracts as sub-bullets. Add a line about layoffs/restructurings where applicable.

### 🚩 Long-running gap

12+ months unexplained gap in the recent history.

**Fix:** Address it directly in the About section. "Took 2024 to [reason]. Returning to [field] with renewed focus on [angle]." Never hide it; recruiters will notice and assume the worst.

### 🚩 Unquantified bullets

Bullets like "Responsible for the engineering team" or "Managed marketing campaigns."

**Fix:** Each bullet should answer "what did you ship and what was the impact." "Responsible for engineering team" → "Led 12-person engineering team through migration to microservices; cut deploy time from 45 min to 4 min and reduced incident rate 60%."

### 🚩 Weak headline

"Looking for new opportunities" / "Open to Work" / "Aspiring [role]" / blank.

**Fix:** A headline should make a recruiter want to read further in 220 characters. Specific role + value prop + (optional) target industry. "Engineering Manager building reliable infra at scale / Previously: 5 years at [Company], 3 at [Company] / Looking for technical leadership roles in fintech or healthtech."

### 🚩 Generic summary

A summary that could belong to any candidate. "Passionate, results-driven professional with strong communication skills."

**Fix:** First two lines should be a hook unique to this person. A specific belief, a signature project, a contrarian POV in their field. Then 2-3 paragraphs of context. Then a one-line ask.

### 🚩 Zero recommendations

Or one recommendation from someone with a "Coach" job title. Signals "couldn't find people willing to vouch for them."

**Fix:** Ask 5-10 former colleagues, managers, reports for recommendations. Offer to write a first draft to make it easy for them. Aim for one from each: a manager, a peer, a direct report (if applicable), a cross-functional partner.

### 🚩 No recent activity

Last post 8 months ago, or zero posts ever. LinkedIn's algorithm and recruiters both factor in.

**Fix:** Post 1-2x per week for 60 days. Industry observations, lessons learned, comments on others' posts. The goal isn't to become a creator — it's to look professionally active.

### 🚩 Outdated photo

Photo is clearly 10+ years old, or has a wedding/baby cropped out.

**Fix:** A current professional headshot. Doesn't need to be expensive — phone photo, neutral background, dressed for the target industry, smiling slightly.

### 🚩 Inconsistent dates between LinkedIn and résumé

Recruiters check. Inconsistencies = lying or careless. Both are bad.

**Fix:** Audit both surfaces, pick the canonical dates (use start-of-month + end-of-month convention), update both.

### 🚩 Title inflation that crosses into dishonesty

"VP" when the actual title was "Senior Manager." Different from using equivalent industry titles — this is fabrication.

**Fix:** Revert to actual title. Use the scope description to convey level.

### 🚩 Email tied to former employer

Showing "@oldcompany.com" as primary email after leaving.

**Fix:** Personal email, professional handle. firstname.lastname@gmail.com is fine. sparklybunny99@hotmail.com is not.

### 🚩 Default LinkedIn URL

linkedin.com/in/john-smith-3a7f2b91. Signals not-savvy.

**Fix:** Customize to linkedin.com/in/firstnamelastname (or a clean variant if taken).

### 🚩 Skills section misaligned with target role

Skills list reads like 2018 but the search is for 2026 AI-augmented roles.

**Fix:** Audit the skills section against 3-5 current postings for the target role. Add the keywords that appear in those postings *and* are real for the candidate. Never add skills the candidate doesn't have.

## Output format

When the user asks for an audit, produce a two-part output:

### Part 1: The grade card

A scannable summary. Format:

```
Profile Audit — [DATE]
─────────────────────────────────────
Overall: B  (3.1 / 5)
LinkedIn: B+ (3.4 / 5)
Résumé:   C+ (2.7 / 5)
Consistency between them: ⚠ (3 mismatches found)

Category scores (LinkedIn):
  Headline:           A   (8/10)
  About / Summary:    C+  (6/10)
  Current Role:       D   (3/10)   ← biggest opportunity
  Experience:         B+  (8/10)
  Skills:             A-  (8/10)
  Recommendations:    F   (2/10)
  Activity:           C-  (4/10)
  Photo & Banner:     B+  (8/10)
  URL:                A   (10/10)

Category scores (Résumé):
  Layout & Length:    B   (7/10)
  Bullets & Metrics:  D+  (4/10)   ← biggest opportunity
  ATS-friendliness:   B-  (6/10)
```

### Part 2: The prioritized fix list

The top 5-7 fixes, ranked by impact. Each one names the problem, cites the evidence, and gives a specific action.

```
Top fixes, in order of impact:

1. CURRENT ROLE — "Open to Work" banner + no current position
   Impact: Highest. Recruiters filter on this directly.
   Action: See the "Currently unemployed" section. Start one or two real
   consulting engagements (suggest specific paths: AI integration for SMBs,
   fractional CTO, [industry]-specific advisory based on your past expertise),
   spin up a one-page artifact, then list the consulting as the current role
   with real scope.
   Time to fix: 1-2 weeks of actual work, then immediate profile update.

2. UNQUANTIFIED BULLETS — résumé and Experience section
   Impact: High. Recruiters skim; metrics are what stops the skim.
   Action: Rewrite 8 highest-priority bullets to lead with verb-past-tense
   and end with a quantified outcome. I can draft these from your profile
   data and current bullets if you upload the current résumé.
   Time to fix: 90 minutes.

3. RECOMMENDATIONS — 1 recommendation total
   Impact: Medium. Visible weakness, but not a filter.
   Action: Identify 6-8 former colleagues and managers. Send a one-line
   recommendation request to each, offering to draft a first version they
   can edit. Aim for 5+ within 2 weeks.
   Time to fix: 2 weeks elapsed, 2 hours active.

[etc.]
```

Each fix should be a thing the user can actually do this week. No "redesign your entire personal brand" advice.

## Cadence

A full audit is a 2-3 hour task with multiple drafts. Don't run it more than once per quarter unless the user explicitly asks. The fixes need time to ship.

Between audits, the user might ask for spot-checks ("Does this updated headline land?"). Spot-checks are cheap and welcome.

## Logging

When a full audit is delivered:

- Write a `Note Added` event to the tracker (App ID blank).
- Description: "Profile audit delivered. Overall grade [X]. Top fix: [Y]."
- Notes: link to the audit doc if produced as a file.

When the user reports they've implemented a fix:

- Write another `Note Added` event capturing what changed.
- Useful for tracking whether profile improvements correlate with response-rate improvements over time.

## Interaction with other skills

- **`job-profile`** — read this skill first. The audit needs the user's target roles, target industries, and salary expectations to score "alignment to target."
- **`reality-check`** — if the audit reveals a deep mismatch between profile and target roles (e.g., diesel mechanic targeting Senior UX), the audit should hand off to the reality-check skill rather than try to "fix" the profile to match an unachievable target.
- **`cover-letter`** — once the audit is delivered, the cover-letter skill should be re-read because the audit's framing (headline, positioning, consulting persona if applicable) feeds into how cover letters are tailored.

## When to suggest a full rewrite vs. surgical fixes

- **Surgical fixes** are the default. A few high-impact changes, the user keeps their voice.
- **Full rewrite** is appropriate only when: overall grade is below D, voice is generic/templated, the candidate is in a major career pivot and the existing surfaces don't reflect the new direction.

Even a "full rewrite" should be the user's voice, captured by interviewing them, not Claude's voice imposed on them. Hiring managers have gotten very good at spotting AI-generated profile copy. The audit's job is to make the user's own voice more effective, not to replace it.
