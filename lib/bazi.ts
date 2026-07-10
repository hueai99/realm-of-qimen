import type { QuestionType } from "@/lib/types";

const stems = ["Jia · Wood", "Yi · Wood", "Bing · Fire", "Ding · Fire", "Wu · Earth", "Ji · Earth", "Geng · Metal", "Xin · Metal", "Ren · Water", "Gui · Water"];
const branches = ["Zi · Rat", "Chou · Ox", "Yin · Tiger", "Mao · Rabbit", "Chen · Dragon", "Si · Snake", "Wu · Horse", "Wei · Goat", "Shen · Monkey", "You · Rooster", "Xu · Dog", "Hai · Pig"];
const pillar = (seed: number) => `${stems[((seed % 10) + 10) % 10]} / ${branches[((seed % 12) + 12) % 12]}`;
type Input = { subject_name: string; birth_date: string; birth_time?: string | null; gender: string; question_type: QuestionType };
export type Reading = { year_pillar: string; month_pillar: string; day_pillar: string; hour_pillar: string | null; element_profile: string; insights: string; insights_confidence: number; insights_source: string };

export function calculateReading(input: Input): Reading {
  const date = new Date(`${input.birth_date}T12:00:00Z`); const year = date.getUTCFullYear(); const month = date.getUTCMonth() + 1; const daySeed = Math.floor(date.getTime() / 86400000); const hour = input.birth_time ? Number(input.birth_time.split(":")[0]) : null;
  const focus: Record<QuestionType, string> = { career: "work that rewards visible craft and patient leadership", wealth: "steady wealth-building through disciplined choices and clear boundaries", child_potential: "learning through curiosity, structure, and encouragement at an individual pace", relationship: "relationships built through direct communication and reciprocity" };
  return { year_pillar: pillar(year - 4), month_pillar: pillar(year * 12 + month + 14), day_pillar: pillar(daySeed + 40), hour_pillar: hour === null ? null : pillar(daySeed * 12 + Math.floor((hour + 1) / 2)), element_profile: "A balanced pattern of Wood growth, Earth steadiness, and Water reflection. Use this as a reflective lens, not a fixed prediction.", insights: `1. ${input.subject_name} benefits from ${focus[input.question_type]}.\n2. The chart favours progress through consistent routines and one clear priority at a time.\n3. Notice opportunities that feel both energising and sustainable; those are stronger signals than urgency alone.`, insights_confidence: hour === null ? 0.66 : 0.76, insights_source: "realm-of-qimen/calculation-v1" };
}

export async function generateReading(input: Input): Promise<Reading> {
  if (!process.env.OPENAI_API_KEY) return calculateReading(input);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.4, messages: [{ role: "system", content: "Return JSON with year_pillar, month_pillar, day_pillar, hour_pillar, element_profile, insights (exactly 3 numbered lines), insights_confidence. Create a respectful Bazi-inspired reflection. Never claim certainty or give medical, legal, or financial advice." }, { role: "user", content: JSON.stringify(input) }] }) });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`); const json = await response.json(); const parsed = JSON.parse(json.choices[0].message.content); return { ...parsed, insights_source: `openai/${json.model}` };
  } catch (error) { console.error("AI generation fallback", error); return calculateReading(input); }
}
