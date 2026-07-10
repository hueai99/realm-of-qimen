# Agentic Layer — Realm of Qimen

## Risk Levels & Actions

### Low Risk — Auto (no approval needed)
| Action | Tool | Trigger |
|---|---|---|
| Generate Bazi pillars + insights | `generate_bazi_report` | Form submitted |
| Tag question type from free text | `classify_question` | On intake |
| Score lead (rule-based) | `score_lead` | On lead insert |

### Medium Risk — Light Approval
| Action | Tool | Trigger |
|---|---|---|
| Mark lead as `contacted` | `update_lead_status` | Admin clicks button — 1-click confirm |
| Flag AI insight for re-generation | `flag_insight` | Admin marks `review_status = rejected` |

### High Risk — Always Approval
| Action | Tool | Trigger |
|---|---|---|
| Send consult confirmation message | `send_whatsapp_message` *(later)* | Admin approves after payment |
| Issue refund | *(human only — see below)* | — |

### Critical — Human Only
- Delete any lead or report record
- Process refunds
- Modify billing or legal data

## Audit Log Fields (every action writes one row)
```
actor | action | target_table | target_id | payload (before/after) | created_at
```

## Named Tools (approved list)
- `generate_bazi_report` — calls OpenAI, writes to `bazi_reports`
- `classify_question` — maps free text to enum
- `score_lead` — reads events, returns integer
- `update_lead_status` — updates `leads.conversion_status` + writes audit row
- `flag_insight` — sets `insights_review_status`

No `run_any`, no `exec_sql`, no `send_any`. Every tool is a named server-side function with typed inputs.

## v1 vs Later
| v1 | Later |
|---|---|
| Manual admin status updates | Agent surfaces high-score leads automatically |
| No outbound messages | WhatsApp / email with human approval |
