const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/me', authenticateToken, userController.getCurrentUser);
router.get('/', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.getAllUsers);
router.get('/:id', authenticateToken, userController.getUserById);
router.put('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.deleteUser);

module.exports = router;

