/**
 * Builds the system and user prompts for the Storyboard generation step.
 *
 * @param {Object} params
 * @param {Object} params.script         - The script produced by the previous step
 * @param {string} params.script.hook
 * @param {string} params.script.script
 * @param {string} params.script.callToAction
 * @param {Object} params.creativeBrief  - The creative brief from the first step
 * @param {string} params.creativeBrief.title
 * @param {string} params.creativeBrief.tone
 * @param {string} params.creativeBrief.coreMessage
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildStoryboardPrompt({ script, creativeBrief }) {
  const { hook, script: scriptBody, callToAction } = script;
  const { title, tone, coreMessage } = creativeBrief;

  const systemPrompt = `You are a visual director and storyboard artist for short-form social media content. \
You translate scripts into vivid, shot-by-shot visual plans that a filmmaker or animator can execute immediately. \
Each scene description is specific — you describe camera angle, subject action, lighting, and on-screen text \
where relevant. Your narration lines match the tone and pacing of the script exactly.`;

  const userPrompt = `Create a 3-scene storyboard for the following script and creative brief:

Campaign Title: ${title}
Core Message: ${coreMessage}
Tone: ${tone}

Script:
- Hook: ${hook}
- Body: ${scriptBody}
- Call to Action: ${callToAction}

Divide the script naturally across exactly 3 scenes (opening, middle, closing). For each scene, describe \
what the viewer sees and what is said or displayed.

Return a JSON object with exactly this structure:
{
  "scenes": [
    {
      "scene": 1,
      "visual": "Detailed description of what is shown on screen — camera angle, action, setting, on-screen text",
      "narration": "The exact spoken words or text overlay for this scene"
    },
    {
      "scene": 2,
      "visual": "...",
      "narration": "..."
    },
    {
      "scene": 3,
      "visual": "...",
      "narration": "..."
    }
  ]
}

Respond with ONLY valid JSON. Do not include markdown code fences, explanations, or any text outside the JSON object.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildStoryboardPrompt };
