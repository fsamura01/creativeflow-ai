'use strict';

const { client, useMock, modelId, projectId } = require('../config/watsonx');
const { buildCreativeBriefPrompt } = require('../prompts/creativeBriefPrompt');
const { stripMarkdownFences } = require('./refineService');

const MOCK_BRIEF = {
  title: 'From Zero to JavaScript Hero in 30 Days',
  coreMessage: 'Anyone can learn JavaScript in a month with the right daily practice plan — no prior coding experience needed.',
  hookIdea: 'Open with a split-screen: left side shows a confused beginner staring at a blank screen; right side shows the same person 30 days later confidently shipping a working app.',
  tone: 'Encouraging and motivational, with a practical no-nonsense edge — like a knowledgeable friend who has done it before.',
  keyTakeaway: 'JavaScript is learnable in 30 days if you commit to 45 minutes a day and follow a structured project-based curriculum.',
};

/**
 * Generates a creative brief for a content project.
 *
 * @param {string} topic    - Subject or product the content is about
 * @param {string} audience - Intended target audience
 * @param {string} platform - Publishing platform (e.g. TikTok, YouTube)
 * @param {string} goal     - Desired outcome or objective
 * @returns {Promise<{ title: string, coreMessage: string, hookIdea: string, tone: string, keyTakeaway: string }>}
 */
async function generateCreativeBrief(topic, audience, platform, goal) {
  if (useMock) {
    return MOCK_BRIEF;
  }

  const { systemPrompt, userPrompt } = buildCreativeBriefPrompt({ topic, audience, platform, goal });

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

module.exports = { generateCreativeBrief };
