---
name: cover-letter
description: Drafts tailored cover letters for specific job postings using the user's profile and one of three voice templates (IC-engineer, leadership, career-change). Use any time the user asks to draft a cover letter, "write a letter for this job," fill out a "Why are you interested?" field on an application, or prepare a job application that needs personalized prose. Always pair this skill with the job-profile skill — pull facts from there, not from memory.
---

# Cover Letter Drafting

Produces a tailored, one-page cover letter for a specific job posting. The output is conservative, specific, and avoids the AI-cliché tells (no "I am writing to express my profound interest," no "synergy," no "passionate about leveraging").

## How to use this skill

1. **Always read the `job-profile` skill first.** Pull the candidate's name, current role, work history, and skills from there. Never invent or guess.
2. **Read the actual job posting** before drafting. If you don't have it open, ask for the URL or paste of the posting first.
3. **Pick the right template** (see below). When in doubt, default to the IC-engineer template — it's the least flowery.
4. **One page maximum** — 250-350 words of body text. Always.
5. **Never lie or stretch.** If a posting asks for 10 years of Kubernetes and the candidate has 3, write 3. Stretching is what makes ATS-scored cover letters get filtered.
6. **Output as plain text** unless the application form has a rich-text editor — then preserve paragraph breaks but no fancy formatting.

## Template selection

| Template | When to use |
|----------|-------------|
| **IC-engineer** | Senior IC / Staff / Principal engineer roles where the candidate is staying in an IC track. Technical, specific, low ceremony. |
| **Leadership** | Engineering Manager / Director / VP / CTO roles. Emphasizes scope, team scale, business outcomes. |
| **Career-change** | The candidate is pivoting industries, returning from a gap, or moving from IC to management (or back). Acknowledges the pivot directly and frames why it's a fit. |

## Template 1 — IC-engineer

```
Hi [hiring manager first name, or "Hiring Team" if unknown],

[ONE sentence: what role you're applying for and one specific phrase from the posting that caught your attention — a tech stack, a problem they're solving, a product you've used.]

[ONE paragraph, 3-4 sentences: the most relevant 2-3 things from your work history. Concrete. Numbers if you have them. No adjectives.]

[ONE paragraph, 2-3 sentences: a specific thing from the posting and how your experience maps to it. If the posting mentions a hard problem, name it and say what you'd bring.]

[ONE sentence close: availability and a clean sign-off. No "I look forward to hearing from you at your earliest convenience."]

Best,
[Name]
[Email]
[Phone, if comfortable]
```

**Tone notes:**
- Lead with substance, not interest.
- Numbers > adjectives. "Cut p99 latency from 1.2s to 180ms" beats "dramatically improved performance."
- One specific reference to the posting is enough — more reads as pandering.
- Don't say "I'm a passionate engineer." Show it by what you've shipped.

## Template 2 — Leadership

```
Hi [hiring manager first name],

[ONE sentence: the role, and one signal from the posting that this is a real leadership job vs. a player-coach role labeled as a director.]

[ONE paragraph, 3-4 sentences: scope. Team size, org structure, what the team was responsible for, what shipped. Lead with outcomes the business cared about — uptime, revenue, cycle time — not internal process wins.]

[ONE paragraph, 2-3 sentences: a leadership belief or approach, tied to a specific example. ("I'm wary of reorgs that don't change reporting lines — we did one that did, and the impact was X.") This is where your judgment shows.]

[ONE sentence close.]

Best,
[Name]
```

**Tone notes:**
- Recruiters for leadership roles read 50+ of these per week. The best ones sound like a peer, not an applicant.
- Avoid "servant leader," "people-first," "outcomes-driven" — these phrases are now noise.
- One genuine, slightly contrarian opinion is more memorable than five safe ones.

## Template 3 — Career-change

```
Hi [hiring manager first name, or "Hiring Team"],

[ONE sentence: the role, and a one-clause acknowledgment of the pivot — don't bury it. "I'm applying for [role]; this is a move from [previous domain/role] to [new domain/role]."]

[ONE paragraph, 3-4 sentences: the transferable substrate. Not "transferable skills" — name the actual mechanism. "Five years of incident-response in healthcare ops is the same muscle as on-call rotation in SRE: read the runbook fast, communicate while you work, leave a postmortem better than you found it."]

[ONE paragraph, 2-3 sentences: what you've done to bridge the gap. A project, a course, a side gig, a certification. Concrete. If you haven't done anything to bridge, the pivot won't read as credible.]

[ONE sentence close acknowledging the risk and inviting the conversation. ("I'd rather have a 20-minute call where you ask me the hard questions than send a polished pitch.")]

Best,
[Name]
```

**Tone notes:**
- Career changers lose the battle by being defensive. Win it by being direct.
- Don't apologize for the gap or pivot. Frame it.

## Universal rules

- **Never use the phrase "I am writing to" or "I am excited to"** — both are red flags for templated content.
- **Never use the phrase "transferable skills"** — show the transfer, don't label it.
- **Never use** "leverage," "synergy," "passionate," "rockstar," "ninja," "wear many hats," "I'm a quick learner," "results-driven," "team player." If a draft contains any of these, rewrite.
- **Avoid em-dashes if the candidate's résumé doesn't already use them.** Consistency matters; recruiters notice.
- **Match the company's tone register.** A defense contractor cover letter and a YC-backed startup cover letter should read differently.
- **Read it aloud in your head before finalizing.** If a sentence is hard to say, it's wrong.

## Output format

When you draft the letter, output it as a code block so the user can copy it cleanly. Below the code block, add a short note:

```
Letter version: [IC-engineer | Leadership | Career-change]
Word count: [N]
Tailored to: [Company name] — [Role title]
Anything to flag: [Anything you stretched on, any gap in profile data, or "Nothing to flag."]
```

## Multi-letter sessions

When drafting letters for multiple postings in one session (typical "Prepare 5 applications" task):

1. Draft all 5 letters before showing any of them.
2. Output them as a numbered list with the company name as a header.
3. After all 5 are drafted, surface anything that came up across the batch — patterns in what the postings asked for that the candidate's profile is thin on.

That cross-cutting feedback is more valuable than perfect individual letters.
