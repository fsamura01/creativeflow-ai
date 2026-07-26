'use strict';

const { client, useMock, modelId, projectId } = require('../config/watsonx');
const { buildMentorPrompt } = require('../prompts/mentorPrompt');
const { stripMarkdownFences } = require('./refineService');

const MOCK_FEEDBACK = {
  overallScore: 8,
  strengths: [
    'The hook opens with a striking statistic ("90% quit within the first week") that immediately triggers curiosity and positions the viewer as someone who wants to be in the successful minority — exactly the right psychological lever for a beginner audience.',
    'The brief\'s core message and the script body are tightly aligned: both emphasise daily practice with tangible, named milestones (tip calculator → weather app → to-do list), which makes the 30-day promise feel credible rather than aspirational.',
    'The storyboard\'s Scene 2 fast-cut montage with on-screen day counters is a proven short-form video pattern that pairs well with the momentum-building narration and will perform strongly on YouTube and TikTok.',
  ],
  improvements: [
    'The call to action ("Click the link in the description") is functional but generic. Replacing it with something outcome-specific — e.g. "Download the free roadmap and build your first app by Friday" — would increase click-through by giving viewers a concrete, near-term win to aim for.',
    'Scene 1 of the storyboard describes a split-screen concept, but the brief\'s hook idea also calls for a split-screen, making the opening feel redundant rather than progressive. Consider differentiating Scene 1 visually — for example, a single confused beginner transitioning into confidence — to avoid repeating the same metaphor twice.',
    'The tone description ("encouraging with a no-nonsense edge") is well-defined in the brief but the script leans more motivational than no-nonsense. Two sentences of concrete proof — e.g. citing a real learner outcome or a specific project showcase — would reinforce the credibility edge the brief calls for.',
  ],
  nextSteps: [
    'Revise the call to action to include a specific outcome and timeframe (e.g. "Build your first app by Friday — free roadmap in the description") and A/B test it against the current version.',
    'Re-storyboard Scene 1 so it visually contrasts with Scene 2 rather than mirroring the same split-screen concept — consider a single-character journey arc that pays off in Scene 3.',
    'Add one concrete social proof element to the script body — a brief mention of a real learner result or a recognisable project milestone — to close the credibility gap between the motivational tone and the no-nonsense edge the brief specifies.',
  ],
};

/**
 * Reviews a complete creative package (brief + script + storyboard) and returns scored mentor feedback.
 *
 * @param {Object} creativeBrief - The brief produced by generateCreativeBrief
 * @param {Object} script        - The script produced by generateScript
 * @param {Object} storyboard    - The storyboard produced by generateStoryboard
 * @returns {Promise<{ overallScore: number, strengths: string[], improvements: string[], nextSteps: string[] }>}
 */
async function reviewCreativePackage(creativeBrief, script, storyboard) {
  if (useMock) {
    return MOCK_FEEDBACK;
  }

  const { systemPrompt, userPrompt } = buildMentorPrompt({ creativeBrief, script, storyboard });

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

module.exports = { reviewCreativePackage };
