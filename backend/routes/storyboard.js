'use strict';

const express = require('express');
const router = express.Router();
const { createStoryboard } = require('../controllers/storyboardController');

router.post('/', createStoryboard);

module.exports = router;
