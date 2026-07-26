/**
 * Builds the system and user prompts for the Creative Brief generation step.
 *
 * @param {Object} params
 * @param {string} params.topic    - The subject or product the content is about
 * @param {string} params.audience - The intended target audience
 * @param {string} params.platform - The publishing platform (e.g. TikTok, Instagram, YouTube)
 * @param {string} params.goal     - The desired outcome or objective
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildCreativeBriefPrompt({ topic, audience, platform, goal }) {
  const systemPrompt = `You are an experienced content strategist who specialises in creating concise, \
actionable creative briefs for social media and digital campaigns. You understand platform dynamics, \
audience psychology, and what makes content resonate. You always respond with structured, \
professional output tailored to the client's specific context.`;

  const userPrompt = `Create a creative brief for the following content project:

- Topic: ${topic}
- Target Audience: ${audience}
- Platform: ${platform}
- Goal: ${goal}

Return a JSON object with exactly these five fields:
{
  "title": "A compelling campaign or content title",
  "coreMessage": "The single most important message this content must convey",
  "hookIdea": "A specific, attention-grabbing opening hook idea suited to ${platform}",
  "tone": "The tone and voice this content should use (e.g. energetic, empathetic, witty)",
  "keyTakeaway": "What the audience should remember or feel after consuming the content"
}

Respond with ONLY valid JSON. Do not include markdown code fences, explanations, or any text outside the JSON object.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildCreativeBriefPrompt };
