const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const validateCreateUser = [
  body('name').notEmpty().withMessage('El nombre es obligatorio'),
  body('email')
    .isEmail().withMessage('El email debe tener un formato válido')
    .matches(/@udistrital\.edu\.co$/).withMessage('El email debe ser del dominio @udistrital.edu.co'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('role').isIn(['DOCENTE']).withMessage('Solo se pueden crear docentes. Los coordinadores se asignan al asignar un grupo a un docente.'),
  body('projectAreaId').notEmpty().withMessage('El proyecto curricular es obligatorio'),
];

router.get('/me', authenticateToken, userController.getCurrentUser);
router.get('/', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.getAllUsers);
router.post('/', authenticateToken, authorizeRoles('ADMINISTRADOR'), validateCreateUser, userController.createUser);
router.get('/teams-without-coordinator', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.getTeamsWithoutCoordinator);
router.get('/coordinators', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.getAllCoordinators);
router.get('/available-teachers', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.getAvailableTeachers);
router.get('/:id', authenticateToken, userController.getUserById);
router.get('/:id/coordinator-info', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.getUserWithCoordinatorInfo);
router.put('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.updateUser);
router.put('/coordinator/:coordinatorId/teams', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.updateCoordinatorTeams);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), userController.deleteUser);

module.exports = router;

