/**
 * Builds the system and user prompts for the Visual Prompts generation step.
 * Produces Midjourney/DALL·E/ChatGPT-ready image generation prompts for each storyboard scene.
 *
 * @param {Object} params
 * @param {Object[]} params.scenes       - The storyboard scenes from the previous step
 * @param {string}  params.platform      - The target platform (TikTok, YouTube, LinkedIn)
 * @param {string}  params.tone          - The tone from the creative brief
 * @param {string}  params.title         - The campaign title from the creative brief
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildVisualPromptsPrompt({ scenes, platform, tone, title }) {
  const ASPECT_RATIOS = {
    TikTok: '9:16',
    YouTube: '16:9',
    LinkedIn: '1:1',
  };
  const ratio = ASPECT_RATIOS[platform] || '16:9';

  const sceneList = scenes
    .map((s, i) => `Scene ${i + 1}: ${s.visual}`)
    .join('\n');

  const systemPrompt = `You are an expert AI image prompt engineer. You transform storyboard scene descriptions \
into precise, evocative image generation prompts that produce professional results in Midjourney, DALL·E, \
and ChatGPT image generation. Your prompts are specific about subject, composition, lighting, color palette, \
style, and mood. You never use vague adjectives — every word earns its place. You always include aspect ratio \
and technical quality modifiers at the end of each prompt.`;

  const userPrompt = `Convert the following storyboard scenes into image generation prompts.

Campaign: ${title}
Tone: ${tone}
Platform: ${platform} (aspect ratio: ${ratio})

Storyboard Scenes:
${sceneList}

For each scene, write a single image generation prompt that a creator can paste directly into \
Midjourney, DALL·E, or ChatGPT to generate a matching visual. Each prompt must:
- Describe the subject, action, and setting with precision
- Specify lighting style (e.g. cinematic, soft natural, neon backlit)
- Specify a visual style (e.g. photorealistic, modern flat design, editorial photography)
- End with "--ar ${ratio} --q 2" (Midjourney style) for aspect ratio

Return a JSON object with exactly this structure:
{
  "prompts": [
    {
      "scene": 1,
      "prompt": "Full image generation prompt for scene 1 --ar ${ratio} --q 2"
    },
    {
      "scene": 2,
      "prompt": "Full image generation prompt for scene 2 --ar ${ratio} --q 2"
    },
    {
      "scene": 3,
      "prompt": "Full image generation prompt for scene 3 --ar ${ratio} --q 2"
    }
  ]
}

Respond with ONLY valid JSON. Do not include markdown code fences, explanations, or any text outside the JSON object.`;

  return { systemPrompt, userPrompt };
}

module.exports = { buildVisualPromptsPrompt };
