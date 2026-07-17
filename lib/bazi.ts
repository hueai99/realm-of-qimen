import type { QuestionType, SummaryReport } from "@/lib/types";
import { Solar } from "lunar-javascript";
import { getDayMasterKnowledge } from "@/lib/day-master-knowledge";

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
const unsupportedClaims = /\b(top structure|profile star|ranked star|destined|guaranteed|will definitely|diagnos(?:e|is)|scientifically proven|dead|trapped|the subject|this individual|profile indicates|behavioural profile)\b/i;
const sourceLeak = /\b(Joey Yap|Destiny\s*X|Power of X|uploaded (?:file|document|reference)|source material|reference document|knowledge base|internal prompt|training data)\b/i;
const aiStylePhrases = /\b(delv(?:e|es|ing)|tapestry|unlock(?:ing)?|transformative|profound|multifaceted|navigate the complexities|in today'?s world|it is important to note|it'?s worth noting|moreover|furthermore|in conclusion|serves as a testament|embark on|holistic journey)\b/i;
const awkwardPhrases = /\b(needs doing|show he|show she|he often grow|she often grow|recognise courage while|praise the courage|practical effort and feedback|takes bonds|this image offers|born under the .+ day master day|loyalty does not mean carrying|quality may not appear in every setting|decisive energy|success feels personal|emotions spill over|normalise breaks|hard days|one small response|boundary stays clear|leave room for an answer|relationships can remain safe|try the conversation again|scatter attention|now, next, later|pause ritual|point for checking back)\b/i;
const words = (value: string) => value.trim().split(/\s+/).filter(Boolean).length;
const capitalise = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);
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
  if (/connect|reconnect|reach\b|talk to|open up|closer|bond|communicat|relationship/.test(text)) return `You would like to feel closer to ${name} and find an easier way to connect.`;
  if (/exam|test stress|revision stress/.test(text)) return `You would like to help ${name} manage the stress he or she feels around exams.`;
  if (/school|study|homework|learn|grade/.test(text)) return `You would like to understand how ${name} is coping with learning and schoolwork.`;
  if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) return `You have noticed that ${name} can become very upset, and you would like to understand these reactions better.`;
  if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) return `You have noticed that ${name} may worry or hold back in some situations.`;
  if (/friend|social|lonely|bully|fit in/.test(text)) return `You would like to understand how ${name} is getting along with other children.`;
  if (/listen|defiant|stubborn|cooperate|behavio/.test(text)) return `You have noticed that it can be difficult for ${name} to follow some everyday requests.`;
  return `You would like some guidance on something that currently matters for ${name}.`;
}

function concernGuidance(concern: string, name: string): string[] {
  const text = concern.toLowerCase();
  let tips: string[];
  if (/connect|reconnect|reach\b|talk to|open up|closer|bond|communicat|relationship/.test(text)) tips = [`Begin with something ${name} already enjoys. Genuine interest in his or her music, games, hobbies, or daily experiences can create an easier opening for conversation.`, `Choose a relaxed moment when neither of you is rushed. Spending time side by side may feel more natural than beginning with a serious face-to-face conversation.`, `When ${name} shares something, listen before offering advice. If he or she is not ready to talk, gently make it clear that the invitation remains open.`];
  else if (/exam|test stress|revision stress/.test(text)) tips = [`Ask ${name} which part of the exam feels most worrying. Naming one concern can make it easier to decide what would help.`, `Help ${name} divide revision into short, manageable sessions. A clear plan can make the work feel less overwhelming.`, `Before discussing results, acknowledge the effort already made. This reminds ${name} that one exam does not define his or her ability.`];
  else if (/school|study|homework|learn|grade/.test(text)) tips = [`Ask ${name} which part of the work feels hardest. Help him or her choose one small step so the task feels easier to approach.`, `If frustration builds, suggest a short break. Return to the same step afterwards so the break supports progress.`, `Notice whether a particular time, subject, or type of task feels easier. That pattern may reveal where a small change could help.`];
  else if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) tips = [`Give ${name} time to settle before discussing what happened. Listening is easier once the strongest feelings have passed.`, `When ${name} is ready, ask what felt most upsetting. Listen before explaining clearly what needs to happen next.`, `Afterwards, agree on one simple way to handle a similar moment. Keep the plan short enough for ${name} to remember.`];
  else if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) tips = [`Help ${name} choose one small step that feels possible. A manageable success can build confidence more naturally than immediate pressure.`, `Notice the effort even when the result is imperfect. A simple “You tried even though you felt worried” can mean a great deal.`, `Give ${name} time to become familiar with a new situation. Confidence may grow after watching first and joining when ready.`];
  else if (/friend|social|lonely|bully|fit in/.test(text)) tips = [`Ask about one specific part of the day, such as who ${name} spent time with. A smaller question may be easier than “How was school?”`, `Listen without rushing to solve the problem. Giving ${name} time to finish the story may reveal what support is actually wanted.`, `Check whether ${name} would prefer advice, practical help, or simply someone to listen. The answer may differ from one situation to another.`];
  else if (/listen|defiant|stubborn|cooperate|behavio/.test(text)) tips = [`Keep the request short and clear so ${name} knows exactly what is expected. Explain one step before adding another.`, `Where possible, offer two acceptable choices. This gives ${name} some say while keeping the responsibility clear.`, `After the task is complete, acknowledge the cooperation. Brief, specific appreciation is easier to understand than a general compliment.`];
  else tips = [`Choose a calm moment and ask ${name} what would feel most helpful. Keep the question simple and allow time for an answer.`, `Listen before offering a solution. The first need may be understanding rather than immediate advice.`, `Try one small change, then check in again later. This makes it easier to notice what genuinely helps ${name}.`];
  return tips;
}

function deterministicQc(reading: Reading, childName?: string, gender?: string, concern?: string | null): QcResult {
  const issues: string[] = [];
  const summary = reading.report_content;
  const prose = JSON.stringify(summary);
  const chart = reading.chart_data as { day_master?: string; day_master_name?: string; day_master_strength?: string; season?: string; knowledge_profile?: string };
  if (!reading.year_pillar || !reading.month_pillar || !reading.day_pillar || !chart.day_master || !chart.day_master_name || !chart.day_master_strength || !chart.season) issues.push("verified chart data is incomplete");
  if (!chart.knowledge_profile?.startsWith("day-master-v1/")) issues.push("the report is not attached to a reviewed Day Master profile");
  if (!summary?.personality || summary.strengths?.length !== 3 || summary.soft_spots?.length < 2 || summary.parenting_tips?.length !== 5 || !summary.closing_encouragement) issues.push("summary structure is incomplete");
  if (chart.day_master && !summary.personality.includes(chart.day_master)) issues.push("personality explanation does not identify the verified Day Master");
  if (unsupportedClaims.test(prose)) issues.push("unsupported or over-certain claim detected");
  if (sourceLeak.test(prose)) issues.push("private source or internal process disclosure detected");
  if (aiStylePhrases.test(prose)) issues.push("formulaic AI-style wording detected");
  if (awkwardPhrases.test(prose)) issues.push("awkward, ungrammatical, or unnatural wording detected");
  if (/rather than treating it as a flaw|this quality may not appear in every setting|that does not make it any less meaningful|it can help to help/i.test(prose)) issues.push("cold, defensive, or convoluted stock wording detected");
  const longSentences = prose.replace(/[{}\[\]"]/g, " ").split(/[.!?]+/).filter((sentence) => words(sentence) > 32);
  if (longSentences.length) issues.push("the report contains sentences that are too long or convoluted");
  const sections = [...(summary.strengths ?? []), ...(summary.soft_spots ?? []), ...(summary.parenting_tips ?? [])];
  if (sections.some(({ heading }) => !heading || words(heading) > 6)) issues.push("section heading format is inconsistent");
  if (sections.some(({ body }) => words(body) < 12 || words(body) > 85)) issues.push("section length is outside the parent-friendly range");
  if ((summary.parenting_tips ?? []).some(({ body }) => words(body) < 20)) issues.push("a parenting tip needs more warmth, context, and practical explanation");
  if ((summary.parenting_tips ?? []).some(({ heading }) => /^nurture\b/i.test(heading))) issues.push("a support heading repeats a trait instead of describing a recognisable situation");
  const childInsights = [...(summary.strengths ?? []), ...(summary.soft_spots ?? [])];
  if (childInsights.some(({ body }) => !/\b(when|homework|school|friend|play|task|plan|mistake|routine|change|try|notice|moment|start|finish|join|speak|help)\b/i.test(body))) issues.push("an insight lacks a recognisable moment from the child's daily life");
  if ([...(summary.strengths ?? []), ...(summary.soft_spots ?? [])].some(({ basis }) => !basis?.factor || !basis?.value)) issues.push("a strength or soft spot is not traceable to verified Bazi data");
  if (childInsights.some(({ guidance }) => !guidance)) issues.push("parent guidance is not separated from a child observation");
  if (words(summary.personality ?? "") < 45 || words(summary.personality ?? "") > 180) issues.push("opening explanation is too brief or overwhelming");
  if ((summary.personality ?? "").split(/\n\s*\n/).filter(Boolean).length < 3) issues.push("personality explanation does not separate the image, the child, and Day Master strength clearly");
  if (words(summary.closing_encouragement ?? "") < 75 || words(summary.closing_encouragement ?? "") > 220) issues.push("closing encouragement is too brief or overwhelming");
  if ((summary.closing_encouragement ?? "").split(/\n\s*\n/).filter(Boolean).length < 2) issues.push("closing encouragement does not separate encouragement from the wider Bazi invitation");
  const repeatedOpenings = sections.map(({ body }) => body.trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase());
  if (new Set(repeatedOpenings).size !== repeatedOpenings.length) issues.push("repetitive sentence openings detected");
  const sentences = prose.replace(/[{}\[\]"]/g, " ").split(/[.!?]+/).map((sentence) => sentence.trim().toLowerCase()).filter((sentence) => words(sentence) >= 7);
  const sentenceSignatures = sentences.map((sentence) => sentence.replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((word) => !/^(a|an|and|the|this|that|to|of|in|on|for|may|can|is|are|he|she|his|her)$/.test(word)).slice(0, 7).join(" "));
  if (new Set(sentenceSignatures).size !== sentenceSignatures.length) issues.push("the report repeats the same idea or sentence in more than one section");
  if ((prose.match(/one example is/gi) ?? []).length > 1) issues.push("the report overuses the same example sentence structure");
  if ((prose.match(/such as/gi) ?? []).length > 2) issues.push("the report overuses the same example sentence structure");
  if ((prose.match(/\byou can\b/gi) ?? []).length > 2) issues.push("parent guidance repeats the same sentence structure");
  if ((prose.match(/courage, loyalty, and determination/gi) ?? []).length > 1) issues.push("the same qualities are repeated across report sections");
  if (childName && prose.toLowerCase().split(childName.toLowerCase()).length - 1 < 4) issues.push("report is not personalised to the child often enough");
  if (!/\b(parent|family|home|care|support|understood)\b/i.test(prose)) issues.push("report does not acknowledge the parent or family experience");
  if ((prose.match(/\b(you|your)\b/gi) ?? []).length > 8) issues.push("report addresses the parent as 'you' too repeatedly");
  const relatableMoments = prose.match(/\b(when|before|after|homework|chores|school|mistake|routine|first step|choice|difficult day)\b/gi) ?? [];
  if (relatableMoments.length < 4) issues.push("report lacks enough recognisable everyday moments");
  if (!/\b(you may|you can|at the heart|feel understood|with calm guidance|ready to listen)\b/i.test(prose)) issues.push("report lacks an empathetic, encouraging voice");
  if (/\b(?:he|she) (?:are|were|have|do)\b|ideas so (?:he|she) is not forgotten/i.test(prose)) issues.push("a pronoun creates an ungrammatical or unintended meaning");
  if (gender && gender !== "other" && /\bthe child(?:['’]s)?\b/i.test(prose)) issues.push("report refers generically to 'the child' instead of using personal pronouns");
  if (summary.concern_response) {
    if (childName && !summary.concern_response.includes(childName)) issues.push("parenting concern response is not personal to the child");
    if (words(summary.concern_response) < 8 || words(summary.concern_response) > 45) issues.push("parenting concern reflection is unclear or too long");
    if (/\b(start by|look for the situations|consistent observation|deserves a calm|offer one manageable choice)\b/i.test(summary.concern_response)) issues.push("parenting concern response sounds procedural or templated");
    if (!summary.concern_tips?.length) issues.push("parenting concern guidance is not separated from the observation");
    if (concern && /connect|reconnect|reach\b|talk to|open up|closer|bond|communicat|relationship/i.test(concern) && !/connect|closer|talk|listen|time together/i.test(`${summary.concern_response} ${summary.concern_tips?.join(" ") ?? ""}`)) issues.push("connection concern was not answered with connection guidance");
  }
  if (childName && summary.closing_encouragement.split(childName).length - 1 < 2) issues.push("closing encouragement is not personal enough");
  if (!/\b(summary|day master|one part|fuller|more)\b/i.test(summary.closing_encouragement)) issues.push("closing encouragement does not gently place the summary in the wider Bazi picture");
  if (/\b(traditional reflective framework|not a fixed label|set aside anything|keep what helps|this blueprint)\b/i.test(summary.closing_encouragement)) issues.push("closing encouragement sounds like a disclaimer or template");
  return { approved: issues.length === 0, issues, reviewer: "rules/expert-bazi-and-editorial-qc-v4" };
}

function withQc(reading: Reading, qc: QcResult): Reading {
  return { ...reading, insights_review_status: qc.approved ? "reviewed" : "rejected", chart_data: { ...reading.chart_data, expert_qc: { ...qc, reviewed_at: new Date().toISOString() } } };
}

function genderedSummary(summary: SummaryReport, gender: string): SummaryReport {
  if (gender !== "male" && gender !== "female") return summary;
  const matchCase = (source: string, replacement: string) => source[0] === source[0].toUpperCase() ? capitalise(replacement) : replacement;
  const replace = (value: string) => value
    .replace(/\bhimself or herself\b/gi, (word) => matchCase(word, gender === "male" ? "himself" : "herself"))
    .replace(/\bhim or her\b/gi, (word) => matchCase(word, gender === "male" ? "him" : "her"))
    .replace(/\bhis or her\b/gi, (word) => matchCase(word, gender === "male" ? "his" : "her"))
    .replace(/\bhe or she\b/gi, (word) => matchCase(word, gender === "male" ? "he" : "she"));
  return JSON.parse(JSON.stringify(summary), (_key, value) => typeof value === "string" ? replace(value) : value) as SummaryReport;
}

function attachVerifiedBasis(candidate: SummaryReport, verified: SummaryReport): SummaryReport {
  return {
    ...candidate,
    strengths: candidate.strengths.map((point, index) => ({ ...point, guidance: point.guidance ?? verified.strengths[index]?.guidance, basis: verified.strengths[index]?.basis })),
    soft_spots: candidate.soft_spots.map((point, index) => ({ ...point, guidance: point.guidance ?? verified.soft_spots[index]?.guidance, basis: verified.soft_spots[index]?.basis })),
    concern_response: verified.concern_response ?? candidate.concern_response,
    concern_tips: verified.concern_tips ?? candidate.concern_tips,
  };
}

function groundedSummary(name: string, dayMasterName: string, dayMaster: string, strength: "Strong" | "Balanced" | "Weak", concern?: string | null): SummaryReport {
  const profile = getDayMasterKnowledge(dayMasterName);
  const variant = Math.floor(Math.random() * 3);
  const support = strength === "Weak"
    ? `In Bazi, ${name} has what is known as a Weak Day Master. This does not mean that he or she lacks strength or ability. Whether a Day Master is strong or weak depends on how it works with the other characters in the Bazi chart. For ${name}, having a Weak Day Master means that these qualities may emerge gradually as he or she feels secure and grows in confidence. ${profile.expressionExample}`
    : strength === "Balanced"
      ? `In Bazi, ${name} has what is known as a Balanced Day Master. This does not mean that every quality appears equally in every situation. The label describes how the Day Master works with the other characters in the chart. For ${name}, these qualities may appear more readily in some settings than others. ${profile.expressionExample}`
      : `In Bazi, ${name} has what is known as a Strong Day Master. This does not mean that he or she will feel strong or confident in every situation. The label describes how the Day Master works with the other characters in the chart. For ${name}, these qualities may be easier to notice, while still benefiting from guidance and balance. ${profile.expressionExample}`;
  const personalityOpenings = [
    `${name} was born under the ${dayMaster} Day Master. ${profile.name} is often compared to ${profile.image}.`,
    `${name}'s Day Master is ${dayMaster}. It is often compared to ${profile.image}.`,
    `The Day Master at the centre of ${name}'s summary is ${dayMaster}, often compared to ${profile.image}.`,
  ];
  const childConnections = [
    `Likewise, you may see this in ${name} through ${profile.warmIntroduction}.`,
    `Likewise, this may appear in ${name} as ${profile.warmIntroduction}.`,
    `Likewise, you may recognise in ${name} ${profile.warmIntroduction}.`,
  ];
  const personality = [
    personalityOpenings[variant],
    childConnections[variant],
    support,
  ].join("\n\n");
  const wordingVariant = (heading: string) => ([...`${name}-${heading}`].reduce((total, character) => total + character.charCodeAt(0), 0) + variant) % 3;
  const pointBody = (point: ReturnType<typeof getDayMasterKnowledge>["strengths"][number]) => {
    if (point.descriptions) return point.descriptions[wordingVariant(point.heading)].replaceAll("{name}", name);
    if (point.description) return point.description.replaceAll("{name}", name);
    if (point.examples) {
      const examples = wordingVariant(point.heading) === 1 ? [...point.examples].reverse() : point.examples;
      return `${name} ${point.meaning}. ${examples.join(" ")}`;
    }
    const versions = [
      `${name} ${point.meaning}. This may show up as ${point.everyday}.`,
      `${name} ${point.meaning}. In everyday life, this may look like ${point.everyday}.`,
      `${name} ${point.meaning}. Parents may recognise this through ${point.everyday}.`,
    ];
    return versions[wordingVariant(point.heading)];
  };
  const parentingTips = [...profile.strengths, ...profile.softSpots].map((point, index) => {
    const supportText = capitalise(point.support);
    const bodies = [
      `${supportText}. This may be especially helpful in situations such as ${point.everyday}. Keep the guidance simple, then give ${name} time to respond in his or her own way.`,
      `In situations such as ${point.everyday}, ${point.support}. A calm approach gives ${name} support without taking over the experience.`,
      `${supportText}. Use this when you notice moments such as ${point.everyday}. It can help ${name} understand what to try next.`,
      `If a situation involves ${point.everyday}, ${point.support}. Give ${name} time to take in the guidance before expecting an answer.`,
      `${supportText}. This can make situations such as ${point.everyday} feel more manageable for ${name}.`,
    ];
    return { heading: index < 3 ? ["When this quality appears", "Helping this strength grow", "Making learning feel natural"][index] : ["When things feel harder", "Finding a steadier response"][index - 3], body: bodies[index] };
  });
  if (dayMasterName === "Ren") parentingTips.splice(0, parentingTips.length,
    { heading: "When big ideas grow quickly", body: `A big idea may feel exciting but difficult to begin. Listen to ${name}'s idea first, then help him or her choose one small step to try.` },
    { heading: "When a plan needs changing", body: `A setback may lead ${name} to test several possibilities. Give him or her room to explore, then agree on a calm time to check in.` },
    { heading: "Learning through experience", body: `Instructions may make more sense after ${name} has tried the first step personally. Whenever possible, let him or her learn by building, testing, or taking part.` },
    { heading: "When ideas compete", body: `${name} may become excited by a new activity before finishing the current one. Keep a short list of the new ideas, then help him or her choose one thing to complete first.` },
    { heading: "Before making a decision", body: `Excitement may lead ${name} to answer before all the details are clear. Invite him or her to pause, then ask, “What might happen next?”` },
  );
  const closingStarts = dayMasterName === "Ren" ? [
    `${name} may not always share every idea or feeling straight away. As confidence grows, imagination may become easier to see in the questions he or she asks and the solutions he or she tries. When plans change, ${name} may gradually learn to adjust and try again instead of feeling stuck.`,
    `${name}'s ideas may first appear quietly. With growing confidence, he or she may begin asking more questions and testing possible solutions. The willingness to adjust after a setback can become a valuable source of self-belief.`,
    `${name} may take time to reveal what is happening inside. As he or she feels more secure, creative ideas and different ways of solving problems may become easier to share.`,
  ] : [
    `As ${name} grows in confidence, his or her natural qualities may become easier to recognise in everyday life. Each small step offers another chance for ${name} to trust his or her own judgement.`,
    `Some of ${name}'s strengths may emerge gradually. Notice the ideas he or she shares and the moments when he or she adjusts after a setback. These are meaningful signs of growing self-belief.`,
    `${name} may not show every strength in the same way each day. Patient encouragement can help him or her express these qualities with greater confidence over time.`,
  ];
  const futureByDayMaster: Record<string, string> = {
    Jia: `As ${name} grows older, a wish to improve may become a steady sense of purpose. Patient guidance can show him or her that progress also includes resting, changing course, and asking for help.`,
    Yi: `As ${name} grows older, quiet flexibility may help him or her work well with different people and changing situations. Clear boundaries can help this thoughtfulness grow without losing sight of personal needs.`,
    Bing: `As ${name} grows older, natural warmth may help him or her bring people together and speak with confidence. Learning to pause when feelings run high can make that warmth even more reassuring to others.`,
    Ding: `As ${name} grows older, careful observation may develop into thoughtful judgement and a calm way of supporting others. A safe place to share feelings can help those quiet insights find a voice.`,
    Wu: `As ${name} grows older, steadiness may become a dependable source of support for family and friends. Learning that change can be handled one step at a time will help that reliability remain flexible.`,
    Ji: `As ${name} grows older, practical care may become a quiet ability to help people and ideas flourish. Encouragement to name personal needs will help him or her care for others without disappearing into the background.`,
    Geng: `As ${name} grows older, determination may mature into clear judgement and the courage to stand up for what matters. Learning when to pause and listen will help that strength become measured as well as brave.`,
    Xin: `As ${name} grows older, a careful eye may develop into excellent judgement and thoughtful self-expression. Gentle reminders that work can be worthwhile without being perfect will protect the confidence behind that care.`,
    Ren: `As ${name} grows older, the ability to adapt may help him or her approach unfamiliar situations with greater confidence. Learning to pause, ask for support, and try a different approach can provide a steady foundation for the years ahead.`,
    Gui: `As ${name} grows older, quiet sensitivity may grow into a thoughtful understanding of people and situations. Reliable routines and room to reflect can help him or her share those observations with confidence.`,
  };
  const parentEncouragement = `By paying attention to these everyday moments, you help ${name} feel seen and understood. The care you are taking to understand him or her is already meaningful support. You do not need every answer immediately. Your patience and willingness to keep connecting can make a lasting difference.`;
  return {
    personality,
    strengths: profile.strengths.map((point) => ({ heading: point.heading, body: pointBody(point), guidance: `${capitalise(point.support)}.`, basis: { factor: "Day Master", value: `${dayMasterName} / ${strength}` } })),
    soft_spots: profile.softSpots.map((point) => ({ heading: point.heading, body: pointBody(point), guidance: `${capitalise(point.support)}.`, basis: { factor: "Day Master expression", value: `${dayMasterName} / ${strength}` } })),
    concern_response: concern ? concernReflection(concern, name) : undefined,
    concern_tips: concern ? concernGuidance(concern, name) : undefined,
    parenting_tips: parentingTips,
    closing_encouragement: `${closingStarts[variant]}\n\n${futureByDayMaster[dayMasterName]}\n\n${parentEncouragement}\n\nHopefully, this summary has given you better insight into how ${name} relates to the world. It is only a small part of what Bazi can offer because the focus here is the Day Master. A full Bazi reading can reveal more about how he or she learns, manages emotions, and connects with others. The Premium Report offers this fuller picture, with an optional 15-minute online consultation for questions about the completed report.`,
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
  const dayMaster = `${values.day[0]} · ${stems[values.day[0]][0]} ${stems[values.day[0]][1]}`;
  const dayMasterName = stems[values.day[0]][0];
  return { year_pillar: formatPillar(...values.year), month_pillar: formatPillar(...values.month), day_pillar: formatPillar(...values.day), hour_pillar: input.birth_time ? formatPillar(...values.hour) : null, element_profile: `${dayMaster} Day Master — ${strength}. “Strength” describes energetic expression, not strength of character.`, insights: `1. ${input.subject_name} benefits from ${focus[input.question_type]}.\n2. The chart favours progress through consistent routines and one clear priority at a time.\n3. Notice opportunities that feel both energising and sustainable; those are stronger signals than urgency alone.`, insights_confidence: input.birth_time ? 0.9 : 0.78, insights_source: "calculation/validated-v4", report_content: groundedSummary(input.subject_name, dayMasterName, dayMaster, strength, (input as Input & { parenting_concern?: string | null }).parenting_concern), chart_status: "verified", chart_data: { ...values, day_master: dayMaster, day_master_name: dayMasterName, day_master_strength: strength, seasonal_state: state, season, strength_method: "season-first-v1", strength_review_status: state === "Prosperous" || state === "Dead" ? "high-confidence" : "review-recommended", knowledge_profile: `day-master-v1/${dayMasterName}`, ten_gods: tenGods } };
}

export async function generateReading(input: Input): Promise<Reading> {
  const calculated = calculateReading(input);
  calculated.report_content = genderedSummary(calculated.report_content, input.gender);
  const calculatedChart = calculated.chart_data as { day_master?: string; day_master_name?: string };
  const publicElement = Object.keys(elementStyle).find((element) => calculatedChart.day_master?.includes(element)) ?? "element";
  calculated.element_profile = `This summary focuses on one important part of the chart: ${input.subject_name}'s ${calculatedChart.day_master} Day Master. It is associated with ${elementStyle[publicElement] ?? "a distinctive way of responding to the world"}.`;
  const concern = (input as Input & { parenting_concern?: string | null }).parenting_concern;
  const verified = withQc(calculated, deterministicQc(calculated, input.subject_name, input.gender, concern));
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_SYNC_ENABLED !== "true" || process.env.FREE_SUMMARY_AI_ENABLED === "false") return verified;
  try {
    const systemPrompt = [
      "Return JSON containing only report_content.",
      "Write like a warm, experienced Bazi consultant speaking to one parent.",
      "Use plain English and short sentences. Most sentences should stay below 22 words and sound natural when read aloud.",
      "Write so that a 12-year-old can understand every sentence. Replace abstract phrases with actions a parent can see.",
      "Use only the supplied reviewed Day Master guidance and verified strong/weak state. Do not add traits or calculation details.",
      "Introduce the child by name first. Then use the Day Master's natural image to help tell the story.",
      "After the Day Master image, explicitly connect it to the child with a sentence such as 'Likewise, you may see this in [name] when...'. The metaphor must explain a behaviour a parent can recognise.",
      "Write personality as three short paragraphs: the Day Master metaphor; how it may appear in this child; then a separate explanation of Strong, Balanced, or Weak.",
      "Every strength and soft spot must include a scene from homework, play, friendship, family routines, transitions, mistakes, or emotional moments.",
      "When a point has two examples, write them as two separate sentences. Never compress two examples into one list.",
      "Apply this test to every point: could a parent picture it and think, 'Yes, I have seen that in my child'? If not, rewrite it.",
      "Use the child's name and selected he or she pronouns. Never call the person 'the child' or 'the subject'.",
      "Use direct verbs and concrete examples. Avoid long clauses, abstract nouns, generic disclaimers, repeated conclusions, and stock phrases.",
      "Write so a 12-year-old can understand every sentence on the first reading. Prefer familiar words and short, natural sentences.",
      "Do not string several qualities or examples together as a comma-separated list. Explain one idea, then use a separate sentence for the example that supports it.",
      "Imagery is optional. Use no more than one short comparison, keep the child as the focus, and remove the image if it does not make the behaviour easier to understand.",
      "Address parenting guidance directly to the reader using 'you'. State exactly what the parent can say or do. Never use vague words such as response, boundary, hard day, or difficult moment without explaining the situation.",
      "Every parenting instruction must name who acts. Prefer 'you can' or 'you may' instead of relying on an implied subject.",
      "Vary guidance verbs naturally. Use words such as ask, praise, encourage, reassure, check in, remind, invite, acknowledge, and guide where they fit; do not repeatedly introduce advice with 'say'.",
      "Vary delivery through examples, sentence rhythm, and guidance while keeping every verified Bazi meaning unchanged. Reports with the same Day Master must not read like copied templates.",
      "After drafting each section, read it as spoken English. Rewrite any sentence that sounds translated, stiff, vague, or grammatically awkward.",
      "Then read the report from beginning to end. Remove repeated ideas, repeated examples, abrupt transitions, and advice that appears in more than one section.",
      "Vary complete sentence structures across cards. Do not repeatedly begin with 'One example is', 'You may notice', or 'You can'.",
      "Do not repeat the same list of qualities in the opening and closing. Express the verified meaning differently and naturally when summarising.",
      "Strengths should feel specific and affirming. Soft spots should explain what may sit beneath the behaviour without sounding negative.",
      "For concern_response, paraphrase only the concern the parent supplied. Do not invent a cause, setting, pattern, feeling, or behaviour that the parent did not mention.",
      "Identify the parent's intent before writing concern guidance. A request about connecting must receive connection guidance; exam stress must not be turned into a general schoolwork concern.",
      "Concern guidance must be simple, concrete, and easy to understand. Never ask a child to 'be brave all at once' or use similarly unnatural phrasing.",
      "For every strength and support area, put the child observation in body and the direct parent action in guidance. Never mix them in one paragraph.",
      "If there is a parenting concern, paraphrase only what the parent wrote in concern_response. Put two short, concrete actions in concern_tips. Do not infer fear, safety, or hidden motives.",
      "Write exactly five parenting tips of 35-60 words. Explain why each may help and include a realistic example or phrase.",
      "The closing must warmly summarise the child's main qualities, encourage the parent, and mention that the Day Master summary is only one part of what Bazi can reveal.",
      "Write the closing as two paragraphs. Keep the encouragement separate from the gentle invitation to explore the full chart.",
      "The invitation to explore more must feel natural and helpful, never salesy.",
      "Present Bazi as a reflective framework, not science, religion, prediction, diagnosis, or fixed destiny.",
      "Never invent structures, profile stars, Ten Gods, or other chart factors. Never identify internal sources or tools.",
      "report_content must contain personality, exactly 3 strengths, 2-3 soft_spots, exactly 5 parenting_tips, optional concern_response and concern_tips, and closing_encouragement.",
    ].join(" ");
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(25000), headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.65, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: JSON.stringify({ child: input, verified_chart: verified.chart_data, reviewed_day_master_guidance: getDayMasterKnowledge(calculatedChart.day_master_name ?? "Gui"), fixed_element_profile: verified.element_profile }) }] }) });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`); const json = await response.json(); const parsed = JSON.parse(json.choices[0].message.content);
    const personalised = genderedSummary(parsed.report_content, input.gender);
    const candidate = { ...verified, report_content: attachVerifiedBasis(personalised, verified.report_content), insights_source: `calculation/validated-v3+openai/${json.model}` };
    const qc = deterministicQc(candidate, input.subject_name, input.gender, concern);
    return qc.approved ? withQc(candidate, qc) : withQc(verified, { approved: true, issues: [`AI prose withheld: ${qc.issues.join("; ")}`], reviewer: "rules/expert-bazi-qc-v1-safe-fallback" });
  } catch (error) { console.error("AI generation fallback", error); return verified; }
}
