/**
 * Builds the system and user prompts for the Script generation step.
 *
 * @param {Object} params
 * @param {Object} params.creativeBrief - The creative brief produced by the previous step
 * @param {string} params.creativeBrief.title
 * @param {string} params.creativeBrief.coreMessage
 * @param {string} params.creativeBrief.hookIdea
 * @param {string} params.creativeBrief.tone
 * @param {string} params.creativeBrief.keyTakeaway
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildScriptPrompt({ creativeBrief }) {
  const { title, coreMessage, hookIdea, tone, keyTakeaway } = creativeBrief;

  const systemPrompt = `You are a professional scriptwriter specialising in short-form social media content. \
You craft punchy, platform-native scripts that hook viewers in the first three seconds and drive action. \
You write in the exact tone and voice specified, adapting pacing and language to the target platform. \
Your scripts are concise, conversational, and optimised for high completion rates.`;

  const userPrompt = `Write a short-form social media script based on the following creative brief:

- Campaign Title: ${title}
- Core Message: ${coreMessage}
- Hook Idea: ${hookIdea}
- Tone & Voice: ${tone}
- Key Takeaway: ${keyTakeaway}

Return a JSON object with exactly these three fields:
{
  "hook": "The opening 1–2 sentences (spoken or on-screen text) that immediately grab attention",
  "script": "The full body of the script — conversational, on-brand, and under 60 seconds when read aloud",
  "callToAction": "A direct, specific call to action that tells the viewer exactly what to do next"
}

Respond with ONLY valid JSON. Do not include markdown code fences, explanations, or any text outside the JSON object.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildScriptPrompt };
