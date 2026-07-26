'use strict';

const { client, useMock, modelId, projectId } = require('../config/watsonx');
const { buildScriptPrompt } = require('../prompts/scriptPrompt');
const { stripMarkdownFences } = require('./refineService');

const MOCK_SCRIPT = {
  hook: "Did you know that 90% of people who try to learn JavaScript quit within the first week? Here's the dead-simple system that keeps you in the other 10%.",
  script: "Most JavaScript tutorials throw you into abstract concepts before you ever build anything real — and that's exactly why beginners burn out. The 30-Day JavaScript Challenge flips that: on Day 1 you build a working tip calculator. On Day 7, a live weather app. By Day 30, a full to-do list with local storage. Every single day you write code, ship something, and build momentum. No endless theory. No tutorial hell. Just 45 minutes a day and a project you can actually show people. The curriculum is free, the community is supportive, and the only thing standing between you and writing JavaScript confidently is starting.",
  callToAction: 'Click the link in the description to download the free 30-Day JavaScript roadmap and start Day 1 today.',
};

/**
 * Generates a short-form script from a creative brief.
 *
 * @param {Object} creativeBrief - The brief produced by generateCreativeBrief
 * @returns {Promise<{ hook: string, script: string, callToAction: string }>}
 */
async function generateScript(creativeBrief) {
  if (useMock) {
    return MOCK_SCRIPT;
  }

  const { systemPrompt, userPrompt } = buildScriptPrompt({ creativeBrief });

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

module.exports = { generateScript };
