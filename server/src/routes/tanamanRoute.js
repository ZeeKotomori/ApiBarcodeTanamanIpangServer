const express = require('express');
const upload = require('../middleware/uploadMulter.js');
const tanamanController = require('../controllers/tanamanController.js');

const router = express.Router();

router.get('/', tanamanController.getAllTanaman);
router.get('/:id', tanamanController.getTanamanById);
router.post('/', upload.single('file'), tanamanController.createTanaman);
router.put('/:id', upload.single('file'), tanamanController.updateTanaman);
router.delete('/:id', tanamanController.deleteTanaman);

module.exports = router;