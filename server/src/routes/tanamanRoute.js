// src/routes/tanamanRoutes.js

const upload = require('../middleware/uploadMulter.js');
const express = require('express');
const tanamanController = require('../controllers/tanamanController.js');
const router = express.Router();

// Mendapatkan semua tanaman
router.get('/', tanamanController.getAllTanaman);

// Mendapatkan tanaman berdasarkan id
router.get('/:id', tanamanController.getTanamanById);

// Menambahkan tanaman baru
router.post('/', upload.single('file'), tanamanController.createTanaman);

// Mengupdate tanaman berdasarkan id
router.put('/:id', tanamanController.updateTanaman);

// Menghapus tanaman berdasarkan id
router.delete('/:id', tanamanController.deleteTanaman);

module.exports = router;
