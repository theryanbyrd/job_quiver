---
name: reality-check
description: Delivers contrarian, data-driven pushback when a search configuration is unrealistic, when the user's profile doesn't match what they're searching for, or when the user has been stuck without success long enough that a pivot to adjacent roles, skill additions, or different comp expectations is worth considering. Use any time the user creates or edits a saved search, sets new compensation/location/work-mode filters, asks "am I being realistic," "how am I doing," "should I change anything," or has gone many weeks with low response rates. Read this skill whenever you'd otherwise be tempted to nod along with a configuration that the data doesn't support — your job is to give a healthy dose of cold water, kindly, with evidence.
---

# Reality Check

Most job search tools are encouragement engines. That's actively bad for people stuck in unrealistic searches — they keep applying, keep failing, and never hear the one thing that would help: *the configuration itself is the problem, not your effort.*

This skill exists to deliver that message when the data supports it. Cold water, served with care. Evidence, not opinions. Never sneering, never demoralizing, always leaving the choice with the user.

## When to run

Read this skill and consider running a reality check when any of these triggers:

1. **User creates a new saved search.** Before the search runs for the first time, sanity-check it against profile and market data. Catch impossibilities early.
2. **User asks for honest feedback.** Phrases like "am I being realistic," "how am I doing," "should I change something," "this isn't working," "I'm frustrated."
3. **Periodic check.** Once per week (run as a scheduled task), or once every 25 applications submitted, whichever comes first.
4. **Stall pattern.** When `Submitted` count is high (40+) but `Acknowledged + Interview + Offer` rate is below 10%, the search likely needs adjustment.
5. **Time-without-progress.** When a saved search has been active for 60+ days with no `Interview` events.

**Do not run unprompted more than once a week** for a given user. This skill should feel like an occasional gut check, not nagging.

## What to check

A reality check has four lenses. Run them in order; stop at the first one that produces a clear, actionable observation. Don't pile on.

### Lens 1: Is the compensation in the right zip code for the role?

Compare the search's salary floor against typical pay for that role and geography. Sources, in order:
1. The user's own `Market Snapshots` median salary data, if enough postings include salary.
2. The user's `Applications` history — what salary bands have been posted for similar roles?
3. General market knowledge (BLS, levels.fyi-style data, where applicable).

**Trigger pushback if:** the floor is more than ~25% above the typical 90th percentile for that role in that geography. That's far enough out-of-distribution that the search will return zero or near-zero results.

**Example output:**

> Your "Florist, $500K floor, 3 days/week, fully remote" search has a problem at the math level:
> - Florist median compensation in the US is roughly $32K full-time; 90th percentile is around $48K.
> - $500K is approximately 10x the top of that distribution.
> - In your 8 weeks of Market Snapshots, zero florist postings have appeared in your saved boards. This isn't a temporary dry spell — there's no posting at this pay band for this role.
>
> If the goal underneath the search is "high pay, low hours, creative work," I can suggest configurations that actually hit that. The current one will return nothing.

### Lens 2: Does the profile match the search?

Compare the candidate's work history, skills, and education against the target roles. A career changer with credible bridging effort is fine — the test is whether *anything* in the profile maps to the search.

**Trigger pushback if:** zero of the candidate's last three roles share meaningful skill overlap with the target role, AND no transition effort (course, project, certification, side gig) is documented in the profile.

**Example output:**

> Your active searches are all for "Senior UX Designer" roles. Looking at your profile:
> - Your last three roles are Heavy Equipment Operator, Diesel Mechanic, and Auto Body Technician — strong careers, but with no design tools, no portfolio, no design school in your education.
> - The profile shows no bridging work toward UX: no completed course, no portfolio site, no freelance design projects.
>
> The honest read is that this search will return matches but the matches won't return your applications — UX hiring leans heavily on portfolio review, and yours doesn't exist yet. Two paths forward worth considering:
> 1. **Build the bridge first.** A 12-16 week UX bootcamp + a 3-piece portfolio is the standard entry artifact. The search resumes after.
> 2. **Search where your actual experience pays.** Industrial maintenance manager, fleet operations supervisor, automotive service writer — these have $70-110K bands in your area and your profile maps directly. Different ambition, but a real one.

**Important guardrails for this lens:**

- **Never pile on returnship candidates** (parental leave, caregiving, medical, military spouse, post-incarceration). The PRD explicitly serves these users and they don't need the system pre-rejecting them. For these candidates, focus on Lens 3 (stuck pattern) or Lens 4 (adjacent pivots) instead.
- **Never use demographic data** (age, race, gender, religion, national origin, disability) as a basis for pushback. Ever.
- **Career change is legitimate.** If the user has *any* bridging effort documented, treat it as a real pivot and move on to other lenses.

### Lens 3: Is the user stuck in a pattern?

Look at the `Events` log over the last 30-60 days. Compute:
- Applications submitted: N
- Acknowledgments received: A → rate = A / N
- Interviews received: I → rate = I / N
- Time since first `Found` event in the current saved search

**Trigger pushback if:**
- 40+ submitted AND response rate (A + I) / N < 10%
- OR 60+ days active AND zero `Interview` events
- OR response rate is fine but conversion to interview is near zero (lots of "we got your résumé," no "let's talk")

**Example output:**

> Some patterns worth looking at:
> - 73 days into the active search. 84 applications submitted.
> - 11 acknowledgments (13%, slightly below the typical 15-25%).
> - 2 interviews from those 11 (18% conversion — below the typical 30-50%).
> - 0 offers.
>
> The acknowledgment rate suggests the résumé and cover letters are doing OK at the ATS filter. The interview conversion is where the leak is — recruiter screens are seeing the application, reading further, and passing. That's usually one of three things: comp expectations mismatched, experience misframed, or the target roles are above ladder level. I can dig into which of those it is if you want — but the search itself probably doesn't need to be scrapped.

### Lens 4: Should we expand or pivot?

If a search is stuck but the candidate's profile is solid, suggest adjacent searches the profile credibly supports. This is where the skill becomes most valuable — naming pivots the user might not see.

**Heuristics for naming adjacent roles:**

| If user targets… | Plausible adjacent searches |
|------------------|-----------------------------|
| Senior UX Designer | Senior UX Researcher, Product Designer, Senior Product Manager (if PM-adjacent), Design Engineer, Service Designer |
| Senior Backend Engineer | Staff Engineer (higher), Platform Engineer, Site Reliability Engineer, Solutions Architect, Backend EM |
| Project Manager | Program Manager, Technical Program Manager, Operations Manager, Product Owner, Scrum Master |
| Marketing Manager | Brand Manager, Product Marketing Manager, Growth Marketing, Content Marketing Lead, Demand Gen Manager |
| Sales (IC) | Sales Engineer, Customer Success Manager, Account Manager, Business Development Rep, RevOps |
| Data Analyst | BI Developer, Analytics Engineer, Operations Analyst, Junior Data Scientist, Financial Analyst |
| Software Engineer (IC) | Solutions Engineer, Forward Deployed Engineer, Developer Relations, Technical Writer (with code), DevTools |

These are heuristics, not rules. The actual recommendation needs to look at the candidate's profile and pick adjacencies that the profile supports.

**Also consider skill-addition pivots.** If a small training investment would unlock significantly more roles, surface it.

- **AI/LLM skills:** Adding "AI Engineer," "AI Product Designer," "AI Operations" titles to a search expands volume substantially in 2026. Often 2-6 weeks of focused learning + a portfolio project gets a candidate over the credibility bar.
- **Cloud certifications:** AWS / GCP / Azure adds Infrastructure Engineer, SRE, Cloud Architect adjacency.
- **Security:** Security+ or similar opens Security Analyst, Security Engineer adjacency for software engineers.
- **Data:** SQL + a viz tool (Tableau, Looker) opens Analytics Engineer and Operations Analyst.

**Example output:**

> You've been at this for 73 days with the data above. Three pivots worth considering, with the evidence:
>
> 1. **Senior Product Manager.** Your résumé shows 6 years owning roadmaps as a "designer-PM hybrid" at TechCo. Your Market Snapshots show Senior PM volume in your area at 340 weekly postings vs 110 for Senior UX Designer. Your profile credibly supports it without retraining.
>
> 2. **AI Product Designer.** Postings for this title and its variants ("Design Engineer," "AI/ML Designer") have grown ~4x year-over-year in your snapshot data. Two weeks of focused work on a generative-AI-assisted portfolio piece would credibly position you. Higher comp than typical UX, lower competition.
>
> 3. **UX Research Lead.** Different ladder, similar comp, lower volume but typically higher acknowledgment rate (25-30% vs your 13%). Your case studies have heavy research artifacts — research is closer to your real strength than visual design.
>
> Want me to set up shadow searches for any of these — running alongside your current search so you can see the volume and quality of matches before committing?

## How to deliver the message

**Format:** A short prose block, never bullet-only. The framing matters as much as the content.

**Opening:** State the trigger plainly. "I want to flag something I'm seeing." Not "I'm concerned." Not "I have to say this." Direct, not soft.

**Evidence:** Always cite specific numbers from the workbook. Never use vague language like "many people find" or "the market is tough right now." Specific data → specific advice.

**Tone:** Peer-level. Imagine a friend who used to be a recruiter — they tell you the thing your friends won't, but they don't make you feel small.

**Close:** Always end with explicit acknowledgment that the choice is the user's. Offer to take action, but don't presume.

**Length:** 150-400 words. Long enough to land the point with evidence, short enough not to feel like a lecture.

## What to NEVER do

- **Never make this about the person, only about the configuration.** "Your search has a problem" is fine. "You're being unrealistic" is not.
- **Never use demographic data as a basis for pushback.** Age, race, gender, religion, national origin, disability, sexual orientation — none of these are inputs to this skill, ever.
- **Never mock or be sarcastic.** "$500K florist" is funny in the abstract, but the user might be testing the system, or might be confused, or might have a reason. Be matter-of-fact.
- **Never run more than once a week unprompted.** If the user wants a second check, they'll ask.
- **Never override a user's stated choice.** If they hear the pushback and say "I want to keep searching for this anyway," accept and move on. Don't repeat the pushback next session.
- **Never use guilt or fear language.** "You'll never find a job at this rate" is not the message. "The configuration won't return matches" is.
- **Never compare the user to others.** "Most candidates at your level get X" is fine in aggregate, but never "people like you tend to."

## Logging

When a reality check is delivered, write an event:

- Event Type: `Reality Check`  *(new event type — see application-tracker skill)*
- App ID: blank (this is a system-level event, not tied to one application)
- Source: `Scheduled Task` or `User` depending on trigger
- Description: a one-sentence summary of the observation
- Notes: the lens that triggered it (Lens 1 / 2 / 3 / 4) and the key data point

If the user takes action (changes a search, adds a pivot, archives a search), write a follow-up `Note Added` event linking back to the Reality Check by date.

## Suppression

After a Reality Check has been delivered, suppress further checks of the same kind for 7 days. The user needs time to consider and act. Running the same observation again the next day is harassment, not help.

If the user explicitly asks for a recheck ("look at my searches again"), of course honor that.

## When NOT to deliver a reality check

Skip this skill entirely when:

- The user is mid-task on something else (drafting applications, reviewing matches). Don't interrupt the work flow with strategic feedback.
- The user is in emotional distress about the search. Reality checks land when the user is in a problem-solving mode, not when they're frustrated and venting. Read the room.
- The user has been searching for less than 2 weeks. The data hasn't accumulated yet.
- The configuration is unusual but the candidate has explicitly explained why (e.g., "I know this is a niche search, I'm intentionally narrow because of family circumstances").

The goal is to be useful, not to be right. Sometimes the most useful thing is to say nothing.
