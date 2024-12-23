// src/routes/tanamanRoutes.js

const express = require('express');
const qrController = require('../controllers/qrController.js');
const router = express.Router();

router.get('/:qrTanaman', qrController.qrTanaman);

module.exports = router;