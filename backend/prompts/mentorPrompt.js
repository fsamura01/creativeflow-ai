/**
 * Builds the system and user prompts for the Mentor Review step.
 *
 * @param {Object} params
 * @param {Object} params.creativeBrief              - The creative brief from step 1
 * @param {string} params.creativeBrief.title
 * @param {string} params.creativeBrief.coreMessage
 * @param {string} params.creativeBrief.hookIdea
 * @param {string} params.creativeBrief.tone
 * @param {string} params.creativeBrief.keyTakeaway
 * @param {Object} params.script                     - The script from step 2
 * @param {string} params.script.hook
 * @param {string} params.script.script
 * @param {string} params.script.callToAction
 * @param {Object} params.storyboard                 - The storyboard from step 3
 * @param {Array}  params.storyboard.scenes
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildMentorPrompt({ creativeBrief, script, storyboard }) {
  const { title, coreMessage, hookIdea, tone, keyTakeaway } = creativeBrief;
  const { hook, script: scriptBody, callToAction } = script;
  const sceneSummary = storyboard.scenes
    .map((s) => `  Scene ${s.scene}: [Visual] ${s.visual} | [Narration] ${s.narration}`)
    .join('\n');

  const systemPrompt = `You are an experienced creative director and content mentor with over 15 years of experience \
in digital marketing, social media strategy, and brand storytelling. You give honest, constructive, and \
actionable feedback. Your reviews are specific — you cite exact elements from the work, not generic advice. \
You score work fairly on a 1–10 scale where 7 is solid professional quality and 10 is exceptional.`;

  const userPrompt = `Review the following complete creative package and provide mentor feedback:

--- CREATIVE BRIEF ---
Title: ${title}
Core Message: ${coreMessage}
Hook Idea: ${hookIdea}
Tone: ${tone}
Key Takeaway: ${keyTakeaway}

--- SCRIPT ---
Hook: ${hook}
Body: ${scriptBody}
Call to Action: ${callToAction}

--- STORYBOARD ---
${sceneSummary}

Evaluate the creative package as a whole. Consider:
- How well the script delivers on the brief's core message and tone
- Whether the hook is strong and platform-appropriate
- How clearly the storyboard translates the script into visuals
- Whether the call to action is compelling and specific
- Overall coherence and production-readiness

Return a JSON object with exactly this structure:
{
  "overallScore": <integer between 1 and 10>,
  "strengths": [
    "Specific strength #1 — cite actual elements from the work",
    "Specific strength #2",
    "Specific strength #3"
  ],
  "improvements": [
    "Specific improvement #1 — explain what to change and why",
    "Specific improvement #2",
    "Specific improvement #3"
  ],
  "nextSteps": [
    "Concrete next action #1 the creator should take",
    "Concrete next action #2",
    "Concrete next action #3"
  ]
}

Each array must contain at least 2 and no more than 5 items. Respond with ONLY valid JSON. \
Do not include markdown code fences, explanations, or any text outside the JSON object.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildMentorPrompt };
