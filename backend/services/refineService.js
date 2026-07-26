'use strict';

const { client, useMock, modelId, projectId } = require('../config/watsonx');
const { buildRefinePrompt } = require('../prompts/refinePrompt');

/**
 * Strips ```json ... ``` or ``` ... ``` markdown fences if present.
 * @param {string} text
 * @returns {string}
 */
function stripMarkdownFences(text) {
  return text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim();
}

/**
 * Refines an existing section of content based on a plain-English instruction.
 *
 * @param {string} section     - Label for the section being refined (e.g. "script")
 * @param {Object} current     - The current content object for that section
 * @param {string} instruction - The user's refinement instruction
 * @param {Object} [context]   - Optional surrounding context
 * @returns {Promise<Object>}  - Refined content object with the same shape as `current`
 */
async function refineSection(section, current, instruction, context) {
  if (useMock) {
    // In mock mode return the current content unchanged so the UI still responds
    return current;
  }

  const { systemPrompt, userPrompt } = buildRefinePrompt({ section, current, instruction, context });

  const response = await client.textChat({
    modelId,
    projectId,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    maxTokens: 1024,
  });

  const raw = response.result.choices[0].message.content;
  const text = stripMarkdownFences(raw);

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('AI returned invalid JSON: ' + text);
  }
}

module.exports = { refineSection, stripMarkdownFences };
