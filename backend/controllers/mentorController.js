'use strict';

const { reviewCreativePackage } = require('../services/mentorService');

async function reviewPackage(req, res) {
  try {
    const { creativeBrief, script, storyboard } = req.body;
    const result = await reviewCreativePackage(creativeBrief, script, storyboard);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { reviewPackage };
