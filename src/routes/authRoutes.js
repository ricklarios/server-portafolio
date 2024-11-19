const express = require('express');
const axios = require('axios');
const { exchangeAuthorizationCode } = require('../controllers/authController');
const router = express.Router();

router.post('/exchange-token', exchangeAuthorizationCode);

module.exports = router;