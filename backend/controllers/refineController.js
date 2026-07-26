'use strict';

const { refineSection } = require('../services/refineService');

async function refine(req, res) {
  try {
    const { section, current, instruction, context } = req.body;
    if (!section || !current || !instruction) {
      return res.status(400).json({ error: 'section, current, and instruction are required.' });
    }
    const result = await refineSection(section, current, instruction, context);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { refine };
