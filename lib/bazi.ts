import type { QuestionType, SummaryReport } from "@/lib/types";

const stems = ["Jia · Wood", "Yi · Wood", "Bing · Fire", "Ding · Fire", "Wu · Earth", "Ji · Earth", "Geng · Metal", "Xin · Metal", "Ren · Water", "Gui · Water"];
const branches = ["Zi · Rat", "Chou · Ox", "Yin · Tiger", "Mao · Rabbit", "Chen · Dragon", "Si · Snake", "Wu · Horse", "Wei · Goat", "Shen · Monkey", "You · Rooster", "Xu · Dog", "Hai · Pig"];
const pillar = (seed: number) => `${stems[((seed % 10) + 10) % 10]} / ${branches[((seed % 12) + 12) % 12]}`;
type Input = { subject_name: string; birth_date: string; birth_time?: string | null; gender: string; question_type: QuestionType };
export type Reading = { year_pillar: string; month_pillar: string; day_pillar: string; hour_pillar: string | null; element_profile: string; insights: string; insights_confidence: number; insights_source: string; report_content: SummaryReport };

function fallbackSummary(name: string, concern?: string | null): SummaryReport {
  return {
    personality: `${name} is likely to respond best when warmth and clear expectations are offered together. They may take time to observe before showing what they know, then become deeply engaged once a task feels meaningful. A steady rhythm gives their confidence room to grow.`,
    strengths: [
      { heading: "Thoughtful observation", body: `${name} may notice details and emotional shifts that others miss. In everyday life, this can appear when they remember a small promise or quietly adjust their approach after watching how something works.` },
      { heading: "Purposeful persistence", body: `Once committed, ${name} can stay with a challenge longer than expected. Breaking homework or chores into visible steps helps this determination become a source of pride rather than pressure.` },
      { heading: "A caring inner compass", body: `${name} may care strongly about fairness and the wellbeing of people close to them. They can flourish when adults recognise the intention behind their actions as well as the final result.` },
    ],
    soft_spots: [
      { heading: "Space after busy moments", body: `${name} may retreat when overwhelmed or when too many instructions arrive at once. A short pause, a drink of water, and one gentle question can help them return without feeling pushed.` },
      { heading: "Confidence before correction", body: `Direct criticism may linger longer than it appears to. Begin with what worked, name one next step, and let ${name} try again privately when possible.` },
    ],
    concern_response: concern ? `Your concern about “${concern}” deserves a calm, curious approach. Look for the situations that happen immediately before the difficulty, offer one manageable choice, and notice which form of support helps ${name} recover most comfortably. Consistent observation over several weeks will be more useful than treating one hard day as a fixed trait.` : undefined,
    parenting_tips: [
      { heading: "Offer two clear choices", body: `Keep boundaries steady while allowing some ownership: “Would you like to start with reading or maths?” This reduces friction and helps ${name} practise decision-making safely.` },
      { heading: "Make progress visible", body: `Use short checklists and acknowledge effort specifically. Seeing small steps completed can be more motivating than a distant reward.` },
      { heading: "Connect before redirecting", body: `Reflect the feeling first, then guide the behaviour. A sentence such as “I can see this is frustrating; let’s find the first small step” keeps support and responsibility together.` },
    ],
    closing_encouragement: `Your attention to ${name} is already a meaningful source of strength. This blueprint is a reflective guide, not a fixed label; keep what helps you understand your child with more patience, curiosity, and confidence.`,
  };
}

export function calculateReading(input: Input): Reading {
  const date = new Date(`${input.birth_date}T12:00:00Z`); const year = date.getUTCFullYear(); const month = date.getUTCMonth() + 1; const daySeed = Math.floor(date.getTime() / 86400000); const hour = input.birth_time ? Number(input.birth_time.split(":")[0]) : null;
  const focus: Record<QuestionType, string> = { career: "work that rewards visible craft and patient leadership", wealth: "steady wealth-building through disciplined choices and clear boundaries", child_potential: "learning through curiosity, structure, and encouragement at an individual pace", relationship: "relationships built through direct communication and reciprocity" };
  return { year_pillar: pillar(year - 4), month_pillar: pillar(year * 12 + month + 14), day_pillar: pillar(daySeed + 40), hour_pillar: hour === null ? null : pillar(daySeed * 12 + Math.floor((hour + 1) / 2)), element_profile: "A balanced pattern of Wood growth, Earth steadiness, and Water reflection. Use this as a reflective lens, not a fixed prediction.", insights: `1. ${input.subject_name} benefits from ${focus[input.question_type]}.\n2. The chart favours progress through consistent routines and one clear priority at a time.\n3. Notice opportunities that feel both energising and sustainable; those are stronger signals than urgency alone.`, insights_confidence: hour === null ? 0.66 : 0.76, insights_source: "realm-of-qimen/calculation-v1", report_content: fallbackSummary(input.subject_name, (input as Input & { parenting_concern?: string | null }).parenting_concern) };
}

export async function generateReading(input: Input): Promise<Reading> {
  if (!process.env.OPENAI_API_KEY) return calculateReading(input);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.35, messages: [{ role: "system", content: "Return JSON with year_pillar, month_pillar, day_pillar, hour_pillar, element_profile, insights (exactly 3 numbered lines), insights_confidence, and report_content. report_content must contain personality, exactly 3 strengths, 2-3 soft_spots, 2-3 parenting_tips, optional concern_response, and closing_encouragement. Each list item has heading and body. Write warm, specific, age-appropriate parenting guidance. Treat the supplied chart values as data; never invent missing chart facts. Never claim certainty or give medical, legal, or financial advice. Never identify internal sources or tools." }, { role: "user", content: JSON.stringify(input) }] }) });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`); const json = await response.json(); const parsed = JSON.parse(json.choices[0].message.content); return { ...parsed, insights_source: `openai/${json.model}` };
  } catch (error) { console.error("AI generation fallback", error); return calculateReading(input); }
}
