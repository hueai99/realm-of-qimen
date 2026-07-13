export type DayMasterPoint = {
  heading: string;
  meaning: string;
  everyday: string;
  support: string;
  examples?: [string, string];
};

export type DayMasterKnowledge = {
  name: string;
  image: string;
  story: string;
  warmIntroduction: string;
  motivations: string[];
  strengths: [DayMasterPoint, DayMasterPoint, DayMasterPoint];
  softSpots: [DayMasterPoint, DayMasterPoint];
  strongExpression: string;
  weakExpression: string;
  limits: string;
  closing: string;
};

// Child-appropriate, independently phrased guidance distilled from the private
// reference set. Source names and adult-only claims must never be sent to users.
export const dayMasterKnowledge: Record<string, DayMasterKnowledge> = {
  Jia: {
    name: "Jia (Yang Wood)", image: "a tall, rooted tree", story: "Like a tree that grows steadily towards the light, this nature often prefers a clear direction and something worthwhile to build over time.",
    warmIntroduction: "a steady, direct nature that often wants to grow towards something worthwhile",
    motivations: ["clear progress", "being trusted with responsibility", "protecting people or principles that matter"],
    strengths: [
      { heading: "Steady determination", meaning: "can stay with a meaningful goal even when it takes time", everyday: "returning to a difficult model, book, or skill because finishing matters", support: "notice persistence without turning every interest into a performance target" },
      { heading: "Straightforward heart", meaning: "often prefers honesty and clear expectations", everyday: "saying plainly when a rule feels unfair or a promise has been broken", support: "value the honesty, then help shape the message with kindness" },
      { heading: "Protective loyalty", meaning: "may care deeply about people and commitments", everyday: "standing beside a friend or taking a family responsibility seriously", support: "show that caring for others can include asking for help and respecting personal limits" },
    ],
    softSpots: [
      { heading: "Hard to change course", meaning: "may hold tightly to a plan once committed", everyday: "struggling when an outing, rule, or project changes unexpectedly", support: "give a little warning and invite him or her to help choose the revised path" },
      { heading: "Words can land strongly", meaning: "directness may sound sharper than intended", everyday: "correcting a sibling or classmate before noticing how the other person feels", support: "teach a pause and a gentler second sentence without shaming the honesty" },
    ],
    strongExpression: "The steadiness and directness may be easy to see; guidance helps determination stay flexible rather than rigid.",
    weakExpression: "The same qualities may appear more quietly and grow through reliable encouragement, manageable challenges, and time to establish trust.",
    limits: "The Day Master alone cannot establish sociability, academic ability, emotional health, or a fixed future.",
    closing: "persistence, strong principles, and a protective sense of loyalty",
  },
  Yi: {
    name: "Yi (Yin Wood)", image: "a flexible vine or flowering plant", story: "A vine does not need to force a straight path; it notices what is around it, adapts, and still finds a way to grow.",
    warmIntroduction: "an adaptable, observant nature that often finds a way to grow around obstacles",
    motivations: ["connection", "room to approach things creatively", "encouragement that preserves dignity"],
    strengths: [
      { heading: "Flexible problem-solving", meaning: "can adjust intelligently when the first route is blocked", everyday: "finding a different way into a game, friendship, or school task", support: "ask what else might work before supplying the answer" },
      { heading: "Social awareness", meaning: "may notice tone, timing, and how others are responding", everyday: "changing approach when a friend seems uncomfortable", support: "affirm this consideration while reminding him or her that personal needs also matter" },
      { heading: "Quiet resilience", meaning: "can keep growing through change without making a show of the effort", everyday: "settling into a new routine little by little", support: "name small signs of courage that might otherwise go unseen" },
    ],
    softSpots: [
      { heading: "Pulled by many opinions", meaning: "may adapt so much that personal preference becomes hard to hear", everyday: "changing an answer after noticing what friends chose", support: "offer private thinking time before asking for a decision" },
      { heading: "Needs a gentle anchor", meaning: "many possibilities can delay commitment", everyday: "starting several ideas but hesitating over which to finish", support: "help choose one small next step while leaving room for creativity" },
    ],
    strongExpression: "Adaptability and social ease may be readily visible; support helps flexibility remain authentic rather than approval-seeking.",
    weakExpression: "This resourcefulness may be subtle at first and emerge best in relationships and settings that feel emotionally safe.",
    limits: "The Day Master alone cannot prove confidence, popularity, manipulation, or learning style.",
    closing: "flexibility, resourcefulness, and a thoughtful way of noticing other people",
  },
  Bing: {
    name: "Bing (Yang Fire)", image: "the sun", story: "Like sunlight that naturally warms and brightens a space, this nature often brings visible energy to people, ideas, and experiences that matter.",
    warmIntroduction: "an open, bright nature that often brings warmth, visibility, and life to what matters",
    motivations: ["meaningful participation", "being able to contribute", "warm and genuine acknowledgement"],
    strengths: [
      { heading: "Natural warmth", meaning: "can make people feel included through an open presence", everyday: "welcoming someone into play or sharing enthusiasm freely", support: "appreciate the warmth without making him or her responsible for everyone else's mood" },
      { heading: "Hopeful energy", meaning: "often sees what could become possible", everyday: "bringing excitement back to a group after disappointment", support: "pair optimism with one realistic next step" },
      { heading: "Consistent spirit", meaning: "may prefer a clear direction and stay loyal to it", everyday: "returning to a familiar plan because it still feels right", support: "honour commitment while modelling that changing course can also be wise" },
    ],
    softSpots: [
      { heading: "Fixed on Plan A", meaning: "may find it difficult when reality does not match the expected picture", everyday: "feeling deflated when an event or project changes", support: "acknowledge the disappointment before exploring a new version together" },
      { heading: "Needs room to recharge", meaning: "a bright outward presence can hide tiredness or discouragement", everyday: "staying cheerful around others, then becoming unusually quiet at home", support: "allow quiet recovery without demanding an explanation immediately" },
    ],
    strongExpression: "Warmth and enthusiasm may be immediately visible; calm guidance can help that energy leave room for other people too.",
    weakExpression: "The brightness may appear selectively, often unfolding around trusted people, meaningful interests, and unhurried encouragement.",
    limits: "The Day Master alone cannot determine extroversion, popularity, emotional regulation, or leadership ability.",
    closing: "warmth, optimism, and an ability to bring energy to the people and activities that matter",
  },
  Ding: {
    name: "Ding (Yin Fire)", image: "a lamp or guiding flame", story: "A lamp does not fill the whole sky. Its gift is quieter: helping people see what was hidden and bringing warmth close to home.",
    warmIntroduction: "a thoughtful, illuminating nature that may notice meaning and feeling beneath the surface",
    motivations: ["being understood", "ideas with emotional meaning", "calm appreciation rather than loud attention"],
    strengths: [
      { heading: "Thoughtful insight", meaning: "may think deeply before revealing what has been noticed", everyday: "offering an observation that shows careful listening", support: "leave a pause after questions so the fuller answer has time to arrive" },
      { heading: "Gentle consideration", meaning: "often cares about how words and choices affect others", everyday: "remembering a small detail that comforts someone", support: "appreciate the kindness while reminding him or her that other people's feelings are not theirs to manage" },
      { heading: "Quiet influence", meaning: "can guide through ideas and example rather than force", everyday: "helping a sibling or friend see a different way", support: "invite contribution without putting him or her on display" },
    ],
    softSpots: [
      { heading: "Thoughts keep circling", meaning: "careful reflection can turn into overthinking", everyday: "replaying a mistake or conversation long after it ended", support: "listen briefly, separate what can be changed from what can be released, then reconnect through a grounding activity" },
      { heading: "Feelings may flicker", meaning: "inner confidence can vary with atmosphere and response", everyday: "feeling capable one day and doubtful the next", support: "offer calm reassurance instead of trying to argue the feeling away" },
    ],
    strongExpression: "Insight and expressiveness may be easier to access; guidance helps conviction remain warm rather than becoming tense or exacting.",
    weakExpression: "These qualities may be more private, growing through reassurance, patient listening, and relationships where sensitivity is respected.",
    limits: "The Day Master alone cannot establish anxiety, instability, intelligence, or mental health.",
    closing: "thoughtful insight, quiet influence, and care for how other people feel",
  },
  Wu: {
    name: "Wu (Yang Earth)", image: "a mountain", story: "A mountain offers a sense of steadiness and shelter. It does not rush to move, and its strength is often felt simply because it remains present.",
    warmIntroduction: "a grounded, private nature that often values reliability, principles, and a secure foundation",
    motivations: ["stability", "clear priorities", "being relied upon without being rushed"],
    strengths: [
      { heading: "A dependable presence", meaning: "can bring steadiness when people or routines feel unsettled", everyday: "remembering what needs to be done or staying near someone who needs support", support: "thank him or her without making dependability an obligation" },
      { heading: "Strong principles", meaning: "often takes promises and responsibilities seriously", everyday: "wanting adults to keep a rule or promise consistent", support: "explain exceptions honestly rather than dismissing the concern" },
      { heading: "Patient preparation", meaning: "may prefer to understand the ground before beginning", everyday: "checking materials or instructions before a new task", support: "allow preparation while agreeing on a gentle point to begin" },
    ],
    softSpots: [
      { heading: "Slow to shift", meaning: "may need time to absorb change or a different viewpoint", everyday: "going quiet or resisting when plans change suddenly", support: "share the reason, preserve one familiar element, and allow a little processing time" },
      { heading: "Carries responsibility", meaning: "may take on worries that were never meant to be his or hers", everyday: "trying to keep peace or solve an adult's concern", support: "say clearly which worries the adults will handle" },
    ],
    strongExpression: "Reliability and conviction may be easy to see; support helps steadiness remain open to movement and other perspectives.",
    weakExpression: "The grounded qualities may emerge gradually and strengthen through predictable care, preparation, and confidence built one experience at a time.",
    limits: "The Day Master alone cannot establish stubbornness, charisma, maturity, or family role.",
    closing: "steadiness, strong values, and a dependable way of caring for people",
  },
  Ji: {
    name: "Ji (Yin Earth)", image: "cultivated soil", story: "Good soil quietly receives, nourishes, and helps many different things take root. Much of its work happens without asking to be seen.",
    warmIntroduction: "a nurturing, receptive nature that often gathers knowledge and helps people or ideas grow",
    motivations: ["being useful", "learning that has practical meaning", "feeling connected and appreciated"],
    strengths: [
      { heading: "Nurtures growth", meaning: "may naturally help others feel supported", everyday: "showing someone younger how to do something or tending carefully to a shared project", support: "celebrate the care while making space for his or her own needs" },
      { heading: "Gathers useful knowledge", meaning: "often remembers information that can help in real situations", everyday: "connecting a fact learned earlier to today's problem", support: "invite him or her to explain discoveries without expecting an answer to everything" },
      { heading: "Resourceful care", meaning: "can find practical ways to make things better", everyday: "quietly organising materials or noticing what someone needs", support: "name the thought behind the action, not only the helpful result" },
    ],
    softSpots: [
      { heading: "Gives too much", meaning: "may focus on keeping others comfortable and overlook personal limits", everyday: "agreeing to help while already tired", support: "teach that a kind no can protect genuine kindness" },
      { heading: "Worries beneath the surface", meaning: "receptiveness can mean absorbing more than is spoken", everyday: "seeming fine but becoming tense around family or school uncertainty", support: "offer simple facts, reassurance, and a chance to ask again later" },
    ],
    strongExpression: "Care and capability may be readily visible; guidance helps helpfulness include boundaries and personal choice.",
    weakExpression: "The nurturing qualities may appear in small private gestures and grow through appreciation that does not demand constant usefulness.",
    limits: "The Day Master alone cannot define maternal behaviour, dependence, pessimism, or intellectual ability.",
    closing: "a caring nature, practical thinking, and a wish to help people or ideas grow",
  },
  Geng: {
    name: "Geng (Yang Metal)", image: "raw iron", story: "Raw iron needs patient forging before it becomes strong and useful. In the same way, challenge may bring out courage, loyalty, and a willingness to act.",
    warmIntroduction: "a direct and determined nature. He or she may prefer to act instead of standing back when something matters",
    motivations: ["a clear challenge", "visible progress", "trust earned through honesty and follow-through"],
    strengths: [
      { heading: "Courage to act", meaning: "may be quick to step forward when something feels difficult", everyday: "choosing the harder part of a task", examples: ["You may see him or her choose the harder part of a task instead of avoiding it.", "He or she may also speak up when someone is treated unfairly."], support: "Praise the courage. Remind him or her that asking for help can also be brave" },
      { heading: "Loyal follow-through", meaning: "often takes bonds and commitments seriously", everyday: "staying beside a friend or finishing a promised task", support: "remind him or her that caring for a friend does not mean having to solve every problem for that friend" },
      { heading: "Built through challenge", meaning: "can become more capable through practical effort and feedback", everyday: "improving after a mistake by trying again directly", support: "give clear, respectful feedback focused on the next attempt" },
    ],
    softSpots: [
      { heading: "Acts before hearing everything", meaning: "may react quickly before hearing the full story", everyday: "interrupting an argument before the other person has finished", examples: ["You may see him or her interrupt an argument before the other person has finished speaking.", "He or she may also jump in to fix a problem before fully understanding what happened."], support: "Ask him or her to pause and explain what happened first. A simple question such as ‘What else do we need to know?’ can help" },
      { heading: "Pushes too hard", meaning: "may keep pushing when he or she wants to do well", everyday: "refusing to stop even when already frustrated or tired", examples: ["You may see him or her refuse to stop even when already frustrated or tired.", "A small mistake may upset him or her when something is not working."], support: "Let him or her take a short break before trying again. Remind him or her that taking a break is not giving up" },
    ],
    strongExpression: "Drive and resilience may be obvious; guidance helps strength include reflection, flexibility, and measured effort.",
    weakExpression: "This means courage and determination may not appear consistently. He or she may act boldly in one situation but hesitate in another. Clear goals, practical challenges, and encouragement can help these qualities become steadier.",
    limits: "The Day Master alone cannot establish aggression, authority, competitiveness, or ability to handle pressure.",
    closing: "courage, determination, and a strong sense of loyalty",
  },
  Xin: {
    name: "Xin (Yin Metal)", image: "finely worked metal or jewellery", story: "Finely worked metal is shaped with care and attention. Its beauty lies in refinement, precision, and the small details that others might overlook.",
    warmIntroduction: "a refined, discerning nature that often notices quality, meaning, and details others pass by",
    motivations: ["doing something well", "thoughtful appreciation", "time to understand before committing"],
    strengths: [
      { heading: "A discerning eye", meaning: "may notice small differences in quality, presentation, or reasoning", everyday: "spotting an error, choosing words carefully, or refining a creative piece", support: "value the care while agreeing on when something is complete enough" },
      { heading: "Curious mind", meaning: "often wants enough information to understand how something fits together", everyday: "asking follow-up questions or researching beyond the assignment", support: "welcome curiosity while helping choose the most useful question first" },
      { heading: "Loyal soft heart", meaning: "a composed exterior may protect deep care for trusted people", everyday: "remembering a friend's preference or quietly defending a close relationship", support: "make affection safe without forcing public displays" },
    ],
    softSpots: [
      { heading: "Hard to feel finished", meaning: "high standards and many details can make decisions or completion difficult", everyday: "redoing work or hesitating because one part is not quite right", support: "agree on two success markers before starting and celebrate completion" },
      { heading: "Sensitive to response", meaning: "appreciation and social feedback may matter more than is openly shown", everyday: "appearing unaffected but replaying criticism later", support: "give feedback privately, begin with what was understood, and keep the next step specific" },
    ],
    strongExpression: "Discernment and self-possession may be easy to see; support helps high standards remain humane and flexible.",
    weakExpression: "The refined qualities may be private or easily unsettled by pressure, unfolding through trust, sincere appreciation, and manageable expectations.",
    limits: "The Day Master alone cannot establish vanity, status-seeking, manipulation, perseverance, or stress tolerance.",
    closing: "a careful mind, a loyal heart, and an eye for details that other people may miss",
  },
  Ren: {
    name: "Ren (Yang Water)", image: "a broad river or ocean", story: "A broad river keeps moving, gathers many streams, and discovers new routes. This nature often comes alive through movement, possibility, and a wider view.",
    warmIntroduction: "an active, imaginative nature that often moves towards possibility, experience, and a wider view",
    motivations: ["movement and discovery", "a meaningful challenge", "freedom within clear boundaries"],
    strengths: [
      { heading: "Big-picture thinking", meaning: "may connect ideas quickly and imagine possibilities beyond the immediate task", everyday: "turning one question into a larger story or inventive plan", support: "enjoy the vision, then help choose the first workable step" },
      { heading: "Adaptive courage", meaning: "can find momentum when circumstances change", everyday: "joining a new activity or trying a different route after a setback", support: "offer room to explore with a clear point for checking back" },
      { heading: "Energetic engagement", meaning: "often learns by entering the experience rather than watching from the edge", everyday: "wanting to participate, test, discuss, or build", support: "include movement and hands-on discovery where possible" },
    ],
    softSpots: [
      { heading: "Pulled in many directions", meaning: "a wide field of interest can scatter attention", everyday: "moving excitedly between activities without closing one", support: "keep a visible 'now, next, later' list so ideas are saved without all becoming urgent" },
      { heading: "Momentum runs ahead", meaning: "speed and confidence may outpace reflection", everyday: "speaking directly or agreeing before considering the impact", support: "use a brief pause ritual before decisions rather than a long lecture afterwards" },
    ],
    strongExpression: "Movement, imagination, and independence may be readily visible; boundaries help that energy become purposeful rather than scattered.",
    weakExpression: "This range may appear as private imagination before outward confidence, growing through safe exploration and one attainable step at a time.",
    limits: "The Day Master alone cannot establish extroversion, intelligence, realism, distractibility, or risk-taking.",
    closing: "imagination, courage, and an ability to find another way when plans change",
  },
  Gui: {
    name: "Gui (Yin Water)", image: "rain, mist, or dew", story: "Rain and mist can be gentle yet reach everywhere. They gather quietly, respond to the surrounding landscape, and bring life in ways that are easy to miss at first.",
    warmIntroduction: "a perceptive, subtle nature that often gathers impressions quietly and finds unexpected connections",
    motivations: ["emotional safety", "freedom to think", "gentle connection without pressure"],
    strengths: [
      { heading: "Perceptive awareness", meaning: "may notice small shifts in mood, meaning, or environment", everyday: "sensing that someone is uncomfortable before anything is said", support: "confirm the observation without asking him or her to manage the situation" },
      { heading: "Flow of ideas", meaning: "can connect thoughts in original and surprising ways", everyday: "offering an unusual answer, story, or solution", support: "ask how the idea formed and help give it a simple shape" },
      { heading: "Gentle versatility", meaning: "often adjusts to different people and settings", everyday: "finding a place in varied groups or changing approach quietly", support: "provide a reliable home base where adaptation is not required" },
    ],
    softSpots: [
      { heading: "Feelings stay private", meaning: "the inner world may be difficult to read from the outside", everyday: "saying little while mood or play changes", support: "offer observations and an open door rather than repeated questions" },
      { heading: "Focus follows the current", meaning: "interest and energy may shift with atmosphere", everyday: "working deeply when engaged but drifting when a task feels disconnected", support: "link the task to a meaningful question and use one short finishing point" },
    ],
    strongExpression: "Perception and versatility may be easy to access; gentle structure helps fluidity become consistent without feeling confined.",
    weakExpression: "This insight may be especially subtle, unfolding through quiet trust, patient invitations, and freedom from immediate performance.",
    limits: "The Day Master alone cannot establish mood disorder, secrecy, manipulation, wisdom, or consistency.",
    closing: "sensitivity, original ideas, and a quiet ability to notice what is happening around him or her",
  },
};

export function getDayMasterKnowledge(name: string): DayMasterKnowledge {
  return dayMasterKnowledge[name] ?? dayMasterKnowledge.Gui;
}
