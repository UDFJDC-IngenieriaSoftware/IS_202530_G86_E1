const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Rutas públicas (sin autenticación)
router.get('/public', teamController.getAllTeams);
router.get('/public/area/:areaId', teamController.getTeamsByArea);
router.get('/public/:id', teamController.getTeamById);

// Rutas protegidas (requieren autenticación)
router.get('/my-teams', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), teamController.getMyTeams);

router.post('/', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), teamController.createTeam);
router.put('/:id', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), teamController.updateTeam);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), teamController.deleteTeam);

module.exports = router;

