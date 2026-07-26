'use strict';

const { generateScript } = require('../services/scriptService');

async function createScript(req, res) {
  try {
    const { creativeBrief } = req.body;
    const result = await generateScript(creativeBrief);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { createScript };
