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
const stemPolarity: Record<string, "Yang" | "Yin"> = { "甲":"Yang", "乙":"Yin", "丙":"Yang", "丁":"Yin", "戊":"Yang", "己":"Yin", "庚":"Yang", "辛":"Yin", "壬":"Yang", "癸":"Yin" };
type Input = { subject_name: string; birth_date: string; birth_time?: string | null; gender: string; question_type: QuestionType };
export type Reading = { year_pillar: string; month_pillar: string; day_pillar: string; hour_pillar: string | null; element_profile: string; insights: string; insights_confidence: number; insights_source: string; insights_review_status?: "reviewed" | "rejected"; report_content: SummaryReport; chart_status: "verified"; chart_data: Record<string, unknown> };

type QcResult = { approved: boolean; issues: string[]; reviewer: string };
const unsupportedClaims = /\b(top structure|profile star|ranked star|destined|guaranteed|will definitely|diagnos(?:e|is)|scientifically proven|dead|trapped|the subject|this individual|profile indicates|behavioural profile)\b/i;
const sourceLeak = /\b(Joey Yap|Destiny\s*X|Power of X|uploaded (?:file|document|reference)|source material|reference document|knowledge base|internal prompt|training data)\b/i;
const aiStylePhrases = /\b(delv(?:e|es|ing)|tapestry|unlock(?:ing)?|transformative|profound|multifaceted|navigate the complexities|in today'?s world|it is important to note|it'?s worth noting|moreover|furthermore|in conclusion|serves as a testament|embark on|holistic journey)\b/i;
const awkwardPhrases = /\b(needs doing|show he|show she|he often grow|she often grow|recognise courage while|praise the courage|practical effort and feedback|takes bonds|this image offers|born under the .+ day master day|loyalty does not mean carrying|quality may not appear in every setting|decisive energy|success feels personal|emotions spill over|normalise breaks|hard days|one small response|boundary stays clear|leave room for an answer|relationships can remain safe|try the conversation again)\b/i;
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
  if (/school|study|homework|learn|grade|exam/.test(text)) return `You would like to understand how ${name} is coping with learning and schoolwork.`;
  if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) return `You have noticed that ${name} can become very upset, and you would like to understand these reactions better.`;
  if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) return `You have noticed that ${name} may worry or hold back in some situations.`;
  if (/friend|social|lonely|bully|fit in/.test(text)) return `You would like to understand how ${name} is getting along with other children.`;
  if (/listen|defiant|stubborn|cooperate|behavio/.test(text)) return `You have noticed that it can be difficult for ${name} to follow some everyday requests.`;
  return `You would like to understand the change you have noticed in ${name}.`;
}

function concernGuidance(concern: string, name: string): string[] {
  const text = concern.toLowerCase();
  if (/school|study|homework|learn|grade|exam/.test(text)) return [`Ask ${name} which part of the work feels hardest, then help him or her choose one small step.`, `If frustration builds, suggest a short break before returning to that same step.`];
  if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) return [`Give ${name} time to calm down before talking about what happened.`, `When he or she is ready, ask: “What upset you most?” Listen first, then explain clearly what needs to happen next.`];
  if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) return [`Encourage ${name} to take one small step at a time, rather than expecting him or her to face everything at once.`, `Praise the effort: “You tried even though you were worried.”`];
  if (/friend|social|lonely|bully|fit in/.test(text)) return [`Ask about one specific moment rather than the whole day. Try: “Who did you spend time with today?”`, `Listen without rushing to solve the problem so ${name} has time to explain what happened.`];
  if (/listen|defiant|stubborn|cooperate|behavio/.test(text)) return [`Keep the request short and clear.`, `If there is room for a choice, offer two options. For example: “Would you like to do your reading or maths first?”`];
  return [`Notice what happens just before the behaviour changes.`, `Wait until ${name} is calm, then ask one clear question and listen before deciding what to try next.`];
}

function deterministicQc(reading: Reading, childName?: string, gender?: string): QcResult {
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
  if ((summary.parenting_tips ?? []).some(({ body }) => words(body) < 32)) issues.push("a parenting tip needs more warmth, context, and practical explanation");
  const childInsights = [...(summary.strengths ?? []), ...(summary.soft_spots ?? [])];
  if (childInsights.some(({ body }) => !/\b(when|homework|school|friend|play|task|plan|mistake|routine|change|try|notice|moment|start|finish|join|speak|help)\b/i.test(body))) issues.push("an insight lacks a recognisable moment from the child's daily life");
  if ([...(summary.strengths ?? []), ...(summary.soft_spots ?? [])].some(({ basis }) => !basis?.factor || !basis?.value)) issues.push("a strength or soft spot is not traceable to verified Bazi data");
  if (childInsights.some(({ guidance }) => !guidance)) issues.push("parent guidance is not separated from a child observation");
  if (words(summary.personality ?? "") < 45 || words(summary.personality ?? "") > 180) issues.push("opening explanation is too brief or overwhelming");
  if ((summary.personality ?? "").split(/\n\s*\n/).filter(Boolean).length < 3) issues.push("personality explanation does not separate the image, the child, and Day Master strength clearly");
  if (words(summary.closing_encouragement ?? "") < 25 || words(summary.closing_encouragement ?? "") > 90) issues.push("closing encouragement is too brief or overwhelming");
  if ((summary.closing_encouragement ?? "").split(/\n\s*\n/).filter(Boolean).length < 2) issues.push("closing encouragement does not separate encouragement from the wider Bazi invitation");
  const repeatedOpenings = sections.map(({ body }) => body.trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase());
  if (new Set(repeatedOpenings).size !== repeatedOpenings.length) issues.push("repetitive sentence openings detected");
  const sentences = prose.replace(/[{}\[\]"]/g, " ").split(/[.!?]+/).map((sentence) => sentence.trim().toLowerCase()).filter((sentence) => words(sentence) >= 7);
  const sentenceSignatures = sentences.map((sentence) => sentence.replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((word) => !/^(a|an|and|the|this|that|to|of|in|on|for|may|can|is|are|he|she|his|her)$/.test(word)).slice(0, 7).join(" "));
  if (new Set(sentenceSignatures).size !== sentenceSignatures.length) issues.push("the report repeats the same idea or sentence in more than one section");
  if ((prose.match(/courage, loyalty, and determination/gi) ?? []).length > 1) issues.push("the same qualities are repeated across report sections");
  if (childName && prose.toLowerCase().split(childName.toLowerCase()).length - 1 < 4) issues.push("report is not personalised to the child often enough");
  if (!/\b(parent|family|home|care|support|understood)\b/i.test(prose)) issues.push("report does not acknowledge the parent or family experience");
  if ((prose.match(/\b(you|your)\b/gi) ?? []).length > 8) issues.push("report addresses the parent as 'you' too repeatedly");
  const relatableMoments = prose.match(/\b(when|before|after|homework|chores|school|mistake|routine|first step|choice|difficult day)\b/gi) ?? [];
  if (relatableMoments.length < 4) issues.push("report lacks enough recognisable everyday moments");
  if (!/\b(you may|you can|at the heart|feel understood|with calm guidance|ready to listen)\b/i.test(prose)) issues.push("report lacks an empathetic, encouraging voice");
  if (gender && gender !== "other" && /\b(they|them|their|theirs|themselves)\b/i.test(prose)) issues.push("report does not use the selected he or she pronouns consistently");
  if (gender && gender !== "other" && /\bthe child(?:['’]s)?\b/i.test(prose)) issues.push("report refers generically to 'the child' instead of using personal pronouns");
  if (summary.concern_response) {
    if (childName && !summary.concern_response.includes(childName)) issues.push("parenting concern response is not personal to the child");
    if (words(summary.concern_response) < 8 || words(summary.concern_response) > 45) issues.push("parenting concern reflection is unclear or too long");
    if (/\b(start by|look for the situations|consistent observation|deserves a calm|offer one manageable choice)\b/i.test(summary.concern_response)) issues.push("parenting concern response sounds procedural or templated");
    if (!summary.concern_tips?.length) issues.push("parenting concern guidance is not separated from the observation");
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
  const pronouns = gender === "male"
    ? { they: "he", them: "him", their: "his", theirs: "his", themselves: "himself" }
    : { they: "she", them: "her", their: "her", theirs: "hers", themselves: "herself" };
  const matchCase = (source: string, replacement: string) => source[0] === source[0].toUpperCase() ? capitalise(replacement) : replacement;
  const replace = (value: string) => value
    .replace(/\bhimself or herself\b/gi, (word) => matchCase(word, gender === "male" ? "himself" : "herself"))
    .replace(/\bhim or her\b/gi, (word) => matchCase(word, gender === "male" ? "him" : "her"))
    .replace(/\bhis or her\b/gi, (word) => matchCase(word, gender === "male" ? "his" : "her"))
    .replace(/\bhe or she\b/gi, (word) => matchCase(word, gender === "male" ? "he" : "she"))
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
    strengths: candidate.strengths.map((point, index) => ({ ...point, guidance: point.guidance ?? verified.strengths[index]?.guidance, basis: verified.strengths[index]?.basis })),
    soft_spots: candidate.soft_spots.map((point, index) => ({ ...point, guidance: point.guidance ?? verified.soft_spots[index]?.guidance, basis: verified.soft_spots[index]?.basis })),
    concern_response: verified.concern_response ?? candidate.concern_response,
    concern_tips: verified.concern_tips ?? candidate.concern_tips,
  };
}

function groundedSummary(name: string, dayMasterName: string, dayMaster: string, strength: "Strong" | "Weak", concern?: string | null): SummaryReport {
  const profile = getDayMasterKnowledge(dayMasterName);
  const variant = Math.floor(Math.random() * 3);
  const support = strength === "Weak"
    ? `The chart also describes his or her Day Master as Weak. In Bazi, this does not mean that he or she is weak. ${profile.weakExpression}`
    : `The chart also describes his or her Day Master as Strong. This means the qualities linked to the Day Master may be easier to see. It does not mean that he or she will feel strong or confident in every situation.`;
  const personalityOpenings = [
    `${name}'s Day Master is ${dayMaster}, which Bazi compares to ${profile.image}. ${profile.story}`,
    `At the centre of this summary is ${name}'s ${dayMaster} Day Master. Its Bazi image is ${profile.image}. ${profile.story}`,
    `In ${name}'s chart, the Day Master is ${dayMaster}. Bazi represents it through ${profile.image}. ${profile.story}`,
  ];
  const personality = [
    personalityOpenings[variant],
    `${name} may have ${profile.warmIntroduction}.`,
    support,
  ].join("\n\n");
  const wordingVariant = (heading: string) => ([...`${name}-${heading}`].reduce((total, character) => total + character.charCodeAt(0), 0) + variant) % 3;
  const pointBody = (point: ReturnType<typeof getDayMasterKnowledge>["strengths"][number]) => {
    if (point.examples) {
      const examples = wordingVariant(point.heading) === 1 ? [...point.examples].reverse() : point.examples;
      if (wordingVariant(point.heading) === 2) return `${name} ${point.meaning}. One example is easy to spot: ${examples[0].replace(/^You may see him or her /, "he or she may ").replace(/^He or she /, "he or she ")} ${examples[1]}`;
      return `${name} ${point.meaning}. ${examples.join(" ")}`;
    }
    if (wordingVariant(point.heading) === 1) return `${name} ${point.meaning}. A familiar example may be ${point.everyday}.`;
    if (wordingVariant(point.heading) === 2) return `You may recognise this quality when ${name} is ${point.everyday}. It reflects how ${name} ${point.meaning}.`;
    return `${name} ${point.meaning}. In everyday life, this may look like ${point.everyday}.`;
  };
  const parentingVersions = [
    [
      { heading: "Offer him or her a choice", body: `You can offer ${name} a choice between two acceptable options. For example: “Would you like to do your reading or maths first?” Both tasks still need to be completed, but the choice gives him or her some say in how to begin.` },
      { heading: "Break long tasks into steps", body: `When a task feels too big for ${name}, break it into two or three smaller steps. Show him or her only the first step so it feels easier to manage.\n\nAfterwards, acknowledge the effort: “You stayed with that even when it was difficult.”` },
      { heading: "Talk when things are calmer", body: `If ${name} is upset, avoid explaining too much straight away. Give him or her time to settle.\n\nWhen he or she is ready, check in with a short sentence: “I can see that you were frustrated.”` },
      { heading: "Notice changes in behaviour", body: `${name} may not always tell you when something is wrong. You may first notice that he or she is quieter, eats less, or no longer wants to join an activity. Check in gently: “You seem quieter than usual today.” Reassure him or her that you are ready to listen later.` },
      { heading: "Help him or her reflect", body: `If a situation has gone badly, wait until everyone is calm. Briefly explain what happened. Then guide ${name} to think of a better way to approach the situation next time.` },
    ],
    [
      { heading: "Give him or her two options", body: `Two clear options can help ${name} feel involved without changing what needs to be done. Ask whether he or she would prefer to begin with reading or maths. Keep both choices simple and acceptable.` },
      { heading: "Make the first step smaller", body: `A long task may feel easier once ${name} can see where to start. Divide it into a few short steps and focus only on the first one. When it is done, praise him or her for staying with it.` },
      { heading: "Wait for a calmer moment", body: `${name} may find it hard to listen while emotions are high. Allow a little time for him or her to settle before discussing what happened. A calm check-in will usually be easier to hear than a long explanation.` },
      { heading: "Look beyond the words", body: `Changes in appetite, energy, or interest may tell you that something is bothering ${name} before he or she is ready to explain it. Mention what you have noticed without pressing for an immediate answer. Remind him or her that the conversation can happen later.` },
      { heading: "Try a different approach", body: `Once everyone feels calmer, help ${name} look back at what happened. Encourage him or her to think of one different choice for next time. The aim is reflection, not blame.` },
    ],
    [
      { heading: "Let him or her choose the order", body: `${name} may cooperate more readily when he or she has a little choice. Offer two suitable tasks and let him or her decide which comes first. The expectation stays clear while the starting point feels less imposed.` },
      { heading: "Keep the next step clear", body: `Instead of presenting the whole task at once, show ${name} one manageable step. Add the next step only after the first is complete. Encourage the effort he or she is making, especially when the work feels demanding.` },
      { heading: "Pause before discussing it", body: `When ${name} is overwhelmed, fewer words may help. Give him or her space to settle before returning to the conversation. Later, ask one clear question and listen before offering guidance.` },
      { heading: "Check in gently", body: `${name}'s behaviour may change before he or she can explain what is wrong. If he or she seems unusually quiet or withdrawn, mention the change with care. Leave the door open by reassuring ${name} that you are available when he or she is ready.` },
      { heading: "Turn mistakes into learning", body: `A difficult interaction can be revisited after everyone has calmed down. Ask ${name} what he or she might do differently next time. Guide the conversation towards a clearer choice rather than dwelling on the mistake.` },
    ],
  ];
  const closingStarts = [
    `${name} has ${profile.closing}. These qualities may not appear in the same way every day. With patient guidance, they can become a steady part of how ${name} meets the world.`,
    `${name}'s ${profile.closing} may unfold gradually. Notice the small moments when these qualities appear, because they often show how he or she is learning to trust his or her own abilities.`,
    `There is much to appreciate in ${name}'s ${profile.closing}. As he or she grows, calm encouragement can help these natural qualities become more balanced and confident.`,
  ];
  return {
    personality,
    strengths: profile.strengths.map((point) => ({ heading: point.heading, body: pointBody(point), guidance: `${capitalise(point.support)}.`, basis: { factor: "Day Master", value: `${dayMasterName} / ${strength}` } })),
    soft_spots: profile.softSpots.map((point) => ({ heading: point.heading, body: pointBody(point), guidance: `${capitalise(point.support)}.`, basis: { factor: "Day Master expression", value: `${dayMasterName} / ${strength}` } })),
    concern_response: concern ? concernReflection(concern, name) : undefined,
    concern_tips: concern ? concernGuidance(concern, name) : undefined,
    parenting_tips: parentingVersions[variant],
    closing_encouragement: `${closingStarts[variant]}\n\nThis summary focuses only on the Day Master in ${name}'s Bazi chart. A full Bazi reading can reveal more about how he or she learns, manages emotions, and connects with others. The Premium Report offers this fuller picture, with an optional 15-minute online consultation for questions about the completed report.`,
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
  const dayMasterName = stems[values.day[0]][0];
  return { year_pillar: formatPillar(...values.year), month_pillar: formatPillar(...values.month), day_pillar: formatPillar(...values.day), hour_pillar: input.birth_time ? formatPillar(...values.hour) : null, element_profile: `${dayMaster} Day Master — ${strength}. “Strength” describes energetic expression, not strength of character.`, insights: `1. ${input.subject_name} benefits from ${focus[input.question_type]}.\n2. The chart favours progress through consistent routines and one clear priority at a time.\n3. Notice opportunities that feel both energising and sustainable; those are stronger signals than urgency alone.`, insights_confidence: input.birth_time ? 0.9 : 0.78, insights_source: "calculation/validated-v4", report_content: groundedSummary(input.subject_name, dayMasterName, dayMaster, strength, (input as Input & { parenting_concern?: string | null }).parenting_concern), chart_status: "verified", chart_data: { ...values, day_master: dayMaster, day_master_name: dayMasterName, day_master_strength: strength, seasonal_state: state, season, strength_method: "season-first-v1", strength_review_status: state === "Prosperous" || state === "Dead" ? "high-confidence" : "review-recommended", knowledge_profile: `day-master-v1/${dayMasterName}`, ten_gods: tenGods } };
}

export async function generateReading(input: Input): Promise<Reading> {
  const calculated = calculateReading(input);
  calculated.report_content = genderedSummary(calculated.report_content, input.gender);
  const calculatedChart = calculated.chart_data as { day_master?: string; day_master_name?: string };
  const publicElement = Object.keys(elementStyle).find((element) => calculatedChart.day_master?.includes(element)) ?? "element";
  calculated.element_profile = `This summary focuses on one important part of the chart: ${input.subject_name}'s ${calculatedChart.day_master} Day Master. It is associated with ${elementStyle[publicElement] ?? "a distinctive way of responding to the world"}.`;
  const verified = withQc(calculated, deterministicQc(calculated, input.subject_name, input.gender));
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_SYNC_ENABLED !== "true" || process.env.FREE_SUMMARY_AI_ENABLED === "false") return verified;
  try {
    const systemPrompt = [
      "Return JSON containing only report_content.",
      "Write like a warm, experienced Bazi consultant speaking to one parent.",
      "Use plain English and short sentences. Most sentences should stay below 22 words and sound natural when read aloud.",
      "Write so that a 12-year-old can understand every sentence. Replace abstract phrases with actions a parent can see.",
      "Use only the supplied reviewed Day Master guidance and verified strong/weak state. Do not add traits or calculation details.",
      "Introduce the child by name first. Then use the Day Master's natural image to help tell the story.",
      "Write personality as three short paragraphs: the Day Master image; how it may appear in this child; then a separate explanation of Strong or Weak.",
      "Every strength and soft spot must include a scene from homework, play, friendship, family routines, transitions, mistakes, or emotional moments.",
      "When a point has two examples, write them as two separate sentences. Never compress two examples into one list.",
      "Apply this test to every point: could a parent picture it and think, 'Yes, I have seen that in my child'? If not, rewrite it.",
      "Use the child's name and selected he or she pronouns. Never call the person 'the child' or 'the subject'.",
      "Use direct verbs and concrete examples. Avoid long clauses, abstract nouns, generic disclaimers, repeated conclusions, and stock phrases.",
      "Address parenting guidance directly to the reader using 'you'. State exactly what the parent can say or do. Never use vague words such as response, boundary, hard day, or difficult moment without explaining the situation.",
      "Every parenting instruction must name who acts. Prefer 'you can' or 'you may' instead of relying on an implied subject.",
      "Vary guidance verbs naturally. Use words such as ask, praise, encourage, reassure, check in, remind, invite, acknowledge, and guide where they fit; do not repeatedly introduce advice with 'say'.",
      "Vary delivery through examples, sentence rhythm, and guidance while keeping every verified Bazi meaning unchanged. Reports with the same Day Master must not read like copied templates.",
      "After drafting each section, read it as spoken English. Rewrite any sentence that sounds translated, stiff, vague, or grammatically awkward.",
      "Then read the report from beginning to end. Remove repeated ideas, repeated examples, abrupt transitions, and advice that appears in more than one section.",
      "Do not repeat the same list of qualities in the opening and closing. Express the verified meaning differently and naturally when summarising.",
      "Strengths should feel specific and affirming. Soft spots should explain what may sit beneath the behaviour without sounding negative.",
      "For concern_response, paraphrase only the concern the parent supplied. Do not invent a cause, setting, pattern, feeling, or behaviour that the parent did not mention.",
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
    const qc = deterministicQc(candidate, input.subject_name, input.gender);
    return qc.approved ? withQc(candidate, qc) : withQc(verified, { approved: true, issues: [`AI prose withheld: ${qc.issues.join("; ")}`], reviewer: "rules/expert-bazi-qc-v1-safe-fallback" });
  } catch (error) { console.error("AI generation fallback", error); return verified; }
}
