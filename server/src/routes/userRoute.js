const express = require('express');
const userController = require('../controllers/userController.js');
const isAdmin = require('../middleware/isAdmin.js');
const authenticateToken = require('../middleware/authmiddleware.js');

const router = express.Router();

router.get('/', authenticateToken, isAdmin, userController.getAllUsers);
router.get('/:id', authenticateToken, isAdmin, userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', authenticateToken, isAdmin, userController.updateUser);
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);
router.put('/makeAsAdmin/:id', authenticateToken, isAdmin, userController.makeUserAsAdmin);

module.exports = router;