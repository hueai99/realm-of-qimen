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
