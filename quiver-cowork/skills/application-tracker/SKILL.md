---
name: application-tracker
description: Manages the user's job application tracking system in Google Sheets, which is event-sourced — every action writes an immutable row to the Events tab, and the Applications tab is a state view derived from those events. Use any time the user finds a new job posting, drafts an application, submits one, gets an email reply, schedules an interview, or asks "what's the status of my applications," "what happened today," or "what should I follow up on." Always read this skill before reading from or writing to the tracking sheet. If the user mentions "the tracker," "my applications," "where am I with X company," "log this," or any pipeline question, read this first.
---

# Application Tracker (Event-Sourced)

The pipeline is tracked in a single Google Sheets workbook with six tabs. The model is **event-sourced**: the `Events` tab is the source of truth, append-only. The `Applications` tab is a state view derived from events. This means: history is never lost, every change is queryable, and mistakes are recoverable (you can replay events if Applications gets corrupted).

## Where the workbook lives

- **Workbook name:** `Applications — [USER NAME]`
- **Drive URL:** [SET ON FIRST RUN]
- **Tabs:** `Applications`, `Events`, `Market Snapshots`, `Saved Searches`, `Look-Alike Analysis`, `Dashboard`, `Profile Quick Ref`

If the URL is `[SET ON FIRST RUN]`, walk the user through creating the workbook from the template before doing anything else.

## The cardinal rule

**Every meaningful change writes an Event.** The Applications tab is just a view. If you update a status on Applications without writing an Event, you've broken the model — the history is now incomplete and the dashboard's "Days Since Last Event" will mislead.

The reverse is also a rule: **every Applications row corresponds to events**. A row with no events shouldn't exist. If you find one, it's a bug — investigate before continuing.

---

## Tab 1: Applications (state view)

One row per unique job posting. This is what the user looks at to see current pipeline state.

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | App ID | Text | `APP-NNNNN`. Stable forever. Foreign key for Events. |
| B | Date Found | Date | Day the posting first appeared. Set once. |
| C | Date Applied | Date | Day user submitted. Blank until then. Set once. |
| D | Company | Text | Canonical name. Match LinkedIn capitalization. |
| E | Role | Text | Title as posted. |
| F | Source | Text | Comma-separated if found on multiple boards. |
| G | Posting URL | URL | Primary URL. Add others to Notes. |
| H | Salary Band | Text | As posted. Never guess. |
| I | Match Score | Number 0-100 | From discovery scoring. |
| J | Status | Enum | Current status. Always one of the 9 legal values. |
| K | Connection at Co. | Text | Strongest 1st-degree LinkedIn connection. |
| L | Outreach Sent | Date | When the user clicked Send on a referral DM. |
| M | Last Event Date | Date | **Computed.** Pulled from Events via MAXIFS. Don't edit. |
| N | Days Since Last Event | Number | **Computed.** Drives the "needs attention" highlights. |
| O | Notes | Text | Long-form context. Append-only convention (don't overwrite). |

## Tab 2: Events (source of truth, append-only)

Every action in the system writes a row here. Never delete, never reorder, never edit a past row.

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | Event ID | Text | `EVT-NNNNN`. Monotonically increasing. |
| B | Timestamp | DateTime | When the event occurred. Use the real time, not the day. |
| C | App ID | Text | Foreign key to Applications. Blank for system-wide events (e.g., Market Snapshot). |
| D | Event Type | Enum | See the legal types below. |
| E | Description | Text | One-sentence human-readable summary. The most important field. |
| F | Source | Enum | Who or what created the event. |
| G | Old Value | Text | For status/data changes. Blank otherwise. |
| H | New Value | Text | For status/data changes. Blank otherwise. |
| I | Email Subject | Text | When the source is Gmail Watcher, the triggering email's subject. |
| J | Notes | Text | Any structured data, references, or context. |

### Legal Event Types

| Type | When to write | App ID? | Old/New? |
|------|--------------|---------|----------|
| `Discovery Found` | Discovery surfaces a new posting | Yes | No |
| `Discovery Duplicate` | Discovery saw a posting that already exists in Applications | Yes | No |
| `Application Drafted` | Cowork filled the form, awaiting user review | Yes | No |
| `Application Submitted` | User submitted via the browser | Yes | No |
| `Email Received` | Gmail Watcher detected an incoming email about an app | Yes | No |
| `Status Changed` | A status transition occurred | Yes | **Yes** |
| `Interview Scheduled` | Calendar invite confirmed and added | Yes | No |
| `Interview Completed` | User marks interview done | Yes | No |
| `Outreach Drafted` | LinkedIn DM staged in compose | Yes | No |
| `Outreach Sent` | User clicked Send on a referral DM | Yes | No |
| `Note Added` | User added a note about an application | Yes | No |
| `Application Archived` | User discarded an application | Yes | No |
| `Market Snapshot` | Discovery wrote a summary stat row to Market Snapshots | **No** | No |
| `Manual Edit` | User made a manual change in the sheet | Yes | Maybe |
| `Reminder Set` | A follow-up nudge was scheduled | Yes | No |
| `Reality Check` | reality-check skill delivered contrarian feedback | **No** (system-level) | No |
| `Look-Alike Analysis` | look-alike-analysis skill ran a profile-pattern study | **No** (system-level) | No |

### Legal Event Sources

`User`, `Discovery`, `Gmail Watcher`, `Calendar Watcher`, `Form-Fill Agent`, `Outreach Agent`, `Scheduled Task`, `Manual`

### Legal Status Values

`Found`, `Drafted`, `Submitted`, `Acknowledged`, `Interview`, `Offer`, `Rejected`, `Ghosted`, `Archived`

## Tab 3: Market Snapshots

See the `market-intelligence` skill. The application-tracker skill writes a `Market Snapshot` event row when discovery records snapshot data, but doesn't manage the snapshot tab itself.

## Tab 4: Saved Searches

The discovery configuration. Each row is one search that runs on a schedule.

| Col | Header |
|-----|--------|
| A | Search ID (`SRCH-NNN`) |
| B | Search Name (human-readable) |
| C | Boards (comma-separated) |
| D | Keywords |
| E | Location |
| F-H | Remote OK / Hybrid OK / Onsite OK (Yes/No) |
| I | Salary Floor |
| J | Schedule (Hourly/Daily/Weekly/Manual) |
| K | Active (Yes/No) |
| L | Last Run |
| M | Last Result Count |
| N | Notes |

Discovery reads this tab. When the user asks "add a new search for X" or "disable the staff engineer search," update this tab.

---

## Write protocols

### When discovery finds a new posting

1. **Check for duplicates.** Match by Posting URL first, then by (Company + Role + within 30 days).
   - If duplicate found, write an Event of type `Discovery Duplicate` with the App ID and add the new source to Applications.F. Stop. Don't insert a new row.
2. **Generate the next App ID.** `=MAX(numeric parts of column A) + 1`, formatted as `APP-NNNNN` (5 digits zero-padded).
3. **Append to Applications:**
   - App ID, Date Found = today, Company, Role, Source, URL, Salary Band, Match Score
   - Status = `Found`
   - Other fields blank
4. **Append to Events:**
   - Event ID = next, Timestamp = now (use real time, not midnight)
   - App ID = the new APP-NNNNN
   - Event Type = `Discovery Found`
   - Description = `"Discovery found [Role] at [Company] via [Source] (match score [N])."`
   - Source = `Discovery`
5. **Update Saved Searches.L** with today's date and `Last Result Count`.

### When Cowork fills out an application form

1. **Update Applications.J** (Status) from `Found` to `Drafted`.
2. **Append to Events:**
   - Event Type = `Status Changed`
   - Description = `"Drafted application for [Role] at [Company]. Awaiting user review."`
   - Source = `Form-Fill Agent`
   - Old Value = `Found`
   - New Value = `Drafted`

If form-fill fails partway, do NOT change the status. Write an Event with type `Note Added` describing the failure point.

### When user clicks Submit (detected via browser confirmation page)

1. **Update Applications:** Status = `Submitted`, Date Applied = today.
2. **Append to Events:**
   - Event Type = `Status Changed`
   - Description = `"User submitted application for [Role] at [Company]."`
   - Source = `User` (the user did the actual submit)
   - Old Value = `Drafted`
   - New Value = `Submitted`

### When Gmail Watcher detects an email about an application

1. **Identify which App ID** the email refers to (match by company name in subject/body, then by recruiter domain).
2. **Classify the email** into one of: acknowledgment, interview invite, rejection, ambiguous.
3. **Write an Event of type `Email Received`** regardless of classification:
   - Description = a one-sentence summary of the email
   - Email Subject = the actual subject line
   - Notes = sender, key dates if any
4. **If the classification is unambiguous, ALSO write a `Status Changed` event** and update Applications.J:
   - Acknowledgment → `Acknowledged`
   - Interview invite → `Interview`
   - Rejection → `Rejected`
5. **If ambiguous, do NOT change status.** Add a note to Applications.O: `[YYYY-MM-DD] Email received, status unclear — see inbox`.

### When the user manually changes a status

The user might edit Applications.J directly. We can't prevent this, but when we detect it:

1. **Write an Event of type `Manual Edit`:**
   - Source = `Manual`
   - Description = `"User manually changed status from [old] to [new]."`
   - Old Value, New Value populated.

This preserves the audit trail even when the user bypasses the agent.

### When archiving an application

1. **Update Applications.J** = `Archived`.
2. **Append `Status Changed` event** with the old status and reason in Description.
3. Never delete the Applications row. Archived rows stay for history.

---

## Query protocols

When the user asks a status question, derive the answer from Events, not Applications, whenever history matters.

### "Summarize my pipeline"

1. Use Dashboard's existing computed values. Don't re-derive.
2. Surface: counts by status, anything in `Drafted` >3 days, anything in `Submitted` >14 business days silent, interviews this week.

### "What happened this week?"

1. Filter Events: Timestamp >= today - 7.
2. Group by day, then by Event Type.
3. Show counts and 2-3 representative descriptions.

### "What should I follow up on?"

1. Filter Applications where Status = `Submitted` AND `Days Since Last Event` > 10 business days.
2. Show Company, Role, Days Since, and last event description.
3. Offer to draft follow-up emails.

### "When did I apply to X company?"

1. Find the App ID for the company (may be multiple if multiple roles).
2. Filter Events by App ID, sort by Timestamp.
3. Show the timeline.

### "Replay the history of application Y"

1. Filter Events by App ID = Y, sort by Timestamp ascending.
2. Render as a timeline with timestamps and descriptions.

---

## Recovery protocols

### If Applications drifts from Events

Symptoms: status in Applications doesn't match the latest `Status Changed` event for that App ID; Last Event Date computed value is suspicious.

1. Stop writing.
2. Tell the user there's a drift. List the rows where the issue is.
3. Offer to **rebuild Applications.J from Events** by taking, for each App ID, the most recent `Status Changed` event's New Value.

### If Events is missing rows

This shouldn't happen unless the user manually deleted rows. We can't recover lost events. Note the gap and continue forward — never fabricate events to fill in.

---

## Sanity checks before any session

When a job-search session starts (any task that touches the tracker):

1. Verify the Drive URL is set.
2. Read the dashboard counts. If they look wildly off from last session, pause and ask before continuing.
3. Check that the Events tab's most recent Event ID is greater than or equal to its previous value. If it went backward, something is wrong.

The tracker is the system's memory. A bad write is worse than a paused session.
