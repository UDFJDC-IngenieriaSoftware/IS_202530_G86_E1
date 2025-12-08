const express = require('express');
const router = express.Router();
const projectAreaController = require('../controllers/projectAreaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const validateProjectArea = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('projectEmail').notEmpty().withMessage('El email es obligatorio').isEmail().withMessage('El email debe tener un formato válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

// Rutas públicas (solo lectura)
router.get('/', projectAreaController.getAllProjectAreas);
router.get('/:id', projectAreaController.getProjectAreaById);

// Rutas protegidas (solo administradores)
router.post('/', authenticateToken, authorizeRoles('ADMINISTRADOR'), validateProjectArea, projectAreaController.createProjectArea);
router.put('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), validateProjectArea, projectAreaController.updateProjectArea);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), projectAreaController.deleteProjectArea);
router.get('/:id/users', authenticateToken, authorizeRoles('ADMINISTRADOR'), projectAreaController.getUsersByProjectArea);

module.exports = router;

