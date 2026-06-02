---
name: job-profile
description: The canonical source of truth for the user's job search profile — work history, education, target roles, salary floor, location constraints, work authorization, EEO disclosures, company blocklist, and résumé file locations. Use this skill any time the user asks Claude to find jobs, evaluate a job posting, fill out an application, draft a cover letter, or send outreach. Always read this skill before touching a job board or application form. If the user mentions "my profile," "my résumé," "my preferences," "find me jobs," "apply to," or anything job-search related, read this first.
---

# Job Profile

The single source of truth for everything Claude needs to know about the job seeker. Every job search, application, cover letter, and outreach message pulls from this file.

## How to use this skill

1. **Read this file at the start of every job-search session.** Before touching a job board, opening an application form, or drafting a cover letter, refresh on these contents.
2. **When the user updates a fact, update this file.** If they say "I'm willing to consider Boise now" or "raise my salary floor to $200K," edit this skill and confirm.
3. **Never invent data.** If a field is marked `[NOT SET]`, do not guess. Pause the task and ask the user to fill it in.
4. **EEO and work-auth answers are sensitive.** Only use the values explicitly stored here. If an application asks something not covered, stop and ask.

---

## Identity

- **Full legal name:** [NOT SET]
- **Preferred name (for cover letters):** [NOT SET]
- **Email (primary contact):** [NOT SET]
- **Phone:** [NOT SET]
- **City, State, ZIP:** [NOT SET]
- **LinkedIn URL:** [NOT SET]
- **GitHub / portfolio URL:** [NOT SET]
- **Personal website:** [NOT SET]

## Work authorization

- **U.S. work authorization:** [NOT SET]  (e.g., "U.S. citizen", "Green card", "H-1B requires sponsorship")
- **Requires sponsorship now or in future:** [NOT SET]  (Yes / No)
- **Security clearance:** [NOT SET]  (e.g., "None", "Secret — active", "TS/SCI — inactive")

## Target roles

- **Primary titles to search for:** [NOT SET]  (e.g., "Senior Backend Engineer", "Staff Engineer", "Engineering Manager")
- **Secondary titles (also acceptable):** [NOT SET]
- **Seniority level:** [NOT SET]  (entry / mid / senior / staff / principal / director / VP)
- **Industries OK:** [NOT SET]
- **Industries to exclude:** [NOT SET]

## Compensation

- **Base salary floor (USD):** [NOT SET]
- **Base salary target:** [NOT SET]
- **Total comp floor:** [NOT SET]
- **Equity preference:** [NOT SET]  (e.g., "OK with equity-heavy", "Cash-weighted preferred")

## Location and work mode

- **Home city/metro:** [NOT SET]
- **Remote OK:** [NOT SET]  (Yes / No)
- **Hybrid OK:** [NOT SET]  (Yes / No)
- **Onsite OK — cities:** [NOT SET]
- **Willing to relocate to:** [NOT SET]
- **Time zones acceptable:** [NOT SET]

## Company blocklist

Never surface or apply to roles at these companies.

- [NOT SET]

## Keyword blocklist

Skip any posting whose title or description contains these terms.

- [NOT SET]  (e.g., "crypto", "unpaid", "commission-only", "1099")

## EEO and self-identification (only used when an application explicitly asks)

- **Gender:** [NOT SET]  (or "Decline to self-identify")
- **Race/ethnicity:** [NOT SET]  (or "Decline to self-identify")
- **Veteran status:** [NOT SET]  (Veteran / Not a veteran / Decline)
- **Disability status:** [NOT SET]  (Yes / No / Decline)

## Work history

Most recent first. Each entry should be detailed enough to populate a Workday-style work history form without guessing.

### [COMPANY NAME] — [TITLE]
- **Start:** [MM/YYYY]
- **End:** [MM/YYYY or "Present"]
- **Location:** [CITY, STATE]
- **Type:** [Full-time / Contract / etc.]
- **Reason for leaving:** [NOT SET]
- **Manager name + email (for references):** [NOT SET]
- **Summary (2-3 sentences):** [NOT SET]
- **Top 3 accomplishments:** [NOT SET]

*(Add additional `### [COMPANY NAME] — [TITLE]` blocks for each prior role.)*

## Education

### [SCHOOL]
- **Degree:** [NOT SET]
- **Field of study:** [NOT SET]
- **Graduation:** [MM/YYYY]
- **GPA (only if asked and if >= 3.5):** [NOT SET]
- **Honors:** [NOT SET]

## Skills and certifications

- **Core technical skills:** [NOT SET]
- **Languages (programming):** [NOT SET]
- **Languages (spoken):** [NOT SET]
- **Certifications:** [NOT SET]

## Résumé variants

Stored in Google Drive. Each variant is paired with the saved searches it applies to. When filling out an application, pick the variant matching the search that surfaced the role.

- **Default / IC engineer:** [DRIVE LINK]
- **Engineering leadership:** [DRIVE LINK]
- **Career-change framing:** [DRIVE LINK]
- **Federal / cleared work:** [DRIVE LINK]

## Reference contacts

Used only when an application explicitly asks for references and the user has approved their use this cycle.

| Name | Title | Company | Email | Phone | Relationship |
|------|-------|---------|-------|-------|--------------|
| [NOT SET] | | | | | |

## Standard answers to common open-ended questions

Pre-written answers for questions that show up on nearly every application. Use these verbatim unless tailoring is explicitly requested.

- **"Why are you interested in this role?":** [NOT SET]  *(generic version — should be tailored per posting using the cover-letter skill)*
- **"What are your salary expectations?":** [NOT SET]  *(usually a range; keep it consistent with the comp section above)*
- **"When can you start?":** [NOT SET]
- **"How did you hear about us?":** [NOT SET]  *(safe default: "LinkedIn" or "Company website")*

---

## Update protocol

When the user asks Claude to update any field:

1. Confirm the new value back to the user before saving.
2. Edit this `SKILL.md` file directly.
3. Note the change in a one-line comment at the bottom of the section, e.g., `<!-- Salary floor raised from $180K to $200K on 2026-05-15 -->`
4. Do not silently update any downstream document (cover letters, sheet entries, etc.). The update propagates naturally on the next session.
