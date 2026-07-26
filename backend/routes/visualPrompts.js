'use strict';

const express = require('express');
const router = express.Router();
const { createVisualPrompts } = require('../controllers/visualPromptsController');

router.post('/', createVisualPrompts);

module.exports = router;
