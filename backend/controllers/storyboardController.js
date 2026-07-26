'use strict';

const { generateStoryboard } = require('../services/storyboardService');

async function createStoryboard(req, res) {
  try {
    const { script, creativeBrief } = req.body;
    const result = await generateStoryboard(script, creativeBrief);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createStoryboard };
