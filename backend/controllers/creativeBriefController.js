'use strict';

const { generateCreativeBrief } = require('../services/creativeBriefService');

async function createCreativeBrief(req, res) {
  try {
    const { topic, audience, platform, goal } = req.body;
    const result = await generateCreativeBrief(topic, audience, platform, goal);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createCreativeBrief };
