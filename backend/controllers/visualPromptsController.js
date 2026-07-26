'use strict';

const { generateVisualPrompts } = require('../services/visualPromptsService');

async function createVisualPrompts(req, res) {
  try {
    const { scenes, platform, brief } = req.body;
    const result = await generateVisualPrompts(scenes, platform, brief);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createVisualPrompts };
