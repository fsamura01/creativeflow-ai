/**
 * Builds the system and user prompts for the Refine step.
 * Used when the user wants to improve a specific section with a plain-English instruction.
 *
 * @param {Object} params
 * @param {string} params.section      - Which section is being refined (e.g. "script", "creative brief")
 * @param {Object} params.current      - The current content of that section (the full object)
 * @param {string} params.instruction  - The user's plain-English refinement instruction
 * @param {Object} [params.context]    - Optional surrounding context (e.g. brief when refining script)
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildRefinePrompt({ section, current, instruction, context }) {
  const systemPrompt = `You are a professional creative director helping a content creator refine their work. \
You receive an existing piece of creative content and a specific instruction from the creator. \
You apply the instruction to improve the content while preserving everything that is already working well. \
You make targeted, precise changes — you do not rewrite from scratch unless explicitly asked. \
You always respond with the same JSON structure as the input content.`;

  const contextBlock = context
    ? `\n--- CONTEXT ---\n${JSON.stringify(context, null, 2)}\n`
    : '';

  const userPrompt = `Refine the following ${section} based on the creator's instruction.

--- CURRENT ${section.toUpperCase()} ---
${JSON.stringify(current, null, 2)}
${contextBlock}
--- CREATOR'S INSTRUCTION ---
${instruction}

Apply the instruction to improve the ${section}. Keep everything that is working well. \
Return the refined ${section} as a JSON object with exactly the same structure and field names as the current version.

Respond with ONLY valid JSON. Do not include markdown code fences, explanations, or any text outside the JSON object.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildRefinePrompt };
