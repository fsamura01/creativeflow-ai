'use strict';

const express = require('express');
const router = express.Router();
const { createScript } = require('../controllers/scriptController');

router.post('/', createScript);

module.exports = router;
