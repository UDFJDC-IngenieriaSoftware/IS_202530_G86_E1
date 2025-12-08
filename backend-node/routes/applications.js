const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

router.post('/', authenticateToken, authorizeRoles('ESTUDIANTE', 'DOCENTE'), applicationController.createApplication);
router.get('/my-applications', authenticateToken, authorizeRoles('ESTUDIANTE', 'DOCENTE'), applicationController.getMyApplications);
router.get('/my-application/team/:teamId', authenticateToken, authorizeRoles('ESTUDIANTE', 'DOCENTE'), applicationController.getMyApplicationByTeam);
router.get('/team/:teamId', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), applicationController.getApplicationsByTeam);
router.put('/:id/status', authenticateToken, authorizeRoles('COORDINADOR', 'ADMINISTRADOR'), applicationController.updateApplicationStatus);

module.exports = router;

