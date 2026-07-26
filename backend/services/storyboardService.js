'use strict';

const { client, useMock, modelId, projectId } = require('../config/watsonx');
const { buildStoryboardPrompt } = require('../prompts/storyboardPrompt');
const { stripMarkdownFences } = require('./refineService');

const MOCK_STORYBOARD = {
  scenes: [
    {
      scene: 1,
      visual: 'Close-up shot of two side-by-side smartphone screens. Left screen: a blank code editor with a blinking cursor and a confused emoji reaction. Right screen: a polished to-do app running live. Bold white text on a dark overlay fades in: "30 Days. One Skill. Zero Excuses." Upbeat lo-fi beat starts.',
      narration: "Did you know that 90% of people who try to learn JavaScript quit within the first week? Here's the dead-simple system that keeps you in the other 10%.",
    },
    {
      scene: 2,
      visual: 'Fast-cut montage of a laptop screen. Day 1 counter appears in the top corner — a tip calculator renders in the browser. Cut to Day 7 — a weather widget pulls live data. Cut to Day 30 — a to-do list saves tasks to local storage. Each cut lands on a beat. The developer\'s hands are visible, typing quickly and confidently. On-screen text overlays: "Day 1 → Tip Calculator", "Day 7 → Weather App", "Day 30 → Full To-Do App".',
      narration: 'The 30-Day JavaScript Challenge flips the script: every day you build something real. No endless theory, no tutorial hell — just 45 minutes a day and a project you can actually show people.',
    },
    {
      scene: 3,
      visual: 'Developer leans back in chair, smiling at a finished app on screen. Camera slowly zooms out. A clean CTA card fades in over a soft gradient background: "Free 30-Day Roadmap — Link in Description ↓". Subtle arrow animation pulses downward. End frame holds for 3 seconds.',
      narration: 'The curriculum is free, the community is here, and Day 1 is waiting. Click the link in the description to download your free 30-Day JavaScript roadmap and start today.',
    },
  ],
};

/**
 * Generates a 3-scene storyboard from a script and creative brief.
 *
 * @param {Object} script        - The script produced by generateScript
 * @param {Object} creativeBrief - The brief produced by generateCreativeBrief
 * @returns {Promise<{ scenes: Array<{ scene: number, visual: string, narration: string }> }>}
 */
async function generateStoryboard(script, creativeBrief) {
  if (useMock) {
    return MOCK_STORYBOARD;
  }

  const { systemPrompt, userPrompt } = buildStoryboardPrompt({ script, creativeBrief });

  const response = await client.textChat({
    modelId,
    projectId,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    maxTokens: 1024,
  });

  const text = stripMarkdownFences(response.result.choices[0].message.content);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('AI returned invalid JSON: ' + text);
  }
}

module.exports = { generateStoryboard };
