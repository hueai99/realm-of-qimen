import type { QuestionType, SummaryReport } from "@/lib/types";
import { Solar } from "lunar-javascript";

const stems: Record<string, [string, string]> = { "甲":["Jia","Wood"], "乙":["Yi","Wood"], "丙":["Bing","Fire"], "丁":["Ding","Fire"], "戊":["Wu","Earth"], "己":["Ji","Earth"], "庚":["Geng","Metal"], "辛":["Xin","Metal"], "壬":["Ren","Water"], "癸":["Gui","Water"] };
const branches: Record<string, [string, string]> = { "子":["Zi","Rat"], "丑":["Chou","Ox"], "寅":["Yin","Tiger"], "卯":["Mao","Rabbit"], "辰":["Chen","Dragon"], "巳":["Si","Snake"], "午":["Wu","Horse"], "未":["Wei","Goat"], "申":["Shen","Monkey"], "酉":["You","Rooster"], "戌":["Xu","Dog"], "亥":["Hai","Pig"] };
const formatPillar = (gan: string, zhi: string) => `${gan} · ${stems[gan][0]} ${stems[gan][1]} / ${zhi} · ${branches[zhi][1]}`;
const seasonByBranch: Record<string, "Spring" | "Summer" | "Autumn" | "Winter"> = { "寅":"Spring", "卯":"Spring", "辰":"Spring", "巳":"Summer", "午":"Summer", "未":"Summer", "申":"Autumn", "酉":"Autumn", "戌":"Autumn", "亥":"Winter", "子":"Winter", "丑":"Winter" };
const seasonalState = {
  Spring: { Wood:"Prosperous", Fire:"Strong", Water:"Weak", Metal:"Trapped", Earth:"Dead" },
  Summer: { Fire:"Prosperous", Earth:"Strong", Wood:"Weak", Water:"Trapped", Metal:"Dead" },
  Autumn: { Metal:"Prosperous", Water:"Strong", Earth:"Weak", Fire:"Trapped", Wood:"Dead" },
  Winter: { Water:"Prosperous", Wood:"Strong", Metal:"Weak", Earth:"Trapped", Fire:"Dead" },
} as const;
const tenGodNames: Record<string, [string, string]> = { "比肩":["Bi Jian","Friend"], "劫财":["Jie Cai","Rob Wealth"], "食神":["Shi Shen","Eating God"], "伤官":["Shang Guan","Hurting Officer"], "偏财":["Pian Cai","Indirect Wealth"], "正财":["Zheng Cai","Direct Wealth"], "七杀":["Qi Sha","Seven Killings"], "正官":["Zheng Guan","Direct Officer"], "偏印":["Pian Yin","Indirect Resource"], "正印":["Zheng Yin","Direct Resource"] };
type Input = { subject_name: string; birth_date: string; birth_time?: string | null; gender: string; question_type: QuestionType };
export type Reading = { year_pillar: string; month_pillar: string; day_pillar: string; hour_pillar: string | null; element_profile: string; insights: string; insights_confidence: number; insights_source: string; insights_review_status?: "reviewed" | "rejected"; report_content: SummaryReport; chart_status: "verified"; chart_data: Record<string, unknown> };

type QcResult = { approved: boolean; issues: string[]; reviewer: string };
const unsupportedClaims = /\b(top structure|profile star|ranked star|destined|guaranteed|will definitely|diagnos(?:e|is)|scientifically proven|dead|trapped)\b/i;
const aiStylePhrases = /\b(delv(?:e|es|ing)|tapestry|unlock(?:ing)?|transformative|profound|multifaceted|navigate the complexities|in today'?s world|it is important to note|it'?s worth noting|moreover|furthermore|in conclusion|serves as a testament|embark on|holistic journey)\b/i;
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const elementStyle: Record<string, string> = {
  Wood: "curiosity, growth, and a wish to keep moving forward",
  Fire: "warmth, expression, and enthusiasm",
  Earth: "steadiness, practicality, and care for what feels secure",
  Metal: "clear standards, attention to detail, and a strong sense of what feels right",
  Water: "observation, adaptability, and thoughtful curiosity",
};

function deterministicQc(reading: Reading): QcResult {
  const issues: string[] = [];
  const summary = reading.report_content;
  const prose = JSON.stringify(summary);
  const chart = reading.chart_data as { day_master?: string; day_master_strength?: string; season?: string };
  if (!reading.year_pillar || !reading.month_pillar || !reading.day_pillar || !chart.day_master || !chart.day_master_strength || !chart.season) issues.push("verified chart data is incomplete");
  if (!summary?.personality || summary.strengths?.length !== 3 || summary.soft_spots?.length < 2 || summary.parenting_tips?.length < 2 || !summary.closing_encouragement) issues.push("summary structure is incomplete");
  if (chart.day_master && !summary.personality.includes(chart.day_master)) issues.push("personality explanation does not identify the verified Day Master");
  if (unsupportedClaims.test(prose)) issues.push("unsupported or over-certain claim detected");
  if (aiStylePhrases.test(prose)) issues.push("formulaic AI-style wording detected");
  const sections = [...(summary.strengths ?? []), ...(summary.soft_spots ?? []), ...(summary.parenting_tips ?? [])];
  if (sections.some(({ heading }) => !heading || words(heading) > 6)) issues.push("section heading format is inconsistent");
  if (sections.some(({ body }) => words(body) < 12 || words(body) > 85)) issues.push("section length is outside the parent-friendly range");
  if (words(summary.personality ?? "") < 45 || words(summary.personality ?? "") > 180) issues.push("opening explanation is too brief or overwhelming");
  if (words(summary.closing_encouragement ?? "") < 25 || words(summary.closing_encouragement ?? "") > 90) issues.push("closing encouragement is too brief or overwhelming");
  const repeatedOpenings = sections.map(({ body }) => body.trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase());
  if (new Set(repeatedOpenings).size !== repeatedOpenings.length) issues.push("repetitive sentence openings detected");
  return { approved: issues.length === 0, issues, reviewer: "rules/expert-bazi-and-editorial-qc-v2" };
}

function withQc(reading: Reading, qc: QcResult): Reading {
  return { ...reading, insights_review_status: qc.approved ? "reviewed" : "rejected", chart_data: { ...reading.chart_data, expert_qc: { ...qc, reviewed_at: new Date().toISOString() } } };
}

function groundedSummary(name: string, dayMaster: string, element: string, strength: "Strong" | "Weak", _season: string, _seasonalStateName: string, concern?: string | null): SummaryReport {
  const support = strength === "Weak"
    ? `These qualities may come through most clearly when ${name} has time to prepare, feels reassured, and knows what comes next. This says nothing about being a strong or weak person.`
    : `These qualities may be easy to see in ${name}. They may benefit from room to make choices, use their natural drive, and practise adapting when plans change.`;
  const seasonLink = `${dayMaster} is ${name}'s Day Master—the chart's starting point for understanding temperament. In everyday terms, ${element} is associated with ${elementStyle[element]}. ${support}`;
  return {
    personality: `${seasonLink} You may notice this most clearly in how they approach new people, unfamiliar tasks, or moments when expectations feel high.`,
    strengths: [
      { heading: `${element} clarity`, body: `${name} may prefer to understand what is expected before beginning. Clear examples and one manageable first step can help their natural ${element} qualities become easier to express.` },
      { heading: "Purposeful persistence", body: `Once a task feels safe and meaningful, ${name} may stay with it longer than expected. Breaking homework or chores into visible steps helps determination grow without unnecessary pressure.` },
      { heading: "Learning through experience", body: `${name} is more than a chart. Notice when they are most engaged, calm, and curious; those real-life patterns are the best way to decide which parts of this reflection are useful.` },
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
    closing_encouragement: `Your attention to ${name} is already a meaningful source of strength. Bazi is a traditional reflective framework—not a religion, prediction, or fixed destiny. Birth-time accuracy, age, environment, experience, and personal choices all matter, so keep what helps and set aside what does not fit.`,
  };
}

export function calculateReading(input: Input): Reading {
  const [year, month, day] = input.birth_date.split("-").map(Number); const [hour, minute] = (input.birth_time ?? "12:00").split(":").map(Number);
  const chart = Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar().getEightChar();
  const values = { year: [chart.getYearGan(), chart.getYearZhi()], month: [chart.getMonthGan(), chart.getMonthZhi()], day: [chart.getDayGan(), chart.getDayZhi()], hour: [chart.getTimeGan(), chart.getTimeZhi()] } as const;
  const season = seasonByBranch[values.month[1]]; const dayElement = stems[values.day[0]][1] as "Wood"|"Fire"|"Earth"|"Metal"|"Water"; const state = seasonalState[season][dayElement]; const strength = state === "Prosperous" || state === "Strong" ? "Strong" : "Weak";
  const lunar = Solar.fromYmdHms(year, month, day, hour, minute, 0).getLunar(); const rawGods = [...lunar.getBaZiShiShenGan(), ...lunar.getBaZiShiShenZhi()].filter((name: string) => name !== "日主");
  const tenGods = rawGods.map((name: string) => ({ name, pinyin: tenGodNames[name]?.[0] ?? name, english: tenGodNames[name]?.[1] ?? name }));
  const focus: Record<QuestionType, string> = { career: "work that rewards visible craft and patient leadership", wealth: "steady wealth-building through disciplined choices and clear boundaries", child_potential: "learning through curiosity, structure, and encouragement at an individual pace", relationship: "relationships built through direct communication and reciprocity" };
  const dayMaster = `${stems[values.day[0]][0]} ${stems[values.day[0]][1]}`;
  return { year_pillar: formatPillar(...values.year), month_pillar: formatPillar(...values.month), day_pillar: formatPillar(...values.day), hour_pillar: input.birth_time ? formatPillar(...values.hour) : null, element_profile: `${dayMaster} Day Master — ${strength}. “Strength” describes seasonal energy balance, not strength of character.`, insights: `1. ${input.subject_name} benefits from ${focus[input.question_type]}.\n2. The chart favours progress through consistent routines and one clear priority at a time.\n3. Notice opportunities that feel both energising and sustainable; those are stronger signals than urgency alone.`, insights_confidence: input.birth_time ? 0.9 : 0.78, insights_source: "calculation/validated-v3", report_content: groundedSummary(input.subject_name, dayMaster, dayElement, strength, season, state, (input as Input & { parenting_concern?: string | null }).parenting_concern), chart_status: "verified", chart_data: { ...values, day_master: dayMaster, day_master_strength: strength, seasonal_state: state, season, strength_method: "season-first-v1", strength_review_status: state === "Prosperous" || state === "Dead" ? "high-confidence" : "review-recommended", ten_gods: tenGods } };
}

export async function generateReading(input: Input): Promise<Reading> {
  const calculated = calculateReading(input);
  const calculatedChart = calculated.chart_data as { day_master?: string };
  const publicElement = calculatedChart.day_master?.split(" ").at(-1) ?? "element";
  calculated.element_profile = `${calculatedChart.day_master} Day Master — associated with ${elementStyle[publicElement] ?? "a distinctive way of responding to the world"}.`;
  const verified = withQc(calculated, deterministicQc(calculated));
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_SYNC_ENABLED !== "true") return verified;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(6000), headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.35, messages: [{ role: "system", content: "Return JSON containing only report_content. Ground the writing in the supplied verified Day Master, season, and strength. Strength means seasonal energy balance, not character weakness. Use warm, relatable, age-appropriate language and cautious phrases such as 'may' and 'you may notice'. Present Bazi as a traditional reflective framework, not science, religion, prediction, or fixed destiny. Briefly acknowledge that birth-time accuracy, age, environment, experiences, and choices affect fit. Never invent a structure or ranked profile stars. Never identify internal sources or tools. report_content must contain personality, exactly 3 strengths, 2-3 soft_spots, 2-3 parenting_tips, optional concern_response, and closing_encouragement; each list item has heading and body." }, { role: "user", content: JSON.stringify({ child: input, verified_chart: verified.chart_data, fixed_element_profile: verified.element_profile }) }] }) });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`); const json = await response.json(); const parsed = JSON.parse(json.choices[0].message.content);
    const candidate = { ...verified, report_content: parsed.report_content, insights_source: `calculation/validated-v3+openai/${json.model}` };
    const qc = deterministicQc(candidate);
    return qc.approved ? withQc(candidate, qc) : withQc(verified, { approved: true, issues: [`AI prose withheld: ${qc.issues.join("; ")}`], reviewer: "rules/expert-bazi-qc-v1-safe-fallback" });
  } catch (error) { console.error("AI generation fallback", error); return verified; }
}
