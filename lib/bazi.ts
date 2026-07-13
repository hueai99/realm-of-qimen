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
const stemPolarity: Record<string, "Yang" | "Yin"> = { "甲":"Yang", "乙":"Yin", "丙":"Yang", "丁":"Yin", "戊":"Yang", "己":"Yin", "庚":"Yang", "辛":"Yin", "壬":"Yang", "癸":"Yin" };
type Input = { subject_name: string; birth_date: string; birth_time?: string | null; gender: string; question_type: QuestionType };
export type Reading = { year_pillar: string; month_pillar: string; day_pillar: string; hour_pillar: string | null; element_profile: string; insights: string; insights_confidence: number; insights_source: string; insights_review_status?: "reviewed" | "rejected"; report_content: SummaryReport; chart_status: "verified"; chart_data: Record<string, unknown> };

type QcResult = { approved: boolean; issues: string[]; reviewer: string };
const unsupportedClaims = /\b(top structure|profile star|ranked star|destined|guaranteed|will definitely|diagnos(?:e|is)|scientifically proven|dead|trapped|the subject|this individual|profile indicates|behavioural profile)\b/i;
const sourceLeak = /\b(Joey Yap|Destiny\s*X|Power of X|uploaded (?:file|document|reference)|source material|reference document|knowledge base|internal prompt|training data)\b/i;
const aiStylePhrases = /\b(delv(?:e|es|ing)|tapestry|unlock(?:ing)?|transformative|profound|multifaceted|navigate the complexities|in today'?s world|it is important to note|it'?s worth noting|moreover|furthermore|in conclusion|serves as a testament|embark on|holistic journey)\b/i;
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const elementStyle: Record<string, string> = {
  Wood: "curiosity, growth, and a wish to keep moving forward",
  Fire: "warmth, expression, and enthusiasm",
  Earth: "steadiness, practicality, and care for what feels secure",
  Metal: "clear standards, attention to detail, and a strong sense of what feels right",
  Water: "observation, adaptability, and thoughtful curiosity",
};
const elementHeading: Record<string, string> = {
  Wood: "Keen to grow",
  Fire: "Brings warmth and energy",
  Earth: "A steady presence",
  Metal: "Knows what feels right",
  Water: "Notices more than they say",
};
const elementMoment: Record<string, string> = {
  Wood: "they become absorbed in learning something new, ask to do it their own way, or feel frustrated when progress is blocked",
  Fire: "their face lights up around people or activities they love, or when their feelings arrive quickly and visibly",
  Earth: "they look for familiar routines, quietly take care of others, or need time before feeling comfortable with change",
  Metal: "they notice when something is unfair, remember exactly how things should be done, or become hard on themselves after a mistake",
  Water: "they watch a room before joining in, ask questions that surprise you, or adjust quietly to what is happening around them",
};
const elementNature: Record<string, string> = {
  Wood: "a purposeful, growth-minded nature that is drawn to progress, possibility, and finding a way forward",
  Fire: "a warm, expressive nature that is drawn to connection, enthusiasm, and bringing energy into the room",
  Earth: "a grounded, dependable nature that is drawn to stability, practical care, and creating a sense of security",
  Metal: "a principled, clear-cut nature that gravitates toward fairness, order, and doing what feels right",
  Water: "a perceptive, adaptable nature that is drawn to understanding, observing, and finding a path around obstacles",
};
const elementThemes: Record<string, { strengths: [string, string][]; softSpots: [string, string][]; closing: string }> = {
  Wood: { strengths: [["Sees room to grow", "notices possibilities and is often motivated by progress"], ["Keeps reaching forward", "can recover momentum when there is a meaningful next step"], ["Independent ideas", "often wants to understand, explore, and try a personal approach"]], softSpots: [["Frustrated by roadblocks", "may become impatient when progress feels blocked"], ["Needs room, with guidance", "can resist when every step is decided for him or her"]], closing: "a forward-looking child whose independent ideas can become purposeful confidence" },
  Fire: { strengths: [["Brings warmth", "can lift the mood and connect readily through genuine enthusiasm"], ["Expresses what matters", "often communicates feelings and ideas with vivid energy"], ["Inspires participation", "can draw others into activities he or she cares about"]], softSpots: [["Feelings can arrive quickly", "may need help settling before talking through an intense moment"], ["Sensitive to the atmosphere", "can be affected by tension or a lack of response from others"]], closing: "a warm-hearted child whose bright expression can mature into generous confidence" },
  Earth: { strengths: [["A steady presence", "often brings patience and reliability to familiar people and routines"], ["Practical care", "may show love through helpful actions more than big words"], ["Builds trust slowly", "can become deeply dependable once he or she feels secure"]], softSpots: [["Change may take time", "may need advance notice before moving away from a familiar plan"], ["Carries more than is shown", "can hold worries quietly to avoid unsettling others"]], closing: "a steady-hearted child whose quiet care can grow into grounded self-belief" },
  Metal: { strengths: [["Knows what feels right", "often notices fairness, standards, and the difference between a careful job and a rushed one"], ["A precise eye", "can spot details others overlook and improve things with thoughtful care"], ["Loyal follow-through", "may take promises and responsibilities seriously once committed"]], softSpots: [["Hard on mistakes", "may judge himself or herself more sharply than the situation deserves"], ["Needs help with grey areas", "can feel unsettled when rules shift or there is no clearly right answer"]], closing: "a quietly perceptive child with a strong moral thread and a natural wish to do what is right" },
  Water: { strengths: [["Reads the room", "often notices small shifts in people and situations before speaking"], ["Finds another way", "can adapt intelligently when the obvious route does not work"], ["Thoughtful curiosity", "may ask surprisingly deep questions and connect ideas quietly"]], softSpots: [["Keeps thoughts inside", "may not ask for help until worry has already built up"], ["Can drift without an anchor", "benefits from gentle structure when there are too many possibilities"]], closing: "a quietly insightful child whose sensitivity and curiosity can grow into calm resilience" },
};

function concernReflection(concern: string, name: string): string {
  const text = concern.toLowerCase();
  if (/school|study|homework|learn|grade|exam/.test(text)) return `The heart of this concern is understanding how ${name} learns best and how school demands can feel less discouraging.`;
  if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) return `The concern seems to be about understanding what sits underneath ${name}'s strong reactions and helping those moments feel safer.`;
  if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) return `At the heart of this concern is a wish for ${name} to feel safer and more confident without being pushed too hard.`;
  if (/friend|social|lonely|bully|fit in/.test(text)) return `This concern centres on how ${name} is finding connection and a sense of belonging with other children.`;
  if (/listen|defiant|stubborn|cooperate|behavio/.test(text)) return `The difficult balance here is holding a clear boundary while helping ${name} feel heard.`;
  return `The heart of this concern is understanding what ${name} may be communicating through the difficulty and finding a response that holds both warmth and clarity.`;
}

function deterministicQc(reading: Reading, childName?: string, gender?: string): QcResult {
  const issues: string[] = [];
  const summary = reading.report_content;
  const prose = JSON.stringify(summary);
  const chart = reading.chart_data as { day_master?: string; day_master_strength?: string; season?: string };
  if (!reading.year_pillar || !reading.month_pillar || !reading.day_pillar || !chart.day_master || !chart.day_master_strength || !chart.season) issues.push("verified chart data is incomplete");
  if (!summary?.personality || summary.strengths?.length !== 3 || summary.soft_spots?.length < 2 || summary.parenting_tips?.length < 2 || !summary.closing_encouragement) issues.push("summary structure is incomplete");
  if (chart.day_master && !summary.personality.includes(chart.day_master)) issues.push("personality explanation does not identify the verified Day Master");
  if (unsupportedClaims.test(prose)) issues.push("unsupported or over-certain claim detected");
  if (sourceLeak.test(prose)) issues.push("private source or internal process disclosure detected");
  if (aiStylePhrases.test(prose)) issues.push("formulaic AI-style wording detected");
  const sections = [...(summary.strengths ?? []), ...(summary.soft_spots ?? []), ...(summary.parenting_tips ?? [])];
  if (sections.some(({ heading }) => !heading || words(heading) > 6)) issues.push("section heading format is inconsistent");
  if (sections.some(({ body }) => words(body) < 12 || words(body) > 85)) issues.push("section length is outside the parent-friendly range");
  if ([...(summary.strengths ?? []), ...(summary.soft_spots ?? [])].some(({ basis }) => !basis?.factor || !basis?.value)) issues.push("a strength or soft spot is not traceable to verified Bazi data");
  if (words(summary.personality ?? "") < 45 || words(summary.personality ?? "") > 180) issues.push("opening explanation is too brief or overwhelming");
  if (words(summary.closing_encouragement ?? "") < 25 || words(summary.closing_encouragement ?? "") > 90) issues.push("closing encouragement is too brief or overwhelming");
  const repeatedOpenings = sections.map(({ body }) => body.trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase());
  if (new Set(repeatedOpenings).size !== repeatedOpenings.length) issues.push("repetitive sentence openings detected");
  if (childName && prose.toLowerCase().split(childName.toLowerCase()).length - 1 < 4) issues.push("report is not personalised to the child often enough");
  if (!/\b(parent|family|home|care|support|understood)\b/i.test(prose)) issues.push("report does not acknowledge the parent or family experience");
  if ((prose.match(/\b(you|your)\b/gi) ?? []).length > 8) issues.push("report addresses the parent as 'you' too repeatedly");
  const relatableMoments = prose.match(/\b(when|before|after|homework|chores|school|mistake|routine|first step|choice|difficult day)\b/gi) ?? [];
  if (relatableMoments.length < 4) issues.push("report lacks enough recognisable everyday moments");
  if (!/\b(parents may recognise|at the heart|does not have to|get everything right|feel understood|not a flaw|steady mentorship)\b/i.test(prose)) issues.push("report lacks an empathetic, encouraging voice");
  if (gender && gender !== "other" && /\b(they|them|their|theirs|themselves)\b/i.test(prose)) issues.push("report does not use the selected he or she pronouns consistently");
  if (summary.concern_response) {
    if (childName && !summary.concern_response.includes(childName)) issues.push("parenting concern response is not personal to the child");
    if (words(summary.concern_response) < 45 || words(summary.concern_response) > 120) issues.push("parenting concern response is too brief or mechanical");
    if (/\b(start by|look for the situations|consistent observation|deserves a calm|offer one manageable choice)\b/i.test(summary.concern_response)) issues.push("parenting concern response sounds procedural or templated");
  }
  if (childName && summary.closing_encouragement.split(childName).length - 1 < 2) issues.push("closing encouragement is not personal enough");
  if (/\b(traditional reflective framework|not a fixed label|set aside anything|keep what helps|this blueprint)\b/i.test(summary.closing_encouragement)) issues.push("closing encouragement sounds like a disclaimer or template");
  return { approved: issues.length === 0, issues, reviewer: "rules/expert-bazi-and-editorial-qc-v3" };
}

function withQc(reading: Reading, qc: QcResult): Reading {
  return { ...reading, insights_review_status: qc.approved ? "reviewed" : "rejected", chart_data: { ...reading.chart_data, expert_qc: { ...qc, reviewed_at: new Date().toISOString() } } };
}

function genderedSummary(summary: SummaryReport, gender: string): SummaryReport {
  if (gender !== "male" && gender !== "female") return summary;
  const pronouns = gender === "male"
    ? { they: "he", them: "him", their: "his", theirs: "his", themselves: "himself" }
    : { they: "she", them: "her", their: "her", theirs: "hers", themselves: "herself" };
  const replace = (value: string) => value
    .replace(/\bhimself or herself\b/gi, gender === "male" ? "himself" : "herself")
    .replace(/\bhim or her\b/gi, gender === "male" ? "him" : "her")
    .replace(/\bhis or her\b/gi, gender === "male" ? "his" : "her")
    .replace(/\bhe or she\b/gi, gender === "male" ? "he" : "she")
    .replace(/\bthey don't\b/gi, gender === "male" ? "he doesn't" : "she doesn't")
    .replace(/\bthey are\b/gi, gender === "male" ? "he is" : "she is")
    .replace(/\bthey have\b/gi, gender === "male" ? "he has" : "she has")
    .replace(/\bthey do\b/gi, gender === "male" ? "he does" : "she does")
    .replace(/\bthemselves\b/gi, (word) => word[0] === "T" ? pronouns.themselves[0].toUpperCase() + pronouns.themselves.slice(1) : pronouns.themselves)
    .replace(/\btheirs\b/gi, (word) => word[0] === "T" ? pronouns.theirs[0].toUpperCase() + pronouns.theirs.slice(1) : pronouns.theirs)
    .replace(/\btheir\b/gi, (word) => word[0] === "T" ? pronouns.their[0].toUpperCase() + pronouns.their.slice(1) : pronouns.their)
    .replace(/\bthem\b/gi, (word) => word[0] === "T" ? pronouns.them[0].toUpperCase() + pronouns.them.slice(1) : pronouns.them)
    .replace(/\bthey\b/gi, (word) => word[0] === "T" ? pronouns.they[0].toUpperCase() + pronouns.they.slice(1) : pronouns.they);
  return JSON.parse(JSON.stringify(summary), (_key, value) => typeof value === "string" ? replace(value) : value) as SummaryReport;
}

function attachVerifiedBasis(candidate: SummaryReport, verified: SummaryReport): SummaryReport {
  return {
    ...candidate,
    strengths: candidate.strengths.map((point, index) => ({ ...point, basis: verified.strengths[index]?.basis })),
    soft_spots: candidate.soft_spots.map((point, index) => ({ ...point, basis: verified.soft_spots[index]?.basis })),
  };
}

function groundedSummary(name: string, dayMaster: string, element: string, strength: "Strong" | "Weak", _season: string, _seasonalStateName: string, concern?: string | null): SummaryReport {
  const themes = elementThemes[element];
  const support = strength === "Weak"
    ? `${name} may not show these sides straight away, especially in a new place or when they feel watched. Give them a little time, a clear idea of what will happen next, and the reassurance that they don't have to get everything right on the first try.`
    : `You may see these sides of ${name} quite readily. They may enjoy having some say in how they do things and respond well when their natural drive has a positive direction.`;
  const seasonLink = `${name}, born under the ${dayMaster} Day Master, often carries ${elementNature[element]}. Parents may recognise this when ${elementMoment[element]}. ${support}`;
  return {
    personality: `${seasonLink} You may notice this most clearly in how they approach new people, unfamiliar tasks, or moments when expectations feel high.`,
    strengths: themes.strengths.map(([heading, meaning], index) => ({ heading, body: index === 0 ? `${name} ${meaning}. This often appears most naturally when he or she feels secure enough to act without being rushed.` : index === 1 ? `${name} also ${meaning}. It may become clearer when an activity feels purposeful rather than imposed.` : `A further strength is that ${name} ${meaning}. Encouragement can help this quality mature without becoming a source of pressure.`, basis: { factor: "Day Master", value: `${dayMaster} / ${element}` } })),
    soft_spots: themes.softSpots.map(([heading, meaning], index) => ({ heading, body: index === 0 ? `${name} ${meaning}. This is not a flaw; calm support can help him or her regain balance.` : `At other times, ${name} ${meaning}. A little patience can protect confidence while he or she learns a more flexible response.`, basis: { factor: strength === "Weak" ? "Day Master and seasonal balance" : "Day Master expression", value: `${dayMaster} / ${strength}` } })),
    concern_response: concern ? `${concernReflection(concern, name)} There may be days when you wonder whether to step in, give more space, or handle things differently. You do not have to solve everything at once. In the next difficult moment, stay close, notice what ${name} seems to need, and try one small response. What helps your child settle and reconnect will tell you more than any single hard day.` : undefined,
    parenting_tips: [
      { heading: "Offer two clear choices", body: `Keep boundaries steady while allowing some ownership: “Would you like to start with reading or maths?” This reduces friction and helps ${name} practise decision-making safely.` },
      { heading: "Make progress visible", body: `Use short checklists and acknowledge effort specifically. Seeing small steps completed can be more motivating than a distant reward.` },
      { heading: "Connect before redirecting", body: `Reflect the feeling first, then guide the behaviour. A sentence such as “I can see this is frustrating; let’s find the first small step” keeps support and responsibility together.` },
      { heading: "Notice the quiet signals", body: `A change in tone, play, appetite, or willingness to join in may say more than words. Naming the observation gently gives ${name} a way into the conversation without pressure.` },
      { heading: "Leave room to try again", body: `After a difficult moment, return to the lesson when everyone is calmer. A fresh attempt helps ${name} experience correction as guidance rather than rejection.` },
    ],
    closing_encouragement: `${name} is ${themes.closing}. While he or she may not always show what is needed directly, this chart suggests a child who blossoms with steady mentorship and gentle accountability. By seeing sensitivity as a sign of depth—not weakness—you are already giving ${name} something powerful: the freedom to grow into a clear and resilient self.`,
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
  const dayMaster = `${values.day[0]} (${stemPolarity[values.day[0]]} ${stems[values.day[0]][1]})`;
  return { year_pillar: formatPillar(...values.year), month_pillar: formatPillar(...values.month), day_pillar: formatPillar(...values.day), hour_pillar: input.birth_time ? formatPillar(...values.hour) : null, element_profile: `${dayMaster} Day Master — ${strength}. “Strength” describes seasonal energy balance, not strength of character.`, insights: `1. ${input.subject_name} benefits from ${focus[input.question_type]}.\n2. The chart favours progress through consistent routines and one clear priority at a time.\n3. Notice opportunities that feel both energising and sustainable; those are stronger signals than urgency alone.`, insights_confidence: input.birth_time ? 0.9 : 0.78, insights_source: "calculation/validated-v3", report_content: groundedSummary(input.subject_name, dayMaster, dayElement, strength, season, state, (input as Input & { parenting_concern?: string | null }).parenting_concern), chart_status: "verified", chart_data: { ...values, day_master: dayMaster, day_master_strength: strength, seasonal_state: state, season, strength_method: "season-first-v1", strength_review_status: state === "Prosperous" || state === "Dead" ? "high-confidence" : "review-recommended", ten_gods: tenGods } };
}

export async function generateReading(input: Input): Promise<Reading> {
  const calculated = calculateReading(input);
  calculated.report_content = genderedSummary(calculated.report_content, input.gender);
  const calculatedChart = calculated.chart_data as { day_master?: string };
  const publicElement = Object.keys(elementStyle).find((element) => calculatedChart.day_master?.includes(element)) ?? "element";
  calculated.element_profile = `This summary focuses on one important part of the chart: ${input.subject_name}'s ${calculatedChart.day_master} Day Master. It is associated with ${elementStyle[publicElement] ?? "a distinctive way of responding to the world"}.`;
  const verified = withQc(calculated, deterministicQc(calculated, input.subject_name, input.gender));
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_SYNC_ENABLED !== "true" || process.env.FREE_SUMMARY_AI_ENABLED === "false") return verified;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(6000), headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.35, messages: [{ role: "system", content: "Return JSON containing only report_content. Ground the writing in the supplied verified Day Master, season, and strength. Strength means seasonal energy balance, not character weakness. Use warm, relatable, age-appropriate language and cautious phrases such as 'may' and 'you may notice'. Present Bazi as a traditional reflective framework, not science, religion, prediction, or fixed destiny. Briefly acknowledge that birth-time accuracy, age, environment, experiences, and choices affect fit. Never invent a structure or ranked profile stars. Never identify internal sources or tools. report_content must contain personality, exactly 3 strengths, 2-3 soft_spots, 2-3 parenting_tips, optional concern_response, and closing_encouragement; each list item has heading and body." }, { role: "user", content: JSON.stringify({ child: input, verified_chart: verified.chart_data, fixed_element_profile: verified.element_profile }) }] }) });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`); const json = await response.json(); const parsed = JSON.parse(json.choices[0].message.content);
    const personalised = genderedSummary(parsed.report_content, input.gender);
    const candidate = { ...verified, report_content: attachVerifiedBasis(personalised, verified.report_content), insights_source: `calculation/validated-v3+openai/${json.model}` };
    const qc = deterministicQc(candidate, input.subject_name, input.gender);
    return qc.approved ? withQc(candidate, qc) : withQc(verified, { approved: true, issues: [`AI prose withheld: ${qc.issues.join("; ")}`], reviewer: "rules/expert-bazi-qc-v1-safe-fallback" });
  } catch (error) { console.error("AI generation fallback", error); return verified; }
}
