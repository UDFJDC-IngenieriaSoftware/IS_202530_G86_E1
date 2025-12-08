const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.get('/public', projectController.getAllProjects);
router.get('/public/:id', projectController.getProjectById);
router.get('/public/team/:teamId', projectController.getProjectsByTeam);

router.post('/', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), projectController.createProject);
router.put('/:id', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), projectController.updateProject);
router.delete('/:id', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), projectController.deleteProject);

module.exports = router;

