export type DayMasterPoint = {
  heading: string;
  meaning: string;
  everyday: string;
  support: string;
  examples?: [string, string];
  description?: string;
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
    name: "Jia Wood", image: "a tall, rooted tree", story: "Bazi uses a rooted tree to show how Jia Wood may grow steadily towards a clear goal.",
    warmIntroduction: "a steady, direct nature that often wants to grow towards something worthwhile",
    motivations: ["clear progress", "being trusted with responsibility", "protecting people or principles that matter"],
    strengths: [
      { heading: "Steady determination", meaning: "may stay with a meaningful goal even when progress takes time", everyday: "returning to a difficult model, book, or skill because finishing matters", support: "praise the effort, but avoid turning every interest into a target that must be achieved" },
      { heading: "Straightforward heart", meaning: "often prefers honesty and clear expectations", everyday: "saying plainly when a rule feels unfair or a promise has been broken", support: "value the honesty, then help shape the message with kindness" },
      { heading: "Protective loyalty", meaning: "may care deeply about people and commitments", everyday: "standing beside a friend or taking a family responsibility seriously", support: "show that caring for others can include asking for help and respecting personal limits" },
    ],
    softSpots: [
      { heading: "When plans change", meaning: "may find it difficult to let go of a plan after committing to it", everyday: "becoming unsettled when an outing, rule, or project changes unexpectedly", support: "give some warning and involve him or her in deciding what happens next" },
      { heading: "Speaking with more care", meaning: "may express an honest thought more sharply than intended", everyday: "correcting a sibling or classmate without noticing how the words may feel", support: "acknowledge the honest intention, then help him or her find a gentler way to express it" },
    ],
    strongExpression: "His or her steady and direct qualities may be easy to notice. Support can help that determination remain flexible when plans change.",
    weakExpression: "These qualities may be quieter at first. They often become clearer through encouragement, manageable challenges, and time to build trust.",
    limits: "The Day Master alone cannot establish sociability, academic ability, emotional health, or a fixed future.",
    closing: "persistence, strong principles, and a protective sense of loyalty",
  },
  Yi: {
    name: "Yi Wood", image: "a flexible vine", story: "Bazi uses a flexible vine to show how Yi Wood may adapt and keep growing when the path changes.",
    warmIntroduction: "an adaptable, observant nature that often finds a way to grow around obstacles",
    motivations: ["connection", "room to approach things creatively", "encouragement that preserves dignity"],
    strengths: [
      { heading: "Flexible problem-solving", meaning: "can adjust intelligently when the first route is blocked", everyday: "finding a different way into a game, friendship, or school task", support: "ask what else might work before supplying the answer" },
      { heading: "Social awareness", meaning: "may notice tone, timing, and how others are responding", everyday: "changing approach when a friend seems uncomfortable", support: "affirm this consideration while reminding him or her that personal needs also matter" },
      { heading: "Quiet resilience", meaning: "can keep growing through change without making a show of the effort", everyday: "settling into a new routine little by little", support: "name small signs of courage that might otherwise go unseen" },
    ],
    softSpots: [
      { heading: "May follow other people's choices", meaning: "may change a personal preference after seeing what others have chosen", everyday: "changing an answer to match a friend's", support: "give him or her quiet thinking time before asking for a decision" },
      { heading: "Choosing where to begin", meaning: "may find it difficult to choose between several appealing ideas", everyday: "starting different projects but being unsure which one to finish", support: "help him or her choose one small next step while leaving room for creativity" },
    ],
    strongExpression: "His or her adaptability may be easy to see around people and changing situations. Gentle guidance can help personal preferences remain clear too.",
    weakExpression: "This resourcefulness may be less obvious at first. It often appears more clearly in relationships and settings where he or she feels safe.",
    limits: "The Day Master alone cannot prove confidence, popularity, manipulation, or learning style.",
    closing: "flexibility, resourcefulness, and a thoughtful way of noticing other people",
  },
  Bing: {
    name: "Bing Fire", image: "the sun", story: "Bazi uses the sun to show the warmth and open energy often linked to Bing Fire.",
    warmIntroduction: "an open, bright nature that often brings warmth, visibility, and life to what matters",
    motivations: ["meaningful participation", "being able to contribute", "warm and genuine acknowledgement"],
    strengths: [
      { heading: "Natural warmth", meaning: "can make people feel included through an open presence", everyday: "welcoming someone into play or sharing enthusiasm freely", support: "appreciate the warmth without making him or her responsible for everyone else's mood" },
      { heading: "Hopeful energy", meaning: "often sees what could become possible", everyday: "bringing excitement back to a group after disappointment", support: "pair optimism with one realistic next step" },
      { heading: "Consistent spirit", meaning: "may prefer a clear direction and stay loyal to it", everyday: "returning to a familiar plan because it still feels right", support: "honour commitment while modelling that changing course can also be wise" },
    ],
    softSpots: [
      { heading: "When plans change", meaning: "may feel disappointed when events do not unfold as expected", everyday: "losing enthusiasm after an outing or project changes", support: "acknowledge the disappointment before discussing a new plan together" },
      { heading: "Needs room to recharge", meaning: "may appear cheerful around others even when feeling tired or discouraged", everyday: "becoming unusually quiet after returning home", support: "allow some quiet recovery without asking for an immediate explanation" },
    ],
    strongExpression: "Warmth and enthusiasm may be easy to notice. Calm guidance can help him or her share that energy while also leaving room for others.",
    weakExpression: "This brightness may appear only in certain settings. It often comes forward around trusted people and activities that feel meaningful.",
    limits: "The Day Master alone cannot determine extroversion, popularity, emotional regulation, or leadership ability.",
    closing: "warmth, optimism, and an ability to bring energy to the people and activities that matter",
  },
  Ding: {
    name: "Ding Fire", image: "a lamp", story: "Bazi uses a lamp to show the quieter warmth and careful insight often linked to Ding Fire.",
    warmIntroduction: "a thoughtful, illuminating nature that may notice meaning and feeling beneath the surface",
    motivations: ["being understood", "ideas with emotional meaning", "calm appreciation rather than loud attention"],
    strengths: [
      { heading: "Thoughtful insight", meaning: "may think deeply before revealing what has been noticed", everyday: "offering an observation that shows careful listening", support: "leave a pause after questions so the fuller answer has time to arrive" },
      { heading: "Gentle consideration", meaning: "often cares about how words and choices affect others", everyday: "remembering a small detail that comforts someone", support: "appreciate the kindness while reminding him or her that other people's feelings are not theirs to manage" },
      { heading: "Quiet influence", meaning: "can guide through ideas and example rather than force", everyday: "helping a sibling or friend see a different way", support: "invite contribution without putting him or her on display" },
    ],
    softSpots: [
      { heading: "May dwell on mistakes", meaning: "may continue thinking about a mistake or conversation after it has ended", everyday: "replaying what happened and wondering what could have been different", support: "listen first, then help him or her decide what can be changed and what can be left behind" },
      { heading: "Confidence may change", meaning: "may feel capable at one time and doubtful at another", everyday: "approaching a familiar task with unexpected hesitation", support: "offer calm reassurance without dismissing the feeling or trying to argue it away" },
    ],
    strongExpression: "Thoughts and feelings may be expressed quite clearly. Support can help strong opinions remain warm and considerate.",
    weakExpression: "These qualities may remain private until he or she feels understood. Reassurance and patient listening can help them emerge.",
    limits: "The Day Master alone cannot establish anxiety, instability, intelligence, or mental health.",
    closing: "thoughtful insight, quiet influence, and care for how other people feel",
  },
  Wu: {
    name: "Wu Earth", image: "a mountain", story: "Bazi uses a mountain to show the steady and dependable nature often linked to Wu Earth.",
    warmIntroduction: "a grounded, private nature that often values reliability, principles, and a secure foundation",
    motivations: ["stability", "clear priorities", "being relied upon without being rushed"],
    strengths: [
      { heading: "A dependable presence", meaning: "can bring steadiness when people or routines feel unsettled", everyday: "remembering what needs to be done or staying near someone who needs support", support: "thank him or her without making dependability an obligation" },
      { heading: "Strong principles", meaning: "often takes promises and responsibilities seriously", everyday: "wanting adults to keep a rule or promise consistent", support: "explain exceptions honestly rather than dismissing the concern" },
      { heading: "Patient preparation", meaning: "may prefer to understand the ground before beginning", everyday: "checking materials or instructions before a new task", support: "allow preparation while agreeing on a gentle point to begin" },
    ],
    softSpots: [
      { heading: "Needs time with change", meaning: "may need longer to accept a new plan or another point of view", everyday: "going quiet or resisting when plans change suddenly", support: "explain why the change is needed and give him or her a little time to adjust" },
      { heading: "May take on adult worries", meaning: "may feel responsible for problems that adults should handle", everyday: "trying to keep the peace or solve an adult's concern", support: "reassure him or her that the adults will take care of the problem" },
    ],
    strongExpression: "Reliability and strong principles may be easy to notice. Support can help him or her remain open to change and other points of view.",
    weakExpression: "These grounded qualities may take time to appear. Predictable care and preparation can help confidence grow through experience.",
    limits: "The Day Master alone cannot establish stubbornness, charisma, maturity, or family role.",
    closing: "steadiness, strong values, and a dependable way of caring for people",
  },
  Ji: {
    name: "Ji Earth", image: "garden soil", story: "Bazi uses garden soil to show the practical and nurturing care often linked to Ji Earth.",
    warmIntroduction: "a nurturing, receptive nature that often gathers knowledge and helps people or ideas grow",
    motivations: ["being useful", "learning that has practical meaning", "feeling connected and appreciated"],
    strengths: [
      { heading: "Nurtures growth", meaning: "may naturally help others feel supported", everyday: "showing someone younger how to do something or tending carefully to a shared project", support: "celebrate the care while making space for his or her own needs" },
      { heading: "Gathers useful knowledge", meaning: "often remembers information that can help in real situations", everyday: "connecting a fact learned earlier to today's problem", support: "invite him or her to explain discoveries without expecting an answer to everything" },
      { heading: "Resourceful care", meaning: "can find practical ways to make things better", everyday: "quietly organising materials or noticing what someone needs", support: "name the thought behind the action, not only the helpful result" },
    ],
    softSpots: [
      { heading: "May forget personal needs", meaning: "may concentrate on helping others even when already tired", everyday: "agreeing to help when rest is needed", support: "remind him or her that declining a request can sometimes be the healthy choice" },
      { heading: "May absorb other people's worries", meaning: "may notice tension even when nobody speaks about it", everyday: "seeming fine but becoming tense during uncertainty at home or school", support: "offer simple information and reassurance, then make space for questions later" },
    ],
    strongExpression: "Care and practical ability may be easy to notice. Guidance can help him or her support others without forgetting personal limits.",
    weakExpression: "This caring nature may appear through small, private gestures. It grows best when appreciation does not depend on always being useful.",
    limits: "The Day Master alone cannot define maternal behaviour, dependence, pessimism, or intellectual ability.",
    closing: "a caring nature, practical thinking, and a wish to help people or ideas grow",
  },
  Geng: {
    name: "Geng Metal", image: "raw iron", story: "Bazi uses raw iron to show how Geng Metal's determination may become clearer through experience and guidance.",
    warmIntroduction: "a straightforward nature. When something matters, he or she may speak plainly about what feels right. Determination may show when he or she stays with a difficult task or returns to it after a setback",
    motivations: ["a clear challenge", "visible progress", "trust earned through honesty and follow-through"],
    strengths: [
      { heading: "Courage to act", meaning: "may be willing to step forward when something feels difficult", everyday: "choosing the harder part of a task", examples: ["You may see him or her choose the harder part of a task instead of avoiding it.", "He or she may also speak up when someone is treated unfairly."], support: "Say, ‘That was brave of you.’ Let him or her know that asking for help can be brave too" },
      { heading: "Loyal follow-through", meaning: "may take friendships, promises, and responsibilities seriously", everyday: "keeping a promise to a friend or finishing a task that was agreed", support: "notice when he or she keeps a promise, while explaining that being a good friend does not require solving every problem" },
      { heading: "Growing through experience", meaning: "may grow in confidence through practice, mistakes, and another attempt", everyday: "returning to a difficult task and approaching it differently the second time", support: "focus your feedback on what he or she can try next, rather than dwelling on the mistake" },
    ],
    softSpots: [
      { heading: "Learning to pause and listen", meaning: "may respond quickly before hearing the full story", everyday: "interrupting an argument before the other person has finished", examples: ["You may see him or her interrupt an argument before the other person has finished speaking.", "He or she may also jump in to fix a problem before fully understanding what happened."], support: "you can ask, ‘What else do we need to know?’ This gives him or her a moment to pause before responding" },
      { heading: "Finding a steadier pace", meaning: "may push himself or herself to continue when doing well feels important", everyday: "continuing a task even when already frustrated or tired", examples: ["You may see him or her continue even when frustration or tiredness is building.", "A small mistake may feel especially upsetting when something is not working."], support: "you can suggest a short break before the next attempt. Remind him or her that a break can help, and does not mean giving up" },
    ],
    strongExpression: "Determination may be easy to notice. Guidance can help him or her pause, listen, and stay flexible instead of pushing ahead too quickly.",
    weakExpression: "Determination may appear clearly in one situation but remain quiet in another. Clear goals and encouragement can help it become more consistent.",
    limits: "The Day Master alone cannot establish aggression, authority, competitiveness, or ability to handle pressure.",
    closing: "courage, determination, and a strong sense of loyalty",
  },
  Xin: {
    name: "Xin Metal", image: "finely made jewellery", story: "Bazi uses finely made jewellery to show Xin Metal's care for quality and small details.",
    warmIntroduction: "a refined, discerning nature that often notices quality, meaning, and details others pass by",
    motivations: ["doing something well", "thoughtful appreciation", "time to understand before committing"],
    strengths: [
      { heading: "A discerning eye", meaning: "may notice small differences in quality, presentation, or reasoning", everyday: "spotting an error, choosing words carefully, or refining a creative piece", support: "value the care while agreeing on when something is complete enough" },
      { heading: "Curious mind", meaning: "often wants enough information to understand how something fits together", everyday: "asking follow-up questions or researching beyond the assignment", support: "welcome curiosity while helping choose the most useful question first" },
      { heading: "Loyal soft heart", meaning: "may care deeply for trusted people without showing every feeling openly", everyday: "remembering a friend's preference or quietly standing up for someone close", support: "make affection feel safe without expecting it to be displayed publicly" },
    ],
    softSpots: [
      { heading: "Hard to feel finished", meaning: "may find it difficult to stop when the result does not yet feel right", everyday: "redoing work because one detail still seems imperfect", support: "agree on what a finished task will look like before starting, then acknowledge its completion" },
      { heading: "Criticism may linger", meaning: "may continue thinking about criticism even when appearing unaffected", everyday: "replaying a comment later in the day", support: "give feedback privately and explain one clear improvement without listing every mistake" },
    ],
    strongExpression: "Careful judgement and high standards may be easy to notice. Support can help him or her know when the work is already good enough.",
    weakExpression: "These careful qualities may be more private or become unsettled under pressure. Trust and manageable expectations can help them appear more confidently.",
    limits: "The Day Master alone cannot establish vanity, status-seeking, manipulation, perseverance, or stress tolerance.",
    closing: "a careful mind, a loyal heart, and an eye for details that other people may miss",
  },
  Ren: {
    name: "Ren Water", image: "a flowing river", story: "Bazi uses a flowing river to show how Ren Water may keep moving and find another route when something gets in the way.",
    warmIntroduction: "a love of discovering new things and trying different activities. If the first idea does not work, he or she may think of another way to solve the problem",
    motivations: ["movement and discovery", "a meaningful challenge", "freedom within clear boundaries"],
    strengths: [
      { heading: "Big-picture thinking", meaning: "may start with one simple question and quickly imagine a much bigger story or project", everyday: "turning a classroom topic into an idea for something new to make", description: "{name} may start with one simple question and quickly imagine a much bigger story or project. A lesson about space, for instance, could spark an idea for a model rocket or a story about another planet.", support: "listen to the idea first, then help him or her choose one small step to begin with" },
      { heading: "Finds another way", meaning: "may look for another way forward when the original plan no longer works", everyday: "trying a different approach after a setback", description: "{name} may enjoy discovering new things and trying different activities. If the first idea does not work, he or she may think of another way to solve the problem. If a model will not stand, for example, he or she may change the design and try again.", support: "give him or her room to explore, then agree on a time to check in again" },
      { heading: "Learns by taking part", meaning: "may learn better when able to try something instead of only reading or listening", everyday: "understanding a lesson more easily after testing an idea or building something", description: "{name} may understand something more easily when he or she can try it personally. Testing an idea, building something, or joining an activity can make the lesson feel clearer.", support: "give him or her opportunities to learn by doing whenever possible" },
    ],
    softSpots: [
      { heading: "Drawn to many interests", meaning: "may become excited by several ideas and find it hard to decide which one to finish first", everyday: "starting a new activity before completing the one already underway", description: "Several ideas may catch {name}'s interest at the same time. He or she may begin a new activity while another is still unfinished, simply because the new idea feels exciting.", support: "write down the other ideas so they are not forgotten, then help him or her choose one thing to finish first" },
      { heading: "Benefits from a pause", meaning: "may respond before considering what could happen next", everyday: "answering or agreeing too quickly", description: "{name} may sometimes answer or agree before thinking about what could happen next. A short pause can give him or her time to understand the choice more fully.", support: "invite him or her to pause, then ask, 'What might happen next?' before a decision is made" },
    ],
    strongExpression: "Imagination and independence may be easy to notice. Clear limits can help that energy stay focused on something meaningful.",
    weakExpression: "Imagination may remain private before confidence grows. Safe opportunities to explore can help him or her take one achievable step at a time.",
    limits: "The Day Master alone cannot establish extroversion, intelligence, realism, distractibility, or risk-taking.",
    closing: "imagination, courage, and an ability to find another way when plans change",
  },
  Gui: {
    name: "Gui Water", image: "gentle rain", story: "Bazi uses gentle rain to show the quiet sensitivity and awareness often linked to Gui Water.",
    warmIntroduction: "a perceptive, subtle nature that often gathers impressions quietly and finds unexpected connections",
    motivations: ["emotional safety", "freedom to think", "gentle connection without pressure"],
    strengths: [
      { heading: "Perceptive awareness", meaning: "may notice small shifts in mood, meaning, or environment", everyday: "sensing that someone is uncomfortable before anything is said", support: "confirm the observation without asking him or her to manage the situation" },
      { heading: "Flow of ideas", meaning: "can connect thoughts in original and surprising ways", everyday: "offering an unusual answer, story, or solution", support: "ask how the idea formed and help give it a simple shape" },
      { heading: "Gentle versatility", meaning: "often adjusts to different people and settings", everyday: "finding a place in varied groups or changing approach quietly", support: "provide a reliable home base where adaptation is not required" },
    ],
    softSpots: [
      { heading: "Feelings stay private", meaning: "may keep thoughts and feelings inside until it feels safe to share them", everyday: "saying very little even though mood or behaviour has changed", support: "mention what you have noticed and leave room to talk later instead of asking repeated questions" },
      { heading: "Interest affects concentration", meaning: "may focus deeply on meaningful work but drift when a task feels disconnected", everyday: "becoming absorbed in one activity but struggling to finish another", support: "connect the task to a useful question and agree on one clear point to finish" },
    ],
    strongExpression: "Sensitivity and adaptability may be easy to notice. Gentle structure can help him or her stay consistent without feeling restricted.",
    weakExpression: "This insight may be especially quiet at first. Trust, patience, and freedom from immediate pressure can help it emerge.",
    limits: "The Day Master alone cannot establish mood disorder, secrecy, manipulation, wisdom, or consistency.",
    closing: "sensitivity, original ideas, and a quiet ability to notice what is happening around him or her",
  },
};

export function getDayMasterKnowledge(name: string): DayMasterKnowledge {
  return dayMasterKnowledge[name] ?? dayMasterKnowledge.Gui;
}
