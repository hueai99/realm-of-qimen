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
type Input = { subject_name: string; birth_date: string; birth_time?: string | null; gender: string; question_type: QuestionType; variation_seed?: number };
export type Reading = { year_pillar: string; month_pillar: string; day_pillar: string; hour_pillar: string | null; element_profile: string; insights: string; insights_confidence: number; insights_source: string; insights_review_status?: "reviewed" | "rejected"; report_content: SummaryReport; chart_status: "verified"; chart_data: Record<string, unknown> };

type QcResult = { approved: boolean; issues: string[]; warnings?: string[]; reviewer: string };
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
const pointHeadingVariants: Record<string, [string, string]> = {
  "A dependable presence": ["Someone others can rely on", "Brings steadiness to others"],
  "A discerning eye": ["Notices the finer details", "A careful eye for quality"],
  "Benefits from a pause": ["A pause brings clarity", "Taking time before deciding"],
  "Big-picture thinking": ["Sees possibilities beyond the task", "Ideas that grow and expand"],
  "Choosing where to begin": ["Finding the first step", "Deciding what comes first"],
  "Confidence may change": ["Confidence needs steady support", "When confidence feels uncertain"],
  "Consistent spirit": ["Stays loyal to a direction", "Keeps faith with the plan"],
  "Courage to act": ["Steps forward when it matters", "Brave when things feel difficult"],
  "Criticism may linger": ["Takes feedback to heart", "When comments stay on the mind"],
  "Curious mind": ["Wants to understand more", "Questions that deepen understanding"],
  "Drawn to many interests": ["Many ideas compete for attention", "Excited by different possibilities"],
  "Feelings stay private": ["Needs time to share feelings", "Keeps feelings close at first"],
  "Finding a steadier pace": ["Knowing when to pause", "Balancing effort with rest"],
  "Finds another way": ["Tries a different approach", "Adapts when plans do not work"],
  "Flexible problem-solving": ["Adjusts when plans change", "Finds a way around obstacles"],
  "Flow of ideas": ["Connects ideas in fresh ways", "Ideas arrive in surprising ways"],
  "Remembers useful details": ["Brings useful knowledge to mind", "Uses what was learned before"],
  "Gentle consideration": ["Thinks about how others feel", "A thoughtful way with people"],
  "Gentle versatility": ["Adapts quietly to different settings", "Fits into changing situations"],
  "Growing through experience": ["Learns by trying again", "Confidence grows through practice"],
  "Hard to feel finished": ["Knowing when work is complete", "When details feel unfinished"],
  "Hopeful energy": ["Sees what could be possible", "Brings hope after disappointment"],
  "Interest affects concentration": ["Focus follows what feels meaningful", "When interest guides attention"],
  "Learning to pause and listen": ["Hearing the full story first", "Pausing before stepping in"],
  "Learns by taking part": ["Learns best through experience", "Understanding grows through doing"],
  "Loyal follow-through": ["Takes promises seriously", "Stays committed to what matters"],
  "Loyal soft heart": ["Quietly loyal to trusted people", "Shows care without much display"],
  "Quick to notice tension": ["Sensitive to unspoken tension", "Notices when something feels unsettled"],
  "May dwell on mistakes": ["Mistakes stay on the mind", "Finding it hard to let go"],
  "May follow other people's choices": ["Personal choices need room", "Finding a voice among others"],
  "Own needs may come second": ["Needs care and rest too", "Remembering personal needs"],
  "May take on adult worries": ["Carries worries that are not theirs", "Needs freedom from adult concerns"],
  "Natural warmth": ["Makes others feel welcome", "Warmth that draws people in"],
  "Needs room to recharge": ["Quiet time restores energy", "When rest is quietly needed"],
  "Needs time with change": ["Adjusting to a new plan", "Change may take time"],
  "Nurtures growth": ["Helps others grow", "Patient care for people and projects"],
  "Patient preparation": ["Likes to feel prepared", "Builds confidence through preparation"],
  "Perceptive awareness": ["Notices unspoken changes", "Sensitive to what is happening"],
  "Protective loyalty": ["Stands beside people who matter", "Loyal when support is needed"],
  "Quiet influence": ["Guides without taking over", "Leads through ideas and example"],
  "Adjusts quietly to change": ["Settles into change gradually", "Finds a rhythm after change"],
  "Resourceful care": ["Finds practical ways to help", "Care expressed through useful action"],
  "Notices how others feel": ["Pays attention to others", "Sensitive to other people's reactions"],
  "Speaking with more care": ["Shaping honesty with kindness", "When honest words feel too sharp"],
  "Steady determination": ["Keeps going when progress is slow", "Committed to meaningful goals"],
  "Straightforward heart": ["Values honesty and clear expectations", "Says plainly what feels unfair"],
  "Strong principles": ["Takes promises and rules seriously", "A clear sense of responsibility"],
  "Thoughtful insight": ["Notices more before speaking", "Careful thoughts worth waiting for"],
  "When plans change": ["Adjusting after plans shift", "When letting go feels difficult"],
};
const elementThemes: Record<string, { strengths: [string, string][]; softSpots: [string, string][]; closing: string }> = {
  Wood: { strengths: [["Sees room to grow", "notices possibilities and is often motivated by progress"], ["Keeps reaching forward", "can recover momentum when there is a meaningful next step"], ["Independent ideas", "often wants to understand, explore, and try a personal approach"]], softSpots: [["Frustrated by roadblocks", "may become impatient when progress feels blocked"], ["Needs room, with guidance", "can resist when every step is decided for him or her"]], closing: "a forward-looking child whose independent ideas can become purposeful confidence" },
  Fire: { strengths: [["Brings warmth", "can lift the mood and connect readily through genuine enthusiasm"], ["Expresses what matters", "often communicates feelings and ideas with vivid energy"], ["Inspires participation", "can draw others into activities he or she cares about"]], softSpots: [["Feelings can arrive quickly", "may need help settling before talking through an intense moment"], ["Sensitive to the atmosphere", "can be affected by tension or a lack of response from others"]], closing: "a warm-hearted child whose bright expression can mature into generous confidence" },
  Earth: { strengths: [["A steady presence", "often brings patience and reliability to familiar people and routines"], ["Practical care", "may show love through helpful actions more than big words"], ["Builds trust slowly", "can become deeply dependable once he or she feels secure"]], softSpots: [["Change may take time", "may need advance notice before moving away from a familiar plan"], ["Carries more than is shown", "can hold worries quietly to avoid unsettling others"]], closing: "a steady-hearted child whose quiet care can grow into grounded self-belief" },
  Metal: { strengths: [["Knows what feels right", "often notices fairness, standards, and the difference between a careful job and a rushed one"], ["A precise eye", "can spot details others overlook and improve things with thoughtful care"], ["Loyal follow-through", "may take promises and responsibilities seriously once committed"]], softSpots: [["Hard on mistakes", "may judge himself or herself more sharply than the situation deserves"], ["Needs help with grey areas", "can feel unsettled when rules shift or there is no clearly right answer"]], closing: "a quietly perceptive child with a strong moral thread and a natural wish to do what is right" },
  Water: { strengths: [["Reads the room", "often notices small shifts in people and situations before speaking"], ["Finds another way", "can adapt intelligently when the obvious route does not work"], ["Thoughtful curiosity", "may ask surprisingly deep questions and connect ideas quietly"]], softSpots: [["Keeps thoughts inside", "may not ask for help until worry has already built up"], ["Can drift without an anchor", "benefits from gentle structure when there are too many possibilities"]], closing: "a quietly insightful child whose sensitivity and curiosity can grow into calm resilience" },
};

const dayMasterSupportPortraits: Record<string, { introduction: string; secure: string; pressure: string; support: string; weekly_action: { situation: string; action: string; phrase: string; sign: string } }> = {
  Jia: { introduction: "Jia Wood is associated with a steady, goal-focused nature.", secure: "When he or she feels secure, {name} may choose a meaningful goal and keep working towards it, even when progress is slow.", pressure: "When a plan changes after {name} has committed to it, he or she may need time to let go of the original direction.", support: "Explain what has changed, then involve {name} in choosing one part of the new plan.", weekly_action: { situation: "When a plan has to change", action: "Explain what is changing, then let {name} choose one part of the new plan.", phrase: "This part has changed. Which step would you like to do first?", sign: "A useful sign is that {name} begins the new plan with less hesitation." } },
  Yi: { introduction: "Yi Wood may adjust thoughtfully when the first approach does not work.", secure: "When secure, {name} may notice what is happening and adjust the approach without giving up on the goal.", pressure: "In an unfamiliar group, {name} may look to other people before stating a personal preference.", support: "Ask what {name} thinks before inviting the rest of the group to answer.", weekly_action: { situation: "When {name} is unsure whether to follow someone else's choice", action: "Ask for {name}'s own view before discussing what everyone else wants.", phrase: "I have heard what they think. What feels right to you?", sign: "You may notice {name} stating a preference more clearly, even if it differs from someone else's." } },
  Bing: { introduction: "Bing Fire is warm and expressive, with a natural pull towards connection.", secure: "When secure, {name}'s warmth may be easier to see when {name} shares an idea enthusiastically or invites someone to join in.", pressure: "When a familiar plan changes unexpectedly, {name} may lose enthusiasm or need time to adjust.", support: "Acknowledge the disappointment before discussing what can happen next.", weekly_action: { situation: "When a plan changes unexpectedly", action: "Acknowledge the disappointment first, then explain the new plan in one or two clear steps.", phrase: "I know you were looking forward to that. Let us look at what we can do now.", sign: "You may notice {name} beginning to consider the new plan or explaining what felt disappointing." } },
  Ding: { introduction: "Ding Fire carries a quieter warmth and may notice details other people miss.", secure: "When he or she feels secure, {name} may share careful observations and show warmth through quiet, thoughtful attention.", pressure: "Under pressure, {name} may keep an idea or feeling private until he or she feels more certain about it.", support: "Mention gently what you have noticed, then allow time. A calm conversation later may help {name} explain what was difficult earlier.", weekly_action: { situation: "When {name} becomes unusually quiet", action: "Mention one change you noticed, then leave space instead of asking several questions.", phrase: "You seem quieter today. I am here if you want to talk later.", sign: "You may notice {name} returning to the conversation when he or she feels ready." } },
  Wu: { introduction: "Wu Earth values steadiness and often likes to know what to expect.", secure: "When he or she feels secure, {name} may become a steady presence who values familiar routines and follows through on responsibilities.", pressure: "When several responsibilities build up, {name} may try to carry them quietly instead of saying that the load feels heavy.", support: "Ask {name} to show you what is on the list, then decide together what can wait or be shared.", weekly_action: { situation: "When {name} has several responsibilities at once", action: "Ask {name} to show you what needs to be done. Decide together what must be handled now, what can wait, and what can be shared.", phrase: "Let us look at the list together. Which part needs attention first?", sign: "A useful sign is that {name} names what feels like too much or accepts help with one task." } },
  Ji: { introduction: "Ji Earth often expresses care through patient, practical help.", secure: "When he or she feels secure, {name} may patiently help with practical tasks and notice small things that make life easier for others.", pressure: "Because {name} may be willing to help, he or she may take on another person's need before finishing a personal task.", support: "Before {name} offers more help, ask what he or she needs to finish first.", weekly_action: { situation: "When someone asks {name} for help during a personal task", action: "Help {name} decide whether the request must be handled now or can wait until the personal task is finished.", phrase: "Finish what you need to do first. Then you can decide how to help.", sign: "You may notice {name} finishing a personal responsibility before taking on another request." } },
  Geng: { introduction: "Geng Metal is associated with a direct, determined approach to a clear challenge.", secure: "When he or she feels secure, {name} may meet a clear challenge directly and keep trying after a setback.", pressure: "When eager to resolve a problem, {name} may move quickly and miss part of the detail.", support: "Invite {name} to find out one more fact before deciding what to do.", weekly_action: { situation: "Before jumping in to solve a problem", action: "Invite {name} to find out one more fact before choosing what to do.", phrase: "You are ready to help. What else do we need to know first?", sign: "You may notice {name} pausing to listen or ask a question before acting." } },
  Xin: { introduction: "Xin Metal is careful and often pays close attention to quality and detail.", secure: "When he or she feels secure, {name} may use a careful eye to improve work, choose words thoughtfully, and notice details others miss.", pressure: "When several choices all have good points, {name} may hesitate because no option feels clearly best.", support: "Help {name} choose the two things that matter most, then compare the options using only those points.", weekly_action: { situation: "When several choices all seem possible", action: "Help {name} choose the two things that matter most. Compare each option using only those two points.", phrase: "Which two things matter most in this choice?", sign: "A useful sign is that {name} compares the options and chooses without checking every possible detail." } },
  Ren: { introduction: "Ren Water is adaptable and often looks for another route when the first one is blocked.", secure: "When secure, {name} may explore different possibilities and try another route when the first plan does not work.", pressure: "When asked to decide too quickly, {name} may resist settling on one answer before exploring other possibilities.", support: "Give {name} a little time to explore, then agree on when one choice needs to be made.", weekly_action: { situation: "When several ideas make it hard to begin", action: "Write the ideas down, then help {name} choose one small step to test first.", phrase: "Which idea would you like to try for ten minutes?", sign: "A useful sign is that {name} begins one idea while keeping the others written down for later." } },
  Gui: { introduction: "Gui Water is quietly observant and often thinks before speaking.", secure: "When secure, {name} may share a detail other people missed or connect two ideas in an unexpected way.", pressure: "Under stress, {name} may keep thoughts private or find it harder to explain what he or she is feeling.", support: "Ask one simple question, then give {name} time to find the words.", weekly_action: { situation: "When something is difficult to explain", action: "Ask one simple question, then give {name} time to think before asking another.", phrase: "You do not have to answer straight away. We can talk when you are ready.", sign: "You may notice {name} returning to the conversation or finding an easier way to share what is on his or her mind." } },
};

const dayMasterConcernLinks: Record<string, string> = {
  Jia: "This approach also suits {name}'s Jia Wood nature. A clear example and a constructive next step can make reflection feel more purposeful.",
  Yi: "This approach also suits {name}'s Yi Wood nature. Feeling heard first can make it easier to consider another point of view and adjust gently.",
  Bing: "This approach also suits {name}'s Bing Fire nature. Acknowledging what matters before offering advice can help strong feelings settle into a clearer conversation.",
  Ding: "This approach also suits {name}'s Ding Fire nature. A gentle opening and time to think can help private thoughts become easier to express.",
  Wu: "This approach also suits {name}'s Wu Earth nature. A calm and predictable conversation can provide enough steadiness to consider something difficult.",
  Ji: "This approach also suits {name}'s Ji Earth nature. A caring tone can help honest reflection feel supportive instead of critical.",
  Geng: "This approach also suits {name}'s Geng Metal nature. One clear example is easier to work with than a broad label or criticism.",
  Xin: "This approach also suits {name}'s Xin Metal nature. Specific and private feedback can encourage reflection without making one mistake feel larger than it is.",
  Ren: "This approach also suits {name}'s Ren Water nature. Space to explore another way can make change feel possible rather than imposed.",
  Gui: "This approach also suits {name}'s Gui Water nature. A quiet question and time to think can help {name} notice and share what is happening inside.",
};

function concernReflection(concern: string, name: string): string {
  const text = concern.toLowerCase();
  if (/connect|reconnect|reach\b|talk to|open up|closer|bond|communicat|relationship/.test(text)) return `You would like to feel closer to ${name} and find an easier way to connect.`;
  if (/perfect|perfection|mistake|fear of fail|afraid to fail|not good enough/.test(text)) return `You would like to support ${name} when the need to get things exactly right creates pressure or makes mistakes difficult to accept.`;
  if (/exam|test stress|revision stress/.test(text)) return `You would like to help ${name} manage the stress he or she feels around exams.`;
  if (/school|study|homework|learn|grade/.test(text)) return `You would like to understand how ${name} is coping with learning and schoolwork.`;
  if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) return `You have noticed that ${name} can become very upset, and you would like to understand these reactions better.`;
  if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) return `You have noticed that ${name} may worry or hold back in some situations.`;
  if (/friend|social|lonely|bully|fit in/.test(text)) return `You would like to understand how ${name} is getting along with other children.`;
  if (/weakness|weak point|area.*improv|see (?:his|her|their) (?:part|fault)/.test(text)) return `You would like to help ${name} recognise the areas he or she finds difficult and become more open to improving them.`;
  if (/obstacle|setback|challenge|difficulty|difficulties|overcome/.test(text)) return `You would like to help ${name} face obstacles without losing confidence or feeling that he or she has to solve everything at once.`;
  if (/listen|defiant|stubborn|cooperate|behavio/.test(text)) return `You have noticed that it can be difficult for ${name} to follow some everyday requests.`;
  return "";
}

function concernWeeklyAction(concern: string, name: string): { situation: string; action: string; phrase: string; sign: string } {
  const text = concern.toLowerCase();
  if (/weakness|weak point|area.*improv|see (?:his|her|their) (?:part|fault)/.test(text)) return { situation: "Have a strengths-and-growth conversation", action: `Take turns sharing one thing you handle well and one thing you are still learning. Begin with your own example so the conversation does not feel like a judgement of ${name}.`, phrase: "Here is something I am still working on. What would you like to become better at?", sign: `${name} can name one area to practise without becoming defensive or discouraged.` };
  if (/obstacle|setback|challenge|difficulty|difficulties|overcome/.test(text)) return { situation: "Choose one obstacle that matters this week", action: `Ask ${name} to describe what is getting in the way. Help him or her choose the smallest useful step, but leave the attempt in ${name}'s hands.`, phrase: "What is getting in the way, and which small part could you try first?", sign: `${name} can describe the obstacle more clearly or begins one step without expecting the whole problem to disappear.` };
  if (/stubborn|recognise|self.aware/.test(text)) return { situation: "Try a short two-sided reflection", action: `Choose one small disagreement after it has passed. Take turns naming one thing each person may have seen differently, without deciding who was right.`, phrase: "I will share what I missed first. What might you have missed?", sign: `${name} can name another point of view or rethink one part of the situation.` };
  if (/connect|reconnect|reach\b|talk to|open up|closer|bond|communicat|relationship/.test(text)) return { situation: `Spend ten minutes following ${name}'s lead`, action: `Let ${name} choose a simple activity to share with you. Join in without giving advice unless he or she asks for it.`, phrase: "You choose what we do for the next ten minutes.", sign: `${name} invites you into the activity, shares a detail, or seems more relaxed beside you.` };
  if (/perfect|perfection|mistake|fear of fail|afraid to fail|not good enough/.test(text)) return { situation: "Make one harmless mistake visible", action: `Let ${name} see you make a small everyday mistake, correct what matters, and move on without criticising yourself.`, phrase: "That did not go as planned, but I can fix this part and continue.", sign: `${name} becomes a little less upset by a small error or is more willing to try again.` };
  if (/exam|test stress|revision stress/.test(text)) return { situation: "End one revision session with a quick check-in", action: `Ask ${name} to rate the stress from one to five. Then let him or her choose one small priority for the next session.`, phrase: "What number is the stress now, and what should we tackle next?", sign: `${name} can name a worry or begins the next session with a clearer focus.` };
  if (/school|study|homework|learn|grade/.test(text)) return { situation: "Let the learner become the teacher", action: `Choose one small piece of schoolwork and ask ${name} to explain it to you in his or her own words.`, phrase: "Can you teach me how you understand this part?", sign: `${name} explains the idea more clearly or shows exactly where help is needed.` };
  if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) return { situation: "Choose a pause signal while everyone is calm", action: `Agree on one simple word or hand signal that either of you can use when feelings are rising. Practise it once before it is needed.`, phrase: "If either of us uses this signal, we pause and come back to the conversation.", sign: `${name} notices the signal or takes a short pause before the situation grows.` };
  if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) return { situation: "Repeat one manageable step", action: `Choose one small action ${name} can practise twice this week. Keep it familiar enough for progress to be noticed.`, phrase: "You have tried this once. Would you like to practise the same step again?", sign: `${name} approaches the second attempt with less hesitation or needs less help.` };
  if (/friend|social|lonely|bully|fit in/.test(text)) return { situation: "Create one low-pressure chance to connect", action: `Help ${name} choose a simple shared activity with one familiar peer, without making a new friendship the goal.`, phrase: "Would you like to invite someone to do this with you?", sign: `${name} shows interest in the activity, suggests a person, or explains what would feel comfortable.` };
  if (/listen|defiant|cooperate|behavio/.test(text)) return { situation: "Choose one routine to make predictable", action: `Pick one repeated task and agree with ${name} on the time and order before it begins. Keep the arrangement the same for one week.`, phrase: "Let us agree when this happens so neither of us has to keep reminding the other.", sign: `${name} begins the routine with fewer reminders or refers back to the agreement.` };
  return { situation: "", action: "", phrase: "", sign: "" };
}

function concernGuidance(concern: string, name: string): string[] {
  const text = concern.toLowerCase();
  let tips: string[];
  if (/connect|reconnect|reach\b|talk to|open up|closer|bond|communicat|relationship/.test(text)) tips = [`Begin with something ${name} already enjoys. Genuine interest in his or her music, games, hobbies, or daily experiences can create an easier opening for conversation.`, `Choose a relaxed moment when neither of you is rushed. Spending time side by side may feel more natural than beginning with a serious face-to-face conversation.`, `When ${name} shares something, listen before offering advice. If he or she is not ready to talk, gently make it clear that the invitation remains open.`];
  else if (/perfect|perfection|mistake|fear of fail|afraid to fail|not good enough/.test(text)) tips = [`Praise ${name} for the care and effort shown, not only for a flawless result. Point out one thing that improved so progress feels worth noticing too.`, `Before a task begins, agree together on what “good enough” will look like. A clear finishing point can help ${name} stop without feeling that more checking is always necessary.`, `When a mistake happens, keep your response calm and matter-of-fact. Help ${name} identify what can be learned or adjusted, then remind him or her that making a mistake does not erase the effort already made.`];
  else if (/exam|test stress|revision stress/.test(text)) tips = [`Ask ${name} which part of the exam feels most worrying. Naming one concern can make it easier to decide what would help.`, `Help ${name} divide revision into short, manageable sessions. A clear plan can make the work feel less overwhelming.`, `Before discussing results, acknowledge the effort already made. This reminds ${name} that one exam does not define his or her ability.`];
  else if (/school|study|homework|learn|grade/.test(text)) tips = [`Ask ${name} which part of the work feels hardest. Help him or her choose one small step so the task feels easier to approach.`, `If frustration builds, suggest a short break. Return to the same step afterwards so the break supports progress.`, `Notice whether a particular time, subject, or type of task feels easier. That pattern may reveal where a small change could help.`];
  else if (/anger|temper|tantrum|meltdown|emotion|upset/.test(text)) tips = [`Give ${name} time to settle before discussing what happened. Listening is easier once the strongest feelings have passed.`, `When ${name} is ready, ask what felt most upsetting. Listen before explaining clearly what needs to happen next.`, `Afterwards, agree on one simple way to handle a similar moment. Keep the plan short enough for ${name} to remember.`];
  else if (/confidence|shy|afraid|anxious|worry|fear/.test(text)) tips = [`Help ${name} choose one small step that feels possible. A manageable success can build confidence more naturally than immediate pressure.`, `Notice the effort even when the result is imperfect. A simple “You tried even though you felt worried” can mean a great deal.`, `Give ${name} time to become familiar with a new situation. Confidence may grow after watching first and joining when ready.`];
  else if (/friend|social|lonely|bully|fit in/.test(text)) tips = [`Ask about one specific part of the day, such as who ${name} spent time with. A smaller question may be easier than “How was school?”`, `Listen without rushing to solve the problem. Giving ${name} time to finish the story may reveal what support is actually wanted.`, `Check whether ${name} would prefer advice, practical help, or simply someone to listen. The answer may differ from one situation to another.`];
  else if (/weakness|weak point|area.*improv|see (?:his|her|their) (?:part|fault)/.test(text)) tips = [`Talk about one specific skill or situation rather than calling it a weakness. A clear example helps ${name} understand what can change without feeling that something is wrong with who he or she is.`, `Ask ${name} what felt difficult and what he or she would like to handle better next time. Listening to the answer makes self-awareness feel like discovery instead of criticism.`, `Notice honest reflection as well as improvement. When ${name} admits that something was difficult or accepts help, acknowledge that openness before discussing the next step.`];
  else if (/obstacle|setback|challenge|difficulty|difficulties|overcome/.test(text)) tips = [`Ask ${name} to describe the obstacle in his or her own words. Understanding whether the difficult part is starting, knowing what to do, or worrying about the result makes the next step clearer.`, `Help ${name} make the problem smaller without taking it over. Focus on one part that can be attempted now, then pause and review what the attempt revealed.`, `Notice the way ${name} approaches the obstacle, not only whether it disappears. Trying another method, asking for help, or returning after a setback are all signs of progress.`];
  else if (/stubborn|recognise|self.aware/.test(text)) tips = [`Avoid asking ${name} to agree that he or she is stubborn. Talk about one specific moment instead, including what happened and how it affected the situation.`, `Ask what ${name} was trying to achieve or protect in that moment. Once he or she feels heard, explore one different way the situation could have been handled.`, `Notice when ${name} reconsiders a decision, admits a mistake, or listens to another view. Recognising these moments can make honest self-reflection feel safer.`];
  else if (/listen|defiant|cooperate|behavio/.test(text)) tips = [`Keep the request short and clear so ${name} knows exactly what is expected. Explain one step before adding another.`, `Where possible, offer two acceptable choices. This gives ${name} some say while keeping the responsibility clear.`, `After the task is complete, acknowledge the cooperation. Brief, specific appreciation is easier to understand than a general compliment.`];
  else tips = [];
  return tips;
}

function deterministicQc(reading: Reading, childName?: string, gender?: string, concern?: string | null, strictEditorial = true): QcResult {
  const issues: string[] = [];
  const summary = reading.report_content;
  const prose = JSON.stringify(summary);
  const chart = reading.chart_data as { day_master?: string; day_master_name?: string; day_master_strength?: string; season?: string; knowledge_profile?: string };
  if (!reading.year_pillar || !reading.month_pillar || !reading.day_pillar || !chart.day_master || !chart.day_master_name || !chart.day_master_strength || !chart.season) issues.push("verified chart data is incomplete");
  if (!chart.knowledge_profile?.startsWith("day-master-v1/")) issues.push("the report is not attached to a reviewed Day Master profile");
  if (!summary?.personality || summary.strengths?.length !== 3 || summary.soft_spots?.length < 2 || summary.parenting_tips?.length !== 5 || !summary.closing_encouragement) issues.push("summary structure is incomplete");
  if (chart.day_master && !summary.personality.includes(chart.day_master)) issues.push("personality explanation does not identify the verified Day Master");
  if (/\b(?:strong|balanced|weak) day master\b/i.test(prose)) issues.push("unverified Day Master strength is exposed in customer-facing text");
  if (unsupportedClaims.test(prose)) issues.push("unsupported or over-certain claim detected");
  if (sourceLeak.test(prose)) issues.push("private source or internal process disclosure detected");
  if (aiStylePhrases.test(prose)) issues.push("formulaic AI-style wording detected");
  if (awkwardPhrases.test(prose)) issues.push("awkward, ungrammatical, or unnatural wording detected");
  if (/rather than treating it as a flaw|this quality may not appear in every setting|that does not make it any less meaningful|it can help to help/i.test(prose)) issues.push("cold, defensive, or convoluted stock wording detected");
  const longSentences = prose.replace(/[{}\[\]"]/g, " ").split(/[.!?]+/).filter((sentence) => words(sentence) > 32);
  if (longSentences.length) issues.push("the report contains sentences that are too long or convoluted");
  const sections = [...(summary.strengths ?? []), ...(summary.soft_spots ?? []), ...(summary.parenting_tips ?? [])];
  const visibleSections = [...(summary.strengths ?? []), ...(summary.soft_spots ?? [])];
  const visibleProse = JSON.stringify({
    personality: summary.personality,
    strengths: summary.strengths?.map(({ heading, body, guidance }) => ({ heading, body, guidance })),
    soft_spots: summary.soft_spots?.map(({ heading, body, guidance }) => ({ heading, body, guidance })),
    concern_response: summary.concern_response,
    concern_tips: summary.concern_tips,
    pressure: summary.day_master_support?.pressure,
    support: summary.day_master_support?.support,
    weekly_action: summary.day_master_support?.weekly_action,
    closing_encouragement: summary.closing_encouragement,
  });
  if (sections.some(({ heading }) => !heading || words(heading) > 6)) issues.push("section heading format is inconsistent");
  if (sections.some(({ body }) => words(body) < 12 || words(body) > 85)) issues.push("section length is outside the parent-friendly range");
  if ((summary.parenting_tips ?? []).some(({ body }) => words(body) < 20)) issues.push("a parenting tip needs more warmth, context, and practical explanation");
  if ((summary.parenting_tips ?? []).some(({ heading }) => /^nurture\b/i.test(heading))) issues.push("a support heading repeats a trait instead of describing a recognisable situation");
  const childInsights = [...(summary.strengths ?? []), ...(summary.soft_spots ?? [])];
  if (childInsights.some(({ body }) => !/\b(when|homework|school|friend|play|task|plan|mistake|routine|change|try|notice|moment|start|finish|join|speak|help)\b/i.test(body))) issues.push("an insight lacks a recognisable moment from the child's daily life");
  if ([...(summary.strengths ?? []), ...(summary.soft_spots ?? [])].some(({ basis }) => !basis?.factor || !basis?.value)) issues.push("a strength or soft spot is not traceable to verified Bazi data");
  if (childInsights.some(({ guidance }) => !guidance)) issues.push("parent guidance is not separated from a child observation");
  if (words(summary.personality ?? "") < 45 || words(summary.personality ?? "") > 180) issues.push("opening explanation is too brief or overwhelming");
  if ((summary.personality ?? "").split(/\n\s*\n/).filter(Boolean).length < 3) issues.push("personality explanation does not separate the Day Master image, the child, and the scope of this summary clearly");
  if (words(summary.closing_encouragement ?? "") < 75 || words(summary.closing_encouragement ?? "") > 220) issues.push("closing encouragement is too brief or overwhelming");
  if ((summary.closing_encouragement ?? "").split(/\n\s*\n/).filter(Boolean).length < 2) issues.push("closing encouragement does not separate encouragement from the wider Bazi invitation");
  const repeatedOpenings = visibleSections.map(({ body }) => body.trim().split(/\s+/).slice(0, 3).join(" ").toLowerCase());
  if (new Set(repeatedOpenings).size !== repeatedOpenings.length) issues.push("repetitive sentence openings detected");
  const sentences = visibleProse.replace(/[{}\[\]"]/g, " ").split(/[.!?]+/).map((sentence) => sentence.trim().toLowerCase()).filter((sentence) => words(sentence) >= 7);
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
  if (/\bthey (?:is|was|has|feels|asks|seems|becomes|explains|approaches|shows|states|finishes|begins|returns|notices|invites)\b/i.test(prose)) issues.push("singular-they verb agreement is incorrect");
  if (gender && gender !== "other" && /\bthe child(?:['’]s)?\b/i.test(prose)) issues.push("report refers generically to 'the child' instead of using personal pronouns");
  if (summary.concern_response) {
    if (childName && !summary.concern_response.includes(childName)) issues.push("parenting concern response is not personal to the child");
    if (words(summary.concern_response) < 8 || words(summary.concern_response) > 45) issues.push("parenting concern reflection is unclear or too long");
    if (/\b(start by|look for the situations|consistent observation|deserves a calm|offer one manageable choice)\b/i.test(summary.concern_response)) issues.push("parenting concern response sounds procedural or templated");
    if (!summary.concern_tips?.length) issues.push("parenting concern guidance is not separated from the observation");
    if (concern && /connect|reconnect|reach\b|talk to|open up|closer|bond|communicat|relationship/i.test(concern) && !/connect|closer|talk|listen|time together/i.test(`${summary.concern_response} ${summary.concern_tips?.join(" ") ?? ""}`)) issues.push("connection concern was not answered with connection guidance");
    if (concern && /perfect|perfection|mistake|fear of fail|afraid to fail|not good enough/i.test(concern) && !/effort|progress|good enough|mistake|pressure|checking/i.test(`${summary.concern_response} ${summary.concern_tips?.join(" ") ?? ""}`)) issues.push("perfectionism concern was not answered with relevant support");
    if (concern && /weakness|weak point|area.*improv|see (?:his|her|their) (?:part|fault)/i.test(concern) && !/area|difficult|improv|work on|practise|growth/i.test(`${summary.concern_response} ${summary.concern_tips?.join(" ") ?? ""}`)) issues.push("growth-area concern was not answered with relevant support");
    if (concern && /stubborn|recognise|self.aware/i.test(concern) && !/specific moment|what happened|trying to achieve|another (?:view|point)|reconsider|self-reflect/i.test(`${summary.concern_response} ${summary.concern_tips?.join(" ") ?? ""}`)) issues.push("self-awareness concern was mistaken for a cooperation problem");
  }
  if (!summary.day_master_support?.introduction || !summary.day_master_support.pressure || !summary.day_master_support.support || !summary.day_master_support.weekly_action?.situation || !summary.day_master_support.weekly_action.action || !summary.day_master_support.weekly_action.phrase || !summary.day_master_support.weekly_action.sign) {
    issues.push("Day Master support portrait is incomplete");
  }
  if (childName && summary.closing_encouragement.split(childName).length - 1 < 2) issues.push("closing encouragement is not personal enough");
  if (!/\b(summary|day master|one part|fuller|more)\b/i.test(summary.closing_encouragement)) issues.push("closing encouragement does not gently place the summary in the wider Bazi picture");
  if (/\b(traditional reflective framework|not a fixed label|set aside anything|keep what helps|this blueprint)\b/i.test(summary.closing_encouragement)) issues.push("closing encouragement sounds like a disclaimer or template");
  const blockingIssueMessages = new Set([
    "verified chart data is incomplete",
    "the report is not attached to a reviewed Day Master profile",
    "summary structure is incomplete",
    "personality explanation does not identify the verified Day Master",
    "unsupported or over-certain claim detected",
    "private source or internal process disclosure detected",
    "a strength or soft spot is not traceable to verified Bazi data",
    "Day Master support portrait is incomplete",
    "formulaic AI-style wording detected",
    "awkward, ungrammatical, or unnatural wording detected",
    "singular-they verb agreement is incorrect",
    "parenting concern response is not personal to the child",
    "parenting concern reflection is unclear or too long",
    "parenting concern response sounds procedural or templated",
    "connection concern was not answered with connection guidance",
    "perfectionism concern was not answered with relevant support",
    "growth-area concern was not answered with relevant support",
    "self-awareness concern was mistaken for a cooperation problem",
    "repetitive sentence openings detected",
    "the report repeats the same idea or sentence in more than one section",
    "the report overuses the same example sentence structure",
    "parent guidance repeats the same sentence structure",
    "the same qualities are repeated across report sections",
  ]);
  const blockingIssues = issues.filter((issue) => blockingIssueMessages.has(issue));
  const editorialWarnings = issues.filter((issue) => !blockingIssueMessages.has(issue));
  return strictEditorial
    ? { approved: issues.length === 0, issues, reviewer: "rules/expert-bazi-and-editorial-qc-v4" }
    : { approved: blockingIssues.length === 0, issues: blockingIssues, warnings: editorialWarnings, reviewer: "rules/expert-bazi-and-editorial-qc-v4" };
}

function withQc(reading: Reading, qc: QcResult): Reading {
  return { ...reading, insights_review_status: qc.approved ? "reviewed" : "rejected", chart_data: { ...reading.chart_data, expert_qc: { ...qc, reviewed_at: new Date().toISOString() } } };
}

function genderedSummary(summary: SummaryReport, gender: string): SummaryReport {
  const matchCase = (source: string, replacement: string) => source[0] === source[0].toUpperCase() ? capitalise(replacement) : replacement;
  const pronouns = gender === "male"
    ? { subject: "he", object: "him", possessive: "his", reflexive: "himself" }
    : gender === "female"
      ? { subject: "she", object: "her", possessive: "her", reflexive: "herself" }
      : { subject: "they", object: "them", possessive: "their", reflexive: "themselves" };
  const replace = (value: string) => value
    .replace(/\bhimself or herself\b/gi, (word) => matchCase(word, pronouns.reflexive))
    .replace(/\bhim or her\b/gi, (word) => matchCase(word, pronouns.object))
    .replace(/\bhis or her\b/gi, (word) => matchCase(word, pronouns.possessive))
    .replace(/\bhe or she\b/gi, (word) => matchCase(word, pronouns.subject))
    .replace(/\bthey is\b/gi, "they are")
    .replace(/\bthey was\b/gi, "they were")
    .replace(/\bthey has\b/gi, "they have")
    .replace(/\bthey feels\b/gi, "they feel")
    .replace(/\bthey asks\b/gi, "they ask")
    .replace(/\bthey seems\b/gi, "they seem")
    .replace(/\bthey becomes\b/gi, "they become")
    .replace(/\bthey explains\b/gi, "they explain")
    .replace(/\bthey approaches\b/gi, "they approach")
    .replace(/\bthey shows\b/gi, "they show")
    .replace(/\bthey states\b/gi, "they state")
    .replace(/\bthey finishes\b/gi, "they finish")
    .replace(/\bthey begins\b/gi, "they begin")
    .replace(/\bthey returns\b/gi, "they return")
    .replace(/\bthey notices\b/gi, "they notice")
    .replace(/\bthey invites\b/gi, "they invite");
  return JSON.parse(JSON.stringify(summary), (_key, value) => typeof value === "string" ? replace(value) : value) as SummaryReport;
}

function attachVerifiedBasis(candidate: SummaryReport, verified: SummaryReport): SummaryReport {
  const candidateWeekly = candidate.day_master_support?.weekly_action;
  const keepCandidateWeekly = candidateWeekly?.situation?.trim() && candidateWeekly.action?.trim() && candidateWeekly.phrase?.trim() && candidateWeekly.sign?.trim();
  const verifiedSupport = verified.day_master_support;
  return {
    ...candidate,
    strengths: candidate.strengths.map((point, index) => ({ ...point, guidance: point.guidance ?? verified.strengths[index]?.guidance, basis: verified.strengths[index]?.basis })),
    soft_spots: candidate.soft_spots.map((point, index) => ({ ...point, guidance: point.guidance ?? verified.soft_spots[index]?.guidance, basis: verified.soft_spots[index]?.basis })),
    day_master_support: verifiedSupport ? {
      ...verifiedSupport,
      weekly_action: keepCandidateWeekly ? { ...verifiedSupport.weekly_action, ...candidateWeekly } : verifiedSupport.weekly_action,
    } : candidate.day_master_support,
    concern_original: verified.concern_original,
    concern_response: candidate.concern_response ?? verified.concern_response,
    concern_tips: candidate.concern_tips?.length ? candidate.concern_tips : verified.concern_tips,
  };
}

function hasSafeConcernAnswer(summary: SummaryReport, name: string, concern?: string | null): boolean {
  const response = summary.concern_response?.trim() ?? "";
  const tips = summary.concern_tips ?? [];
  const text = `${response} ${tips.join(" ")}`;
  return response.toLowerCase().includes(name.toLowerCase())
    && words(response) >= 8
    && words(response) <= 55
    && tips.length >= 2
    && tips.length <= 3
    && tips.every((tip) => words(tip) >= 8 && words(tip) <= 75)
    && !unsupportedClaims.test(text)
    && !sourceLeak.test(text)
    && !aiStylePhrases.test(text)
    && !awkwardPhrases.test(text)
    && (!concern || !/weakness|weak point|area.*improv|see (?:his|her|their) (?:part|fault)/i.test(concern) || /area|difficult|improv|work on|practise|growth/i.test(text))
    && (!concern || !/stubborn|recognise|self.aware/i.test(concern) || /specific moment|what happened|trying to achieve|another (?:view|point)|reconsider|self-reflect/i.test(text));
}

async function generateTailoredConcern(summary: SummaryReport, input: Input, concern: string, dayMasterName: string): Promise<SummaryReport | null> {
  if (!process.env.OPENAI_API_KEY || process.env.CONCERN_AI_ENABLED === "false") return null;
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      signal: AbortSignal.timeout(18000),
      headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        response_format: { type: "json_object" },
        temperature: 0.7,
        max_tokens: 700,
        messages: [
          {
            role: "system",
            content: [
              "Return JSON only with concern_response, concern_tips, and weekly_action.",
              "Speak like a warm, practical parenting consultant. Use plain English a 12-year-old can understand.",
              "Answer the parent's exact concern. Do not replace it with a broader concern or infer behaviour, motives, fear, diagnosis, or circumstances that were not supplied.",
              "concern_response must warmly paraphrase the parent's intent in one sentence and include the child's name.",
              "concern_tips must contain exactly three distinct, concrete suggestions. Each suggestion must directly answer the concern and be 18 to 55 words.",
              "weekly_action must contain situation, action, phrase, and sign. It must be one small experiment for this week, not a repetition of any concern tip.",
              "Use the reviewed Day Master context only when it naturally supports the concern. Never force a link or invent another Bazi factor.",
              "Do not use labels such as stubborn, weak, difficult, or problematic unless the parent used that exact word, and never turn the label into a fact about the child.",
              "Use the selected he or she pronouns. Keep every sentence natural, specific, kind, and non-mechanical.",
            ].join(" "),
          },
          {
            role: "user",
            content: JSON.stringify({
              child_name: input.subject_name,
              gender: input.gender,
              parent_concern: concern,
              reviewed_day_master: dayMasterName,
              reviewed_context: dayMasterSupportPortraits[dayMasterName],
            }),
          },
        ],
      }),
    });
    if (!response.ok) throw new Error(`OpenAI concern ${response.status}`);
    const json = await response.json();
    const parsed = JSON.parse(json.choices[0].message.content) as {
      concern_response?: string;
      concern_tips?: string[];
      weekly_action?: { situation?: string; action?: string; phrase?: string; sign?: string };
    };
    const weekly = parsed.weekly_action;
    if (!parsed.concern_response || parsed.concern_tips?.length !== 3 || !weekly?.situation || !weekly.action || !weekly.phrase || !weekly.sign) return null;
    const weeklyAction = { situation: weekly.situation, action: weekly.action, phrase: weekly.phrase, sign: weekly.sign };
    const candidate = genderedSummary({
      ...summary,
      concern_original: concern,
      concern_response: parsed.concern_response,
      concern_tips: parsed.concern_tips,
      day_master_support: summary.day_master_support ? {
        ...summary.day_master_support,
        weekly_action: { ...weeklyAction, bazi_link: summary.day_master_support.weekly_action.bazi_link },
      } : summary.day_master_support,
    }, input.gender);
    const weeklyText = `${weekly.situation} ${weekly.action} ${weekly.phrase} ${weekly.sign}`;
    if (!hasSafeConcernAnswer(candidate, input.subject_name, concern)
      || unsupportedClaims.test(weeklyText)
      || sourceLeak.test(weeklyText)
      || aiStylePhrases.test(weeklyText)
      || awkwardPhrases.test(weeklyText)) return null;
    return candidate;
  } catch (error) {
    console.error("Concern generation fallback", error);
    return null;
  }
}

function groundedSummary(name: string, dayMasterName: string, dayMaster: string, strength: "Strong" | "Balanced" | "Weak", concern?: string | null, variationSeed?: number): SummaryReport {
  const profile = getDayMasterKnowledge(dayMasterName);
  const variationCycle = variationSeed === undefined ? Math.floor(Math.random() * 81) : Math.abs(Math.trunc(variationSeed));
  const openingVariant = variationCycle % 3;
  const connectionVariant = Math.floor(variationCycle / 3) % 3;
  const variant = Math.floor(variationCycle / 9) % 3;
  const closingVariant = Math.floor(variationCycle / 27) % 3;
  const personalityOpenings = [
    `${name}'s Day Master is ${dayMaster}. In Bazi, ${profile.name} is often compared to ${profile.image}.`,
    `In ${name}'s Bazi chart, the Day Master is ${dayMaster}. It is often compared to ${profile.image}.`,
    `${name} has the ${dayMaster} Day Master. Bazi compares ${profile.name} to ${profile.image}.`,
  ].map((opening) => profile.metaphorMeaning ? `${opening} ${profile.metaphorMeaning}` : opening);
  const everydayConnection = profile.strengths[connectionVariant];
  const defaultChildConnections = [
    `${name} ${everydayConnection.meaning}. You may notice it when ${name} is ${everydayConnection.everyday}.`,
    `This quality may appear in small, everyday moments. You may see it when ${name} is ${everydayConnection.everyday}.`,
    `You may recognise this part of ${name} when ${name} is ${everydayConnection.everyday}.`,
  ];
  const metaphorBridge = profile.metaphorBridge?.replaceAll("{name}", name);
  const childConnections = metaphorBridge
    ? [metaphorBridge, metaphorBridge, metaphorBridge]
    : defaultChildConnections;
  const personality = [
    personalityOpenings[openingVariant],
    childConnections[connectionVariant],
  ].join("\n\n");
  const wordingVariant = (heading: string) => [...`${variationCycle}-${name}-${heading}`]
    .reduce((seed, character) => Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0, 2166136261) % 3;
  const pointBody = (point: ReturnType<typeof getDayMasterKnowledge>["strengths"][number], position: number) => {
    if (point.descriptions) return point.descriptions[wordingVariant(point.heading)].replaceAll("{name}", name);
    if (point.description) return point.description.replaceAll("{name}", name);
    if (point.examples) {
      const versions = [
        `${name} ${point.meaning}. ${point.examples.join(" ")}`,
        `${name} ${point.meaning}. You may notice this when he or she is ${point.everyday}.`,
        `${name} ${point.meaning}. A parent may recognise this when he or she is ${point.everyday}.`,
      ];
      return versions[wordingVariant(point.heading)];
    }
    const versions = [
      `${name} ${point.meaning}. You may notice this when he or she is ${point.everyday}.`,
      `${name} ${point.meaning}. In everyday life, he or she may be ${point.everyday}.`,
      `${name} ${point.meaning}. A parent may recognise this when he or she is ${point.everyday}.`,
    ];
    return versions[(position + openingVariant) % versions.length];
  };
  const parentingTips = [
    { heading: "Notice a specific moment", body: `Describe one thing ${name} did and why it mattered. A specific observation is easier to understand than a broad compliment.` },
    { heading: "Ask before advising", body: `When something feels difficult, ask whether ${name} wants help, a listening ear, or time to think. The answer may change from one situation to another.` },
    { heading: "Keep the next step small", body: `Choose one action that can be tried now. A manageable step gives ${name} a chance to practise without making the whole situation feel overwhelming.` },
    { heading: "Allow room to recover", body: `After a difficult moment, return to the conversation when everyone is calmer. Focus on what can be understood or tried differently next time.` },
    { heading: "Look for gradual change", body: `Notice small shifts over several days instead of expecting an immediate result. This gives ${name} time to build confidence in a natural way.` },
  ];
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
  const supportPortrait = dayMasterSupportPortraits[dayMasterName];
  const matchedConcern = concern ? concernReflection(concern, name) : "";
  const concernAction = concern && matchedConcern ? concernWeeklyAction(concern, name) : null;
  const weeklyAction = concernAction?.situation ? concernAction : supportPortrait.weekly_action;
  const personalisePortrait = (text: string) => text.replaceAll("{name}", name);
  const rotate = <T,>(items: T[], offset: number) => [...items.slice(offset % items.length), ...items.slice(0, offset % items.length)];
  const guidanceText = (point: ReturnType<typeof getDayMasterKnowledge>["strengths"][number], _position: number) => {
    const guidance = capitalise(point.support.trim());
    return /[.!?][’”'"]?$/.test(guidance) ? guidance : `${guidance}.`;
  };
  const headingText = (point: ReturnType<typeof getDayMasterKnowledge>["strengths"][number]) => {
    const headingVariant = wordingVariant(`${point.heading}-heading`);
    return headingVariant === 0 ? point.heading : pointHeadingVariants[point.heading]?.[headingVariant - 1] ?? point.heading;
  };
  return {
    personality,
    strengths: rotate(profile.strengths, openingVariant).map((point, index) => ({ heading: headingText(point), body: pointBody(point, index), guidance: guidanceText(point, index), basis: { factor: "Day Master", value: dayMasterName } })),
    soft_spots: rotate(profile.softSpots, connectionVariant).map((point, index) => ({ heading: headingText(point), body: pointBody(point, index + 3), guidance: guidanceText(point, index + 3), basis: { factor: "Day Master expression", value: dayMasterName } })),
    day_master_support: {
      introduction: supportPortrait.introduction,
      secure: personalisePortrait(supportPortrait.secure),
      example: "",
      pressure: personalisePortrait(supportPortrait.pressure),
      support: personalisePortrait(supportPortrait.support),
      weekly_action: {
        situation: personalisePortrait(weeklyAction.situation),
        action: personalisePortrait(weeklyAction.action),
        phrase: personalisePortrait(weeklyAction.phrase),
        sign: personalisePortrait(weeklyAction.sign),
        bazi_link: matchedConcern ? personalisePortrait(dayMasterConcernLinks[dayMasterName]) : undefined,
      },
    },
    concern_original: concern ?? undefined,
    concern_response: concern
      ? matchedConcern || `You asked how to support ${name} with “${concern}”. The Day Master alone does not provide enough information to answer that responsibly without making assumptions.`
      : undefined,
    concern_tips: matchedConcern && concernGuidance(concern ?? "", name).length ? concernGuidance(concern ?? "", name) : undefined,
    parenting_tips: parentingTips,
    closing_encouragement: `${closingStarts[closingVariant]}\n\n${futureByDayMaster[dayMasterName]}\n\n${parentEncouragement}\n\nHopefully, this summary has given you better insight into how ${name} relates to the world. This first look focuses on the Day Master, which is only one part of a Bazi chart. Other parts can offer a fuller view of how he or she learns, manages emotions, and connects with others.`,
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
  return { year_pillar: formatPillar(...values.year), month_pillar: formatPillar(...values.month), day_pillar: formatPillar(...values.day), hour_pillar: input.birth_time ? formatPillar(...values.hour) : null, element_profile: `${dayMaster} Day Master`, insights: `1. ${input.subject_name} benefits from ${focus[input.question_type]}.\n2. The chart favours progress through consistent routines and one clear priority at a time.\n3. Notice opportunities that feel both energising and sustainable; those are stronger signals than urgency alone.`, insights_confidence: input.birth_time ? 0.9 : 0.78, insights_source: "calculation/validated-v4", report_content: genderedSummary(groundedSummary(input.subject_name, dayMasterName, dayMaster, strength, (input as Input & { parenting_concern?: string | null }).parenting_concern, input.variation_seed), input.gender), chart_status: "verified", chart_data: { ...values, day_master: dayMaster, day_master_name: dayMasterName, day_master_strength: strength, seasonal_state: state, season, strength_method: "season-first-v1", strength_review_status: "internal-screening-only", knowledge_profile: `day-master-v1/${dayMasterName}`, ten_gods: tenGods } };
}

export async function generateReading(input: Input): Promise<Reading> {
  const calculated = calculateReading(input);
  calculated.report_content = genderedSummary(calculated.report_content, input.gender);
  const calculatedChart = calculated.chart_data as { day_master?: string; day_master_name?: string };
  if (!calculatedChart.day_master || !calculatedChart.day_master_name) throw new Error("Calculated Day Master is missing or unsupported");
  const reviewedDayMaster = getDayMasterKnowledge(calculatedChart.day_master_name);
  const reviewedDayMasterForSummary = { ...reviewedDayMaster, strongExpression: undefined, weakExpression: undefined };
  const publicElement = Object.keys(elementStyle).find((element) => calculatedChart.day_master?.includes(element)) ?? "element";
  calculated.element_profile = `This summary focuses on one important part of the chart: ${input.subject_name}'s ${calculatedChart.day_master} Day Master. It is associated with ${elementStyle[publicElement] ?? "a distinctive way of responding to the world"}.`;
  const concern = (input as Input & { parenting_concern?: string | null }).parenting_concern;
  const verifiedQc = deterministicQc(calculated, input.subject_name, input.gender, concern, false);
  if (!verifiedQc.approved) throw new Error(`Deterministic report failed expert QC: ${verifiedQc.issues.join("; ")}`);
  const verified = withQc(calculated, verifiedQc);
  const fullSummaryAiEnabled = Boolean(process.env.OPENAI_API_KEY) && process.env.OPENAI_SYNC_ENABLED === "true" && process.env.FREE_SUMMARY_AI_ENABLED !== "false";
  if (!fullSummaryAiEnabled) {
    if (!concern) return verified;
    const tailoredConcern = await generateTailoredConcern(verified.report_content, input, concern, calculatedChart.day_master_name);
    if (!tailoredConcern) return verified;
    const tailored = { ...verified, report_content: tailoredConcern, insights_source: `${verified.insights_source}+openai-concern` };
    const tailoredQc = deterministicQc(tailored, input.subject_name, input.gender, concern);
    return tailoredQc.approved ? withQc(tailored, tailoredQc) : verified;
  }
  try {
    const systemPrompt = [
      "Return JSON containing only report_content.",
      "Write like a warm, experienced Bazi consultant speaking to one parent.",
      "Use plain English and short sentences. Most sentences should stay below 22 words and sound natural when read aloud.",
      "Write so that a 12-year-old can understand every sentence. Replace abstract phrases with actions a parent can see.",
      "Use only the supplied reviewed Day Master guidance. Do not add traits or calculation details.",
      "Introduce the child by name first. Then use the Day Master's natural image to help tell the story.",
      "After the Day Master comparison, connect it naturally to a behaviour the parent may recognise in the child. Do not use a fixed transition such as 'Likewise'.",
      "Write personality as three short paragraphs: the Day Master metaphor; how it may appear in this child; then a clear reminder that this Day Master view is only one part of the child's personality.",
      "Do not mention or interpret Day Master strength. Do not use the labels Strong Day Master, Balanced Day Master, or Weak Day Master in customer-facing text.",
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
      "Copy the parent's concern exactly into concern_original. Do not edit, summarise, or reinterpret it.",
      "For concern_response, address only the concern the parent supplied. Do not invent a cause, setting, pattern, feeling, or behaviour that the parent did not mention.",
      "Identify the parent's intent before writing concern guidance. A request about connecting must receive connection guidance; exam stress must not be turned into a general schoolwork concern.",
      "A concern about perfectionism must address pressure, fear of mistakes, knowing when work is good enough, and recognising effort or progress. Do not replace it with generic advice.",
      "Concern guidance must be simple, concrete, and easy to understand. Never ask a child to 'be brave all at once' or use similarly unnatural phrasing.",
      "For every strength and support area, put the child observation in body and the direct parent action in guidance. Never mix them in one paragraph.",
      "If there is a parenting concern, answer that exact concern rather than giving broad parenting advice. Paraphrase it warmly in concern_response, then give exactly three short and practical concern_tips. Do not infer fear, safety, motives, behaviour, or a different problem that the parent did not mention.",
      "Each concern tip must clearly connect to the concern supplied. A parent should be able to see why that particular suggestion answers the question.",
      "Write exactly five parenting tips of 35-60 words. Explain why each may help and include a realistic example or phrase.",
      "The closing must warmly summarise the child's main qualities, encourage the parent, and mention that the Day Master summary is only one part of what Bazi can reveal.",
      "Write the closing as two paragraphs. Keep the encouragement separate from the gentle invitation to explore the full chart.",
      "The invitation to explore more must feel natural and helpful, never salesy.",
      "Present Bazi as a reflective framework, not science, religion, prediction, diagnosis, or fixed destiny.",
      "Never invent structures, profile stars, Ten Gods, or other chart factors. Never identify internal sources or tools.",
      "report_content must contain personality, exactly 3 strengths, 2-3 soft_spots, exactly 5 parenting_tips, optional concern_response and concern_tips, and closing_encouragement.",
    ].join(" ");
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", signal: AbortSignal.timeout(25000), headers: { "content-type": "application/json", authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL ?? "gpt-4o-mini", response_format: { type: "json_object" }, temperature: 0.65, messages: [{ role: "system", content: systemPrompt }, { role: "user", content: JSON.stringify({ child: input, verified_day_master: { symbol: calculatedChart.day_master, name: calculatedChart.day_master_name }, reviewed_day_master_guidance: reviewedDayMasterForSummary }) }] }) });
    if (!response.ok) throw new Error(`OpenAI ${response.status}`); const json = await response.json(); const parsed = JSON.parse(json.choices[0].message.content);
    const personalised = genderedSummary(parsed.report_content, input.gender);
    if (!concern) {
      personalised.concern_original = undefined;
      personalised.concern_response = undefined;
      personalised.concern_tips = undefined;
    }
    const candidate = { ...verified, report_content: attachVerifiedBasis(personalised, verified.report_content), insights_source: `calculation/validated-v3+openai/${json.model}` };
    const qc = deterministicQc(candidate, input.subject_name, input.gender, concern);
    if (qc.approved) return withQc(candidate, qc);
    const fallback = hasSafeConcernAnswer(candidate.report_content, input.subject_name, concern)
      ? { ...verified, report_content: { ...verified.report_content, concern_response: candidate.report_content.concern_response, concern_tips: candidate.report_content.concern_tips } }
      : verified;
    const fallbackQc = deterministicQc(fallback, input.subject_name, input.gender, concern, false);
    if (!fallbackQc.approved) throw new Error(`Safe fallback failed editorial QC: ${fallbackQc.issues.join("; ")}`);
    return withQc(fallback, { ...fallbackQc, warnings: [`AI prose withheld: ${qc.issues.join("; ")}`], reviewer: "rules/expert-bazi-and-editorial-qc-v4-safe-fallback" });
  } catch (error) { console.error("AI generation fallback", error); return verified; }
}
