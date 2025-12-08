const express = require('express');
const router = express.Router();
const investigationAreaController = require('../controllers/investigationAreaController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const validateInvestigationArea = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  body('projectAreaId').notEmpty().withMessage('El proyecto curricular es obligatorio').isInt().withMessage('El proyecto curricular debe ser un número válido'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

// Rutas públicas (solo lectura)
router.get('/', investigationAreaController.getAllInvestigationAreas);
router.get('/project-area/:projectAreaId', investigationAreaController.getInvestigationAreasByProjectArea);
router.get('/:id', investigationAreaController.getInvestigationAreaById);

// Rutas protegidas (solo administradores)
router.post('/', authenticateToken, authorizeRoles('ADMINISTRADOR'), validateInvestigationArea, investigationAreaController.createInvestigationArea);
router.put('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), validateInvestigationArea, investigationAreaController.updateInvestigationArea);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), investigationAreaController.deleteInvestigationArea);

module.exports = router;

