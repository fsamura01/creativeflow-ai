'use strict';

const express = require('express');
const router = express.Router();
const { createCreativeBrief } = require('../controllers/creativeBriefController');

router.post('/', createCreativeBrief);

module.exports = router;
