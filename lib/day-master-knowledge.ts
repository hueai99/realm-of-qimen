export type DayMasterPoint = {
  heading: string;
  meaning: string;
  everyday: string;
  support: string;
  examples?: [string, string];
  description?: string;
  descriptions?: [string, string, string];
};

export type DayMasterKnowledge = {
  name: string;
  image: string;
  story: string;
  metaphorMeaning?: string;
  metaphorBridge?: string;
  warmIntroduction: string;
  motivations: string[];
  strengths: [DayMasterPoint, DayMasterPoint, DayMasterPoint];
  softSpots: [DayMasterPoint, DayMasterPoint];
  strongExpression: string;
  weakExpression: string;
  expressionExample: string;
  limits: string;
  closing: string;
};

// Child-appropriate, independently phrased guidance distilled from the private
// reference set. Source names and adult-only claims must never be sent to users.
export const dayMasterKnowledge: Record<string, DayMasterKnowledge> = {
  Jia: {
    name: "Jia Wood", image: "a tall, rooted tree", story: "Jia Wood is often compared to a tall, rooted tree. The metaphor helps explain its steady wish to grow towards a clear goal.",
    metaphorBridge: "A tall tree grows steadily and holds firm through changing weather. In a similar way, {name} may feel happiest with a clear direction and may keep working towards something that matters, even when progress takes time.",
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
    expressionExample: "In a new activity, he or she may watch quietly at first. Once comfortable, he or she may choose a goal and stay with it even when progress takes time.",
    limits: "The Day Master alone cannot establish sociability, academic ability, emotional health, or a fixed future.",
    closing: "persistence, strong principles, and a protective sense of loyalty",
  },
  Yi: {
    name: "Yi Wood", image: "a flexible vine", story: "Yi Wood is often compared to a flexible vine. The metaphor helps explain how it may adapt and keep growing when the path changes.",
    metaphorBridge: "A vine bends around whatever stands in its way and keeps searching for room to grow. In a similar way, {name} may observe what is happening, adjust the approach, and find another way forward when the first idea does not work.",
    warmIntroduction: "an adaptable, observant nature that often finds a way to grow around obstacles",
    motivations: ["connection", "room to approach things creatively", "encouragement that preserves dignity"],
    strengths: [
      { heading: "Finds another way", meaning: "may think of another way forward when the first idea does not work", everyday: "changing how to build something, approaching a school task differently, or finding another way to join a group", descriptions: ["{name} may look for a different solution when the first idea does not work. He or she may change a design, try a school task in another way, or find an easier way to join a group.", "When one approach does not work, {name} may be willing to try another. This could mean changing a design or approaching a school task from a different angle.", "{name} may adapt when the original plan is not working. He or she may test another method instead of remaining stuck on the first idea."], support: "before giving him or her the answer, ask, ‘What else could you try?’" },
      { heading: "Notices how others respond", meaning: "may notice another person's tone or expression and adjust the approach", everyday: "softening the words or giving a friend more space when the friend responds quietly", descriptions: ["{name} may notice small changes in another person's tone or expression and adjust the approach.", "If a friend responds quietly or seems uncomfortable, {name} may soften the words or give the friend more space.", "{name} may pay attention to how other people respond and choose a gentler way to continue."], support: "acknowledge this thoughtfulness, and remind him or her that personal feelings and needs matter too" },
      { heading: "Adjusts quietly to change", meaning: "may take time to settle when a routine changes", everyday: "becoming more comfortable with a new routine little by little", descriptions: ["{name} may take time to settle when a routine changes. Without drawing attention to the effort, he or she may adjust little by little until the new routine feels familiar.", "A change may feel unfamiliar at first, but {name} may gradually find a comfortable rhythm without making a fuss about the effort involved.", "{name} may adapt to a new routine quietly. Small steps can help him or her become more comfortable as time passes."], support: "notice the small steps he or she takes to adjust, especially when the change feels difficult" },
    ],
    softSpots: [
      { heading: "May follow other people's choices", meaning: "may change a personal preference after seeing what others have chosen", everyday: "changing an answer to match a friend's", support: "give him or her quiet thinking time before asking for a decision" },
      { heading: "May look for reassurance", meaning: "may want another person's encouragement before continuing independently", everyday: "asking whether an approach is right even after making a reasonable choice", support: "acknowledge the thought behind the choice, then encourage him or her to try the next step" },
    ],
    strongExpression: "His or her adaptability may be easy to see around people and changing situations. Gentle guidance can help personal preferences remain clear too.",
    weakExpression: "This resourcefulness may be less obvious at first. It often appears more clearly in relationships and settings where he or she feels safe.",
    expressionExample: "In a new group, he or she may take time to find a place. Once settled, he or she may begin connecting people or ideas in a thoughtful way.",
    limits: "The Day Master alone cannot prove confidence, popularity, manipulation, or learning style.",
    closing: "flexibility, resourcefulness, and a thoughtful way of noticing other people",
  },
  Bing: {
    name: "Bing Fire", image: "the sun", story: "Bing Fire is often compared to the sun. The metaphor helps explain the warmth and open energy linked to this Day Master.",
    metaphorBridge: "The sun gives warmth openly and is difficult to miss when it shines. In a similar way, {name} may bring visible enthusiasm to people and activities, especially when he or she feels welcome and involved.",
    warmIntroduction: "an open nature that may share enthusiasm freely and help other people feel included",
    motivations: ["meaningful participation", "being able to contribute", "warm and genuine acknowledgement"],
    strengths: [
      { heading: "Natural warmth", meaning: "can make people feel included through an open presence", everyday: "welcoming someone into play or sharing enthusiasm freely", support: "appreciate the warmth without making him or her responsible for everyone else's mood" },
      { heading: "Hopeful energy", meaning: "often sees what could become possible", everyday: "bringing excitement back to a group after disappointment", support: "pair optimism with one realistic next step" },
      { heading: "Consistent spirit", meaning: "may prefer a clear direction and stay loyal to it", everyday: "returning to a familiar plan because it still feels right", support: "honour commitment while modelling that changing course can also be wise" },
    ],
    softSpots: [
      { heading: "When plans change", meaning: "may feel disappointed when events do not unfold as expected", everyday: "losing enthusiasm after an outing or project changes", support: "acknowledge the disappointment before discussing a new plan together" },
      { heading: "When enthusiasm fades", meaning: "may become noticeably quieter when something is bothering him or her", everyday: "showing less interest than usual in a familiar activity", support: "allow some quiet time, then check in gently without expecting an immediate explanation" },
    ],
    strongExpression: "Warmth and enthusiasm may be easy to notice. Calm guidance can help him or her share that energy while also leaving room for others.",
    weakExpression: "This brightness may appear only in certain settings. It often comes forward around trusted people and activities that feel meaningful.",
    expressionExample: "At a new gathering, he or she may seem quiet at first. Around familiar people, warmth and enthusiasm may become much easier to see.",
    limits: "The Day Master alone cannot determine extroversion, popularity, emotional regulation, or leadership ability.",
    closing: "warmth, optimism, and an ability to bring energy to the people and activities that matter",
  },
  Ding: {
    name: "Ding Fire", image: "a lamp", story: "Ding Fire is often compared to a lamp. The metaphor helps explain the quieter warmth and careful insight linked to this Day Master.",
    metaphorBridge: "A lamp does not light the whole sky, but it helps people see what is close by. In a similar way, {name} may notice small details, offer quiet warmth, and share thoughtful observations when he or she feels safe enough to speak.",
    warmIntroduction: "a thoughtful nature that may notice details and feelings other people miss",
    motivations: ["being understood", "ideas with emotional meaning", "calm appreciation rather than loud attention"],
    strengths: [
      { heading: "Thoughtful insight", meaning: "may think carefully before sharing an observation", everyday: "mentioning a detail that shows careful listening", support: "pause after asking a question so he or she has time to answer" },
      { heading: "Gentle consideration", meaning: "often cares about how words and choices affect others", everyday: "remembering a small detail that comforts someone", support: "appreciate the kindness while reminding him or her that other people's feelings are not theirs to manage" },
      { heading: "Quiet influence", meaning: "may help other people through a thoughtful idea or quiet example", everyday: "showing a sibling or friend another way to approach something", support: "invite contribution without putting him or her on display" },
    ],
    softSpots: [
      { heading: "May dwell on mistakes", meaning: "may continue thinking about a mistake or conversation after it has ended", everyday: "replaying what happened and wondering what could have been different", support: "listen first, then help him or her decide what can be changed and what can be left behind" },
      { heading: "Confidence may change", meaning: "may feel capable at one time and doubtful at another", everyday: "approaching a familiar task with unexpected hesitation", support: "offer calm reassurance without dismissing the feeling or trying to argue it away" },
    ],
    strongExpression: "Thoughts and feelings may be expressed quite clearly. Support can help strong opinions remain warm and considerate.",
    weakExpression: "These qualities may remain private until he or she feels understood. Reassurance and patient listening can help them emerge.",
    expressionExample: "He or she may keep an observation private at first. During a calm conversation, a thoughtful idea or feeling may be shared with surprising clarity.",
    limits: "The Day Master alone cannot establish anxiety, instability, intelligence, or mental health.",
    closing: "thoughtful insight, quiet influence, and care for how other people feel",
  },
  Wu: {
    name: "Wu Earth", image: "a mountain", story: "Wu Earth is often compared to a mountain. The metaphor helps explain the steady and dependable qualities linked to this Day Master.",
    metaphorBridge: "A mountain feels solid and does not shift quickly. In a similar way, {name} may value familiar routines, take responsibilities seriously, and need a little time to feel ready when plans suddenly change.",
    warmIntroduction: "a steady nature that often values familiar routines, reliability, and knowing what to expect",
    motivations: ["stability", "clear priorities", "being relied upon without being rushed"],
    strengths: [
      { heading: "A dependable presence", meaning: "can bring steadiness when people or routines feel unsettled", everyday: "remembering what needs to be done or staying near someone who needs support", support: "thank him or her without making dependability an obligation" },
      { heading: "Takes commitments seriously", meaning: "may expect an agreed plan or promise to be followed", everyday: "remembering what was agreed and feeling unsettled when it changes without explanation", support: "explain changes honestly and involve him or her in the next step" },
      { heading: "Thinks before acting", meaning: "may take time to consider a new task or decision before beginning", everyday: "waiting until the expectations feel clear before taking the first step", support: "give him or her a little time to think, then agree on one clear starting step" },
    ],
    softSpots: [
      { heading: "Needs time with change", meaning: "may need longer to accept a new plan or another point of view", everyday: "going quiet or resisting when plans change suddenly", support: "explain why the change is needed and give him or her a little time to adjust" },
      { heading: "Carries concerns quietly", meaning: "may keep a concern private instead of asking for support", everyday: "becoming quieter when a familiar routine or plan feels unsettled", support: "check in privately and make it clear that he or she does not have to solve the problem alone" },
    ],
    strongExpression: "Reliability and strong principles may be easy to notice. Support can help him or her remain open to change and other points of view.",
    weakExpression: "These grounded qualities may take time to appear. Predictable care and preparation can help confidence grow through experience.",
    expressionExample: "A sudden change may make him or her cautious at first. With time to prepare, he or she may become the person who helps everyone stay steady.",
    limits: "The Day Master alone cannot establish stubbornness, charisma, maturity, or family role.",
    closing: "steadiness, strong values, and a dependable way of caring for people",
  },
  Ji: {
    name: "Ji Earth", image: "garden soil", story: "Ji Earth is often compared to garden soil. The metaphor helps explain the practical care and nurturing qualities linked to this Day Master.",
    metaphorBridge: "Garden soil quietly gives seeds what they need to take root and grow. In a similar way, {name} may support people through patient, practical care rather than drawing attention to what he or she is doing.",
    warmIntroduction: "a nurturing, receptive nature that often gathers knowledge and helps people or ideas grow",
    motivations: ["being useful", "learning that has practical meaning", "feeling connected and appreciated"],
    strengths: [
      { heading: "Nurtures growth", meaning: "may naturally help others feel supported", everyday: "showing someone younger how to do something or taking careful responsibility for a class activity", descriptions: ["{name} may be patient when helping someone learn or when working on something that needs steady care.", "{name} may enjoy showing a younger child what to do. He or she may also take special care over one part of a class activity or a task at home.", "{name} may help people feel supported by patiently showing them what to do."], support: "thank him or her for being thoughtful while also making room for his or her own personal needs" },
      { heading: "Remembers useful details", meaning: "may remember useful things learned earlier and bring them up when they matter", everyday: "recalling something from an earlier lesson that helps with a problem today", descriptions: ["{name} may remember something learned earlier and use it when a similar problem comes up.", "{name} may bring up a useful fact or idea at just the right moment.", "{name} may connect something learned before with a problem that needs solving today."], support: "invite him or her to share what came to mind. Reassure him or her that it is also fine not to have every answer" },
      { heading: "Resourceful care", meaning: "can find practical ways to make things better", everyday: "quietly organising materials or noticing what someone needs", descriptions: ["{name} may notice practical things that could make a situation easier, such as organising materials or offering help.", "{name} may quietly spot what is needed and take a practical step to help.", "{name} may show care by organising what is needed or making a task easier for someone."], support: "thank him or her for helping. Ask what made him or her notice that help was needed. This encourages him or her to recognise and explain the practical thinking behind the action" },
    ],
    softSpots: [
      { heading: "Remembering to rest too", meaning: "may concentrate on helping others even when already tired", everyday: "agreeing to help when rest is needed", description: "{name} may continue helping even when he or she is tired. He or she may say yes to another request instead of taking a needed break.", support: "remind him or her that caring for someone can also include saying, ‘I need to rest first’" },
      { heading: "May put other people first", meaning: "may offer help before finishing a personal responsibility", everyday: "pausing his or her own task when someone else asks for help", description: "{name} may pause a personal task when someone else asks for help, even when that task still needs attention.", support: "help him or her finish what needs attention first, then decide how much help can reasonably be offered" },
    ],
    strongExpression: "Care and practical ability may be easy to notice. Guidance can help him or her support others without forgetting personal limits.",
    weakExpression: "This caring nature may appear through small, private gestures. It grows best when appreciation does not depend on always being useful.",
    expressionExample: "He or she may not announce a wish to help. Instead, care may appear through remembering a small need or quietly making something easier for someone.",
    limits: "The Day Master alone cannot define maternal behaviour, dependence, pessimism, or intellectual ability.",
    closing: "a caring nature, practical thinking, and a wish to help people or ideas grow",
  },
  Geng: {
    name: "Geng Metal", image: "raw iron", story: "Geng Metal is often compared to raw iron. The metaphor helps explain how determination may be shaped through experience and guidance.",
    metaphorBridge: "Raw iron gains strength and form through shaping and repeated work. In a similar way, {name}'s determination may become clearer when he or she tackles something difficult, learns from a mistake, and tries again.",
    warmIntroduction: "a straightforward nature. When something matters, he or she may speak plainly about what feels right. Determination may show when he or she stays with a difficult task or returns to it after a setback",
    motivations: ["a clear challenge", "visible progress", "trust earned through honesty and follow-through"],
    strengths: [
      { heading: "Courage to act", meaning: "may be willing to step forward when something feels difficult", everyday: "choosing the harder part of a task", examples: ["You may see him or her choose the harder part of a task instead of avoiding it.", "He or she may also speak plainly when something seems wrong or does not match what was agreed."], support: "Say, ‘That was brave of you.’ Let him or her know that asking for help can be brave too" },
      { heading: "Loyal follow-through", meaning: "may take friendships, promises, and responsibilities seriously", everyday: "keeping a promise to a friend or finishing a task that was agreed", support: "notice when he or she keeps a promise, while explaining that being a good friend does not require solving every problem" },
      { heading: "Growing through experience", meaning: "may grow in confidence through practice, mistakes, and another attempt", everyday: "returning to a difficult task and approaching it differently the second time", support: "focus your feedback on what he or she can try next, rather than dwelling on the mistake" },
    ],
    softSpots: [
      { heading: "Learning to pause and listen", meaning: "may respond quickly before hearing the full story", everyday: "interrupting an argument before the other person has finished", examples: ["You may see him or her interrupt an argument before the other person has finished speaking.", "He or she may also jump in to fix a problem before fully understanding what happened."], support: "you can ask, ‘What else do we need to know?’ This gives him or her a moment to pause before responding" },
      { heading: "Finding a steadier pace", meaning: "may push himself or herself to continue when doing well feels important", everyday: "continuing a task even when already frustrated or tired", examples: ["You may see him or her continue even when frustration or tiredness is building.", "A small mistake may feel especially upsetting when something is not working."], support: "you can suggest a short break before the next attempt. Remind him or her that a break can help, and does not mean giving up" },
    ],
    strongExpression: "Determination may be easy to notice. Guidance can help him or her pause, listen, and stay flexible instead of pushing ahead too quickly.",
    weakExpression: "Determination may appear clearly in one situation but remain quiet in another. Clear goals and encouragement can help it become more consistent.",
    expressionExample: "He or she may stay quiet when a challenge first appears. Once the goal feels clear, he or she may step forward and keep trying after a setback.",
    limits: "The Day Master alone cannot establish aggression, authority, competitiveness, or ability to handle pressure.",
    closing: "courage, determination, and a strong sense of loyalty",
  },
  Xin: {
    name: "Xin Metal", image: "finely made jewellery", story: "Xin Metal is often compared to finely made jewellery. The metaphor helps explain its care for quality and small details.",
    metaphorBridge: "Fine jewellery is shaped with patience and close attention to detail. In a similar way, {name} may notice small differences, care about doing things well, and choose words or actions carefully.",
    warmIntroduction: "a refined, discerning nature that often notices quality, meaning, and details others pass by",
    motivations: ["doing something well", "thoughtful appreciation", "time to understand before committing"],
    strengths: [
      { heading: "A discerning eye", meaning: "may notice small differences in quality, presentation, or reasoning", everyday: "spotting an error, choosing words carefully, or refining a creative piece", support: "value the care while agreeing on when something is complete enough" },
      { heading: "Curious mind", meaning: "often wants enough information to understand how something fits together", everyday: "asking follow-up questions or researching beyond the assignment", support: "welcome curiosity while helping choose the most useful question first" },
      { heading: "Quiet loyalty", meaning: "may care deeply for trusted people without showing every feeling openly", everyday: "remembering a friend's preference or quietly standing up for someone close", support: "make affection feel safe without expecting it to be displayed publicly" },
    ],
    softSpots: [
      { heading: "Hard to feel finished", meaning: "may find it difficult to stop when the result does not yet feel right", everyday: "spending longer on a task because one detail still does not feel right", support: "agree on what a finished task will look like before starting, then acknowledge its completion" },
      { heading: "Criticism may linger", meaning: "may continue thinking about criticism even when appearing unaffected", everyday: "replaying a comment later in the day", support: "give feedback privately and explain one clear improvement without listing every mistake" },
    ],
    strongExpression: "Careful judgement and high standards may be easy to notice. Support can help him or her know when the work is already good enough.",
    weakExpression: "These careful qualities may be more private or become unsettled under pressure. Trust and manageable expectations can help them appear more confidently.",
    expressionExample: "He or she may notice a small mistake without mentioning it at first. When invited to share, the careful observation may help improve the finished work.",
    limits: "The Day Master alone cannot establish vanity, status-seeking, manipulation, perseverance, or stress tolerance.",
    closing: "a careful mind, a loyal heart, and an eye for details that other people may miss",
  },
  Ren: {
    name: "Ren Water", image: "a flowing river", story: "Ren Water is often compared to a flowing river. The metaphor helps explain how it may keep moving and find another route around an obstacle.",
    metaphorBridge: "A river keeps moving and changes course when something blocks its path. In a similar way, {name} may explore different ideas and find another way forward when the first plan does not work.",
    warmIntroduction: "an adaptable nature. When something does not go according to plan, he or she may try a different approach instead of giving up",
    motivations: ["movement and discovery", "a meaningful challenge", "freedom within clear boundaries"],
    strengths: [
      { heading: "Big-picture thinking", meaning: "may start with one simple question and quickly imagine a much bigger story or project", everyday: "turning a classroom topic into an idea for something new to make", descriptions: ["{name} may begin with a simple question and imagine a much larger project. A lesson about space could inspire a model rocket or a story about another planet.", "A small idea may quickly grow in {name}'s mind. A weekend outing, for example, could inspire a map, a story, or a plan for a future adventure.", "When a topic catches {name}'s interest, he or she may see possibilities beyond the original task. A simple art activity could become an idea for a larger display or handmade gift."], support: "listen to the idea first, then help him or her choose one small step to try" },
      { heading: "Finds another way", meaning: "may look for another way forward when the original plan no longer works", everyday: "trying a different approach after a setback", descriptions: ["{name} may enjoy discovering new things and trying different activities. If a model will not stand, he or she may change the design and try again.", "When the first plan does not work, {name} may be willing to adjust it. During a game, he or she might change strategy instead of giving up.", "An unexpected problem may lead {name} to test another approach. If a craft does not turn out as planned, he or she may use the materials in a different way."], support: "give him or her room to explore, then agree on a time to check in again" },
      { heading: "Open to discovery", meaning: "may enjoy exploring unfamiliar ideas and experiences", everyday: "asking questions about a new topic or choosing an activity that offers something different", descriptions: ["{name} may enjoy discovering something unfamiliar. A new topic may lead to questions and ideas that continue after the activity ends.", "Curiosity may draw {name} towards a new subject or activity. He or she may want time to explore before deciding what to do with it.", "When something new catches {name}'s attention, he or she may ask questions and look for more possibilities."], support: "give him or her room to explore while keeping one clear starting point" },
    ],
    softSpots: [
      { heading: "Drawn to many interests", meaning: "may become excited by several ideas and find it hard to decide which one to finish first", everyday: "starting a new activity before completing the one already underway", descriptions: ["Several ideas may catch {name}'s interest at the same time. He or she may begin a new activity while another is still unfinished because the new idea feels exciting.", "{name} may become interested in something new before the current activity is complete. This is often excitement rather than a lack of effort.", "When several activities look appealing, {name} may find it difficult to choose which one deserves attention first. The newest idea may quickly pull focus away from an earlier one."], support: "keep a short list of the other ideas, then help him or her choose one thing to finish first" },
      { heading: "Benefits from a pause", meaning: "may respond before considering what could happen next", everyday: "answering or agreeing too quickly", descriptions: ["{name} may sometimes answer or agree before thinking about what could happen next. A short pause can give him or her time to understand the choice more fully.", "Excitement may lead {name} to decide quickly. Taking a moment before answering can make the next step easier to understand.", "{name} may be ready to act before all the details are clear. A brief pause can help him or her notice what the decision may involve."], support: "invite him or her to pause, then ask, 'What might happen next?' before a decision is made" },
    ],
    strongExpression: "Imagination and adaptability may be easy to notice. Clear limits can help that energy stay focused on something meaningful.",
    weakExpression: "Imagination and adaptability may appear differently across situations. A full chart assessment is needed before interpreting Day Master strength.",
    expressionExample: "He or she may stay quiet when joining a new activity. Once comfortable, he or she may begin sharing ideas or suggest a different approach when something does not work.",
    limits: "The Day Master alone cannot establish extroversion, intelligence, realism, distractibility, or risk-taking.",
    closing: "imagination, adaptability, and a willingness to try another way when plans change",
  },
  Gui: {
    name: "Gui Water", image: "gentle rain", story: "Gui Water is often compared to gentle rain. The metaphor helps explain the quiet sensitivity and awareness linked to this Day Master.",
    metaphorBridge: "Gentle rain works quietly, soaking into the ground little by little. In a similar way, {name} may take in small details before speaking and later share an observation that other people missed.",
    metaphorMeaning: "Gentle rain does not arrive with a loud splash. It gathers quietly and reaches small places, offering a simple picture of Gui Water's observant and thoughtful nature.",
    warmIntroduction: "a quiet, thoughtful nature that may notice small details and reflect before speaking",
    motivations: ["emotional safety", "freedom to think", "gentle connection without pressure"],
    strengths: [
      { heading: "Perceptive awareness", meaning: "may notice small changes in tone, behaviour, or surroundings", everyday: "asking about a change in someone's tone or noticing that a familiar routine feels different", support: "listen to the observation without expecting him or her to manage the situation" },
      { heading: "Flow of ideas", meaning: "can connect thoughts in original and surprising ways", everyday: "offering an unusual answer, story, or solution", support: "ask how the idea formed and help give it a simple shape" },
      { heading: "Gentle versatility", meaning: "may adjust quietly to different people and settings", everyday: "taking time to find a comfortable place in a new group", support: "keep home routines predictable so he or she has a familiar place to relax" },
    ],
    softSpots: [
      { heading: "Feelings stay private", meaning: "may keep thoughts and feelings inside until it feels safe to share them", everyday: "saying very little even though mood or behaviour has changed", support: "mention what you have noticed and leave room to talk later instead of asking repeated questions" },
      { heading: "Needs a clear purpose", meaning: "may find it easier to continue when the purpose of a task is clear", everyday: "asking why a task matters before settling into it", support: "explain one practical reason for the task and agree on a clear point to finish" },
    ],
    strongExpression: "Sensitivity and adaptability may be easy to notice. Gentle structure can help him or her stay consistent without feeling restricted.",
    weakExpression: "This insight may be especially quiet at first. Trust, patience, and freedom from immediate pressure can help it emerge.",
    expressionExample: "He or she may watch quietly before joining a conversation. Once comfortable, he or she may mention a detail others missed or connect two ideas in an unexpected way.",
    limits: "The Day Master alone cannot establish mood disorder, secrecy, manipulation, wisdom, or consistency.",
    closing: "sensitivity, original ideas, and a quiet ability to notice what is happening around him or her",
  },
};

export function getDayMasterKnowledge(name: string): DayMasterKnowledge {
  const knowledge = dayMasterKnowledge[name];
  if (!knowledge) throw new Error(`Unsupported Day Master knowledge profile: ${name}`);
  return knowledge;
}
