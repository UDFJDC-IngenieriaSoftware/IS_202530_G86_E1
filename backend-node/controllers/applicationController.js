const applicationService = require('../services/applicationService');

const createApplication = async (req, res) => {
  try {
    const application = await applicationService.createApplication(req.body, req.user.email);
    res.status(201).json(application);
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(400).json({ message: error.message || 'Error al crear aplicación' });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await applicationService.getApplicationsByUser(req.user.email);
    res.json(applications);
  } catch (error) {
    console.error('Error getting applications:', error);
    res.status(500).json({ message: 'Error al obtener aplicaciones' });
  }
};

const getApplicationsByTeam = async (req, res) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const applications = await applicationService.getApplicationsByTeam(teamId);
    res.json(applications);
  } catch (error) {
    console.error('Error getting applications by team:', error);
    res.status(500).json({ message: 'Error al obtener aplicaciones' });
  }
};

const getMyApplicationByTeam = async (req, res) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const application = await applicationService.getApplicationByUserAndTeam(req.user.email, teamId);
    if (application) {
      res.json(application);
    } else {
      // Devolver null en lugar de 404 para que el frontend pueda manejarlo
      res.status(200).json(null);
    }
  } catch (error) {
    console.error('Error getting application by team:', error);
    res.status(500).json({ message: 'Error al obtener aplicación' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = parseInt(req.params.id);
    const { state, answerMessage } = req.body;
    const application = await applicationService.updateApplicationStatus(applicationId, state, answerMessage);
    res.json(application);
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(404).json({ message: error.message || 'Error al actualizar aplicación' });
  }
};

module.exports = {
  createApplication,
  getMyApplications,
  getApplicationsByTeam,
  getMyApplicationByTeam,
  updateApplicationStatus,
};

