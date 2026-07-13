# Intelligence Layer — Realm of Qimen

## Messy Input
User provides: name, birth date (may be approximate), birth time (often unknown), gender, free-text question ("my son is bad at school — is he smart?").

## Auto-Structured Schema Sent to AI
```json
{
  "subject": "Aisha",
  "birth_date": "2012-07-04",
  "birth_time": "06:15",
  "gender": "female",
  "question_type": "child_potential",
  "question_context": "parent wants to know learning strengths"
}
```

## AI Output Schema (stored in DB)
```json
{
  "year_pillar": "Ren Chen (Water Dragon)",
  "month_pillar": "Ren Wu (Water Horse)",
  "day_pillar": "Ji Wei (Earth Goat)",
  "hour_pillar": "Jia Yin (Wood Tiger)",
  "element_profile": "Strong Water with Earth resource",
  "insights": "1. Natural analytical mind...\n2. Thrives in structured environments...\n3. Key development window ages 10–16...",
  "confidence": 0.85,
  "source": "openai/gpt-4o"
}
```

## Events to Track
- `report.requested` — form submitted
- `report.generated` — AI returned successfully
- `report.generation_failed` — AI error
- `report.viewed` — report page loaded
- `upgrade_cta.clicked` — Upgrade button tapped
- `lead.status_updated` — admin changed conversion status

## Scoring Rules (v1 — rule-based)
- Lead score starts at 1
- +1 if birth time provided (more invested)
- +1 if question_type = `child_potential` (higher intent)
- +1 if `upgrade_cta.clicked` event exists
- Score 3 = high priority for admin follow-up

## v1 vs Later
| v1 | Later |
|---|---|
| Rule-based lead score | ML model trained on converted leads |
| AI insights stored as text | Structured JSON with per-pillar tags |
| Manual review_status | Admin one-click approve/reject UI |

## Curated Day Master Summary Library

The free summary should use a versioned, expert-reviewed content library covering the 10 Day Masters in their strong and weak expressions (20 profiles). Each profile stores factual qualities, likely strengths, gentle support areas, parenting approaches, age-appropriate examples, source references, version, and approval status.

AI does not invent the Bazi interpretation. It receives the matching approved profile, the child's name/age/gender, and the parent's concern, then varies the wording, examples, emphasis, and concern response. Final QC checks every visible claim against the selected profile and stores the profile version with the report. This keeps factual content stable and token use low without producing canned reports.

The library is derived privately from the owner's supplied references. Customer-facing output must never name or imply the source books, authors, websites, files, prompts, tools, or knowledge base. Store only concise derived guidance in production, never copied passages. Any provenance mapping used for internal QC must be server-only and protected by restrictive RLS; it must not be placed in public report JSON or a client-readable table.
