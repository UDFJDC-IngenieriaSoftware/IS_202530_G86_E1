const express = require('express');
const router = express.Router();
const productTypeController = require('../controllers/productTypeController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

const validateProductType = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('description').notEmpty().withMessage('La descripción es obligatoria'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

// Rutas públicas (solo lectura)
router.get('/', productTypeController.getAllProductTypes);
router.get('/:id', productTypeController.getProductTypeById);

// Rutas protegidas (solo administradores)
router.post('/', authenticateToken, authorizeRoles('ADMINISTRADOR'), validateProductType, productTypeController.createProductType);
router.put('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), validateProductType, productTypeController.updateProductType);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), productTypeController.deleteProductType);

module.exports = router;

