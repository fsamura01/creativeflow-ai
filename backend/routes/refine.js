'use strict';

const express = require('express');
const router = express.Router();
const { refine } = require('../controllers/refineController');

router.post('/', refine);

module.exports = router;
