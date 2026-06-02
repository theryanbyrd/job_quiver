---
name: market-intelligence
description: Records and analyzes job market metadata over time. Every discovery run logs a snapshot row to the Market Snapshots tab — total results per search per source, new vs. duplicate counts, median salary, top employers — so the user can spot trends like "is the senior backend market in Utah shrinking, growing, or steady" and "are salaries for product owners moving." Use any time the user asks about market trends, "how many jobs are out there," "is hiring picking up," "what does the market look like for X role," or whenever discovery completes a run. Always read this skill before reading from or writing to the Market Snapshots tab.
---

# Market Intelligence

The tracking system records not just applications but the *market itself*. Every discovery run leaves a fingerprint — how many jobs exist for a given search, where they cluster, what salaries are on offer. Over weeks and months, this becomes a private dataset showing the user's slice of the job market in motion.

## Where the data lives

In the same workbook as the application tracker, on the `Market Snapshots` tab. Set the URL in the `application-tracker` skill — both skills share the workbook.

## Tab schema: Market Snapshots

One row per (saved search × source × day). If a search runs against 3 boards, that's 3 snapshot rows per day.

| Col | Header | Type | Notes |
|-----|--------|------|-------|
| A | Snapshot ID | Text | `SNAP-NNNNN` |
| B | Snapshot Date | Date | Day the discovery ran |
| C | Search Name | Text | Matches `Saved Searches.B` |
| D | Source | Enum | `LinkedIn`, `Indeed`, `ZipRecruiter`, etc. |
| E | Query Terms | Text | The actual search string used |
| F | Location | Text | The location filter applied |
| G | Total Results | Number | Total postings the board returned (before dedup) |
| H | New Results | Number | How many of those were new to Applications |
| I | Median Salary Low | Number | Median of posted salary range floors (if any) |
| J | Median Salary High | Number | Median of posted salary range ceilings |
| K | Top Employer | Text | Most-occurring employer in the result set |
| L | Top Employer Count | Number | How many postings the top employer had |
| M | Notes | Text | Anything unusual: rate limits hit, board returned errors, etc. |

## Write protocol

### When a discovery run completes for a (search, board) pair

After Discovery has finished iterating through that board's results and written `Discovery Found` / `Discovery Duplicate` events to the Events tab:

1. **Compute the snapshot stats** from the board's response:
   - `Total Results` = raw count from the board's results page
   - `New Results` = count of `Discovery Found` events written this run for this search/board
   - `Median Salary Low/High` = median of posted salaries (only postings that include them; if fewer than 5 postings have salaries, leave blank)
   - `Top Employer` and `Top Employer Count` = the most-occurring company in the result set
2. **Append to Market Snapshots** with the next Snapshot ID.
3. **Append a `Market Snapshot` event to the Events tab:**
   - App ID = blank (this isn't tied to a specific application)
   - Event Type = `Market Snapshot`
   - Description = `"Snapshot: '[Search Name]' on [Source] returned [Total] postings ([New] new). Top employer: [X] ([N] postings)."`
   - Source = `Discovery`
4. **Update `Saved Searches.L` (Last Run)** to today and `Last Result Count` to Total Results summed across sources.

### When discovery is rate-limited or the board returns an error

Still write a snapshot row, but:
- `Total Results` = whatever was returned before the error (could be 0)
- `Notes` = describe the failure (`"Rate limited after page 2"`, `"Board returned 503"`, etc.)
- Also write an Event of type `Note Added` describing the issue, so it shows up in the activity log.

Partial data is more useful than no data for trend purposes — gaps in the snapshot history obscure whether the market changed or just whether we were watching.

## Query protocols

### "How is the [role] market trending?"

1. Filter Market Snapshots by Search Name (or by keyword in Query Terms).
2. Plot `Total Results` over `Snapshot Date`, aggregated weekly (sum across sources).
3. Compute the slope of the last 4 weeks vs. the previous 4 weeks.
4. Surface: current weekly average, change %, biggest contributing source.
5. Format:

```
Market trend: Senior Backend, Utah Remote
─────────────────────────────────────────
Last 4 weeks avg:  127 postings/week
Prior 4 weeks avg: 142 postings/week
Change:            −10.6% (slight cooling)
Strongest source:  LinkedIn (62% of postings)
Top employers:     [Company A] (12), [Company B] (8), [Company C] (7)
```

### "What's the salary landscape for [search]?"

1. Filter snapshots for that search over the last 90 days.
2. Compute the median of `Median Salary Low` and `Median Salary High` across snapshots.
3. Surface the range and how it's shifted vs. the same window 3 months ago.

Don't over-interpret — most postings don't include salary, and the ones that do are often anchor postings (high end) or compliance-driven postings (states that require disclosure). Note this caveat in the output.

### "Which boards are most active for my search?"

1. Filter Market Snapshots for the last 30 days.
2. Group by Source, sum Total Results.
3. Surface the ranking. Useful for deciding which boards to keep in the saved search vs. drop.

### "Show me employers I haven't applied to but who post a lot"

1. Aggregate `Top Employer` counts across recent snapshots.
2. Cross-reference against Applications.D (companies the user has applied to).
3. Surface the top 10 employers from snapshots who don't appear in Applications.

Useful for surfacing companies the user should pay attention to even if specific roles don't surface in matches.

## What this is NOT for

- **Not an external job-market dashboard.** This is the user's private observation of their slice of the market. The data is biased toward what their saved searches look at.
- **Not a hiring forecast.** Trends here reflect posting volume, not actual hiring. A board can have 500 postings and 0 hires.
- **Not a salary survey.** Posted salaries skew high (compliance-driven) and are missing on most postings. The median here is a directional signal, not ground truth.

## Sampling cadence

For trends to be readable, discovery needs to run consistently. The recommended cadence:
- **Daily snapshots:** for searches the user is actively pursuing
- **Weekly snapshots:** for searches the user is monitoring but not applying to (e.g., "what's the market doing for Director roles in case I want to pivot")

If a search hasn't been run in >7 days, the trend chart will have gaps. Note this in the output, don't smooth over it.

## Retention

Market Snapshots is append-only forever. Don't delete old rows. The dataset becomes more valuable over time — 12 months of weekly snapshots beats 3 months of daily ones.

If the tab grows past 5000 rows (~3 years of daily snapshots across 5 searches × 3 sources), offer to archive the oldest snapshots to a separate tab. Don't archive automatically.
