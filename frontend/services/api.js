const BASE_URL = import.meta.env.VITE_API_URL || '';

async function post(endpoint, body) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const err = await response
      .json()
      .catch(() => ({ error: response.statusText }));
    throw new Error(err.error || `Request failed: ${response.status}`);
  }
  return response.json();
}

export async function generateCreativeBrief({
  topic,
  audience,
  platform,
  goal,
}) {
  return post("/creative-brief", { topic, audience, platform, goal });
}

export async function generateScript({ creativeBrief }) {
  return post("/generate-script", { creativeBrief });
}

export async function generateStoryboard({ script, creativeBrief }) {
  return post("/generate-storyboard", { script, creativeBrief });
}

export async function reviewWithMentor({ creativeBrief, script, storyboard }) {
  return post("/mentor-review", { creativeBrief, script, storyboard });
}

export async function refineSection({
  section,
  current,
  instruction,
  context,
}) {
  return post("/refine", { section, current, instruction, context });
}

export async function generateVisualPrompts({ scenes, platform, brief }) {
  return post("/visual-prompts", { scenes, platform, brief });
}
