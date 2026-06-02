---
name: form-fill-playbook
description: A playbook of quirks, pitfalls, and field-by-field guidance for filling out applications on the major Applicant Tracking Systems (Workday, Greenhouse, Lever, Ashby, iCIMS, Taleo, BrassRing, SmartRecruiters, Jobvite) and direct company career sites. Use any time the user asks Claude to "apply to," "fill out," "prepare," or "draft an application" — and any time Claude in Chrome opens a job posting form. Always read this skill alongside the job-profile skill before touching an application form. If the user mentions a specific ATS (Workday, Greenhouse, etc.) or a known quirk, read this first.
---

# Form-Fill Playbook

How to fill applications across the major ATS platforms without burning the user's account, wasting time on bad submissions, or accidentally clicking Submit. Each platform has different field naming, different multi-page flows, and different traps.

## The hard rule, repeated

**Never click Submit. Never click Send. Never click Confirm on the final page.** The user reviews and submits. Every application sits in a tab with the user's data filled in and the cursor parked just before the final action. If you cannot get to that state for any reason (login wall, captcha, missing data), stop the application, leave a note in the tracker, and move to the next one.

## Universal pre-flight checklist

Before opening any application:

1. Read the `job-profile` skill in full.
2. Read the posting on the company's careers page if the listing is on an aggregator (LinkedIn / Indeed). Aggregator-only postings are often stale or repackaged.
3. Confirm the posting is still active. If it 404s or shows "no longer accepting applications," update the tracker row to `Archived` with a note and move on.
4. Check whether the user already has an account on this ATS instance (Workday accounts are per-employer, Greenhouse uses the candidate's email globally). If yes, log in. If no, create one with credentials from the password manager.

## Universal form-fill rules

- **Match the candidate's résumé exactly.** Dates, titles, employer names — these must match the résumé PDF the application also receives. ATS keyword matching cross-references the two.
- **Use the structured fields the form provides.** Don't paste a JSON blob into a free-text field. If a form has separate City and State fields, never put "Provo, UT" in just one.
- **Phone numbers: digits only unless the form specifies a format.** Some forms reject `(555) 123-4567` and accept `5551234567`. Try digits-only first.
- **Dates: read the form's example before typing.** `MM/YYYY` vs `MM/DD/YYYY` vs `YYYY-MM` — they all show up.
- **Drop-downs: never pick "Other" if a real option fits.** "Other" routes some applications to a different review queue.
- **EEO section: only use values from the job-profile skill.** Decline to answer if the profile says "Decline." Never default to a value the user hasn't approved.
- **Salary expectations: if a single-number field, use the floor + 10%.** If a range, use the floor and the target from the profile.
- **Cover letter upload: use the variant matching the saved search.** See `cover-letter` skill for which template, and produce a tailored letter — never upload a generic one.

---

## Workday

The most common, most painful ATS. Each employer has its own Workday subdomain (e.g., `nvidia.wd5.myworkdayjobs.com`), which means a separate account per employer.

**Account creation:**
- Workday accounts are per-tenant. Creating one at Nvidia does NOT log the user in at Salesforce.
- Use the password manager to generate and save a unique password per tenant.
- Email verification is required before the application can be submitted. Watch Gmail for the verification email and click through.

**The work history nightmare:**
- Workday asks for every job individually with start/end month and year. Honor this; don't skip jobs.
- "I worked here" must be set explicitly. Do not leave the current-employer checkbox in its default state.
- Employer names: use the canonical legal name from the candidate's résumé. If the résumé says "Pattern" but the company's legal name is "Pattern Inc," use the résumé version.

**Knockout questions:**
- Work authorization, sponsorship, willingness to relocate — these are the screen-out fields. Wrong answers kill the application before a human sees it.
- If the profile is ambiguous on any of these, STOP and ask the user.

**Résumé parsing:**
- Workday parses the uploaded résumé and pre-fills many fields. Always upload first, then correct what's wrong. Don't start from a blank form.
- The parser hallucinates titles and dates. Always proofread.

**The submit page:**
- The final page typically has a "Submit Application" button at the bottom. Stop scrolling above it. Do not click.

---

## Greenhouse

Cleaner UX than Workday, but the same submission disciplines apply.

**Account model:**
- Greenhouse doesn't require account creation for most applications — it's email-based with optional save-for-later.
- If a "Save your progress?" prompt appears, accept and capture the resulting credentials in the password manager.

**Custom questions:**
- Greenhouse postings often include 2-5 company-specific questions ("Why us?", "How do you handle ambiguity?"). These are free-text and need real answers.
- Draft these using the candidate's voice — pull from the cover-letter skill's tone guidance.
- Hard cap: 150 words per answer unless the field explicitly asks for more.

**EEO section:**
- Always at the bottom, always voluntary. Use the profile's explicit values; default to "Decline to self-identify" if unset.

---

## Lever

Simple, clean. Few traps.

- Most Lever postings accept résumé upload + a single "Additional information" free-text field.
- If the company has added custom questions, they appear inline before submit.
- No account creation needed.

---

## Ashby

A newer ATS gaining ground at YC and growth-stage startups. Generally clean.

**Quirks:**
- Ashby tends to ask for the cover letter inline as a free-text field rather than a file upload. Paste from the cover-letter skill's output.
- Often asks "How did you hear about us?" — use the profile's standard answer.
- The "Submit" button is sometimes labeled "Apply" — same thing, do not click.

---

## iCIMS

Common at older enterprises and government contractors. Multi-page, sometimes 7-10 pages of forms.

**Quirks:**
- Each page has its own Next button. Save state between pages is unreliable — if the session times out, the user loses everything.
- Don't pause mid-application. Either finish the form-fill in one pass or close the tab and start over.
- The work history section often duplicates fields between pages. Fill them consistently.

---

## Taleo

Oracle Taleo. Mostly large enterprises. Frequently slow, frequently broken.

**Quirks:**
- Account creation requires verification email confirmation before the form can even be opened.
- If a Taleo session shows blank fields after résumé upload, refresh once. If it's still blank, the parser failed — fill manually.
- "Save and Continue" is the friend; click it between sections.

---

## BrassRing (Kenexa / IBM)

Legacy. Common at insurance, banking, healthcare.

**Quirks:**
- Often requires creating a candidate profile separately from applying to a specific job. Create the profile first, then apply.
- Error messages are vague — "an error occurred." Usually a missing required field. Scan the page top-to-bottom for red asterisks.

---

## SmartRecruiters

Clean and common at mid-market companies.

- Usually a 1-2 page application after résumé upload.
- Custom questions are common — handle as for Greenhouse.

---

## Jobvite

Less common, but seen at some tech firms. Similar UX to Greenhouse.

---

## Direct company career sites

For the top 200 employers that use their own site rather than a hosted ATS:

- Read the page structure before filling. Some are custom React apps that don't follow standard form patterns.
- If multi-step, save state between steps where possible.
- The "Submit" button can be in unusual places (sticky footer, modal, separate page). Locate it before filling — never let auto-tab through the form click it.

---

## When to pause and ask

Stop and ask the user for input when:

- A required field has no answer in the `job-profile` skill.
- A knockout question's answer is unclear (work auth, security clearance, willingness to relocate).
- The posting requires a cover letter and the cover-letter skill hasn't been run yet for this role.
- The posting asks for a portfolio, code samples, or writing samples not listed in the profile.
- The application requires assessment tests (HackerRank, Codility, personality assessments) — these need user time and can't be agent-driven.
- The application asks for salary history (illegal in many states but still common) — defer to the user.

## When an application fails

If at any point Claude in Chrome can't continue (login wall it can't get past, captcha, broken form, unexpected redirect):

1. Stop. Leave the tab open as-is.
2. Update the tracker row's Notes with `[YYYY-MM-DD] Form-fill paused at [page/step]: [reason]`.
3. Set the status to `Found` (not `Drafted`) — partial fills are worse than no fill.
4. Move to the next application.

Never try to "work around" a captcha or login wall. That's the line where transparent automation becomes evasion, and the PRD's posture is explicit: we don't cross it.

---

## Post-submission flow

After the user clicks Submit themselves and Claude in Chrome detects the confirmation page (URL change to `/confirmation`, `/thank-you`, or similar, or visible "Application Received" text):

1. Update the tracker row: Status = `Submitted`, Date Applied = today.
2. Note the confirmation page URL in Notes if the ATS provides one.
3. Close the tab.
4. Move to the next application in the queue.

If the confirmation isn't detected within 30 seconds of an apparent submission, leave the row's status as `Drafted` and ask the user to confirm whether it actually submitted. Don't guess.
