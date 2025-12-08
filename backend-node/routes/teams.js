const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/public', teamController.getAllTeams);
router.get('/public/:id', teamController.getTeamById);
router.get('/public/area/:areaId', teamController.getTeamsByArea);

router.post('/', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), teamController.createTeam);
router.put('/:id', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), teamController.updateTeam);
router.delete('/:id', authenticateToken, authorizeRoles('ADMINISTRADOR'), teamController.deleteTeam);

module.exports = router;

