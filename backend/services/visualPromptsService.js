'use strict';

const { client, useMock, modelId, projectId } = require('../config/watsonx');
const { buildVisualPromptsPrompt } = require('../prompts/visualPromptsPrompt');
const { stripMarkdownFences } = require('./refineService');

const MOCK_VISUAL_PROMPTS = {
  prompts: [
    {
      scene: 1,
      prompt: 'Split-screen composition, left side: frustrated young developer staring at blank VS Code editor with blinking cursor, right side: same developer 30 days later confidently typing with a finished web app on screen, dramatic cinematic lighting with cool blue tones on left and warm amber tones on right, shallow depth of field, photorealistic, editorial photography style --ar 16:9 --q 2',
    },
    {
      scene: 2,
      prompt: 'Fast-motion montage frame, laptop screen displaying a colorful JavaScript to-do app with glowing UI components, developer hands visible on keyboard, overhead desk shot, soft studio lighting with subtle purple accent glow, day counter overlay graphic "Day 30" in bold sans-serif white text, modern tech aesthetic, photorealistic --ar 16:9 --q 2',
    },
    {
      scene: 3,
      prompt: 'Young developer leaning back in ergonomic chair, genuine smile of accomplishment, laptop showing finished portfolio app, clean minimal home office with warm window light, shallow depth of field with bokeh background, cinematic color grade with golden tones, call-to-action card overlay with purple gradient border fading in at bottom of frame, photorealistic portrait --ar 16:9 --q 2',
    },
  ],
};

/**
 * Generates Midjourney/DALL·E-ready image prompts for each storyboard scene.
 *
 * @param {Object[]} scenes   - The storyboard scenes from generateStoryboard
 * @param {string}   platform - The target platform (TikTok, YouTube, LinkedIn)
 * @param {Object}   brief    - The creative brief (for tone and title)
 * @returns {Promise<{ prompts: Array<{ scene: number, prompt: string }> }>}
 */
async function generateVisualPrompts(scenes, platform, brief) {
  if (useMock) {
    return MOCK_VISUAL_PROMPTS;
  }

  const { systemPrompt, userPrompt } = buildVisualPromptsPrompt({
    scenes,
    platform,
    tone: brief.tone,
    title: brief.title,
  });

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

module.exports = { generateVisualPrompts };
