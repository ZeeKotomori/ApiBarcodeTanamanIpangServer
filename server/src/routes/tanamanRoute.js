const express = require('express');
const  upload  = require('../middleware/uploadMulter.js');
const tanamanController = require('../controllers/tanamanController.js');

const router = express.Router();

const handleUpload = (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(400).send({ message: err.message });
        }
        next();
    });
};

router.get('/', tanamanController.getAllTanaman);
router.get('/:id', tanamanController.getTanamanById);
router.post('/', handleUpload, tanamanController.createTanaman);
router.put('/:id', handleUpload, tanamanController.updateTanaman);
router.delete('/:id', tanamanController.deleteTanaman);
router.delete('/', tanamanController.deleteMultipleTanaman);

module.exports = router;