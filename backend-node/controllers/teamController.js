const teamService = require('../services/teamService');

const getAllTeams = async (req, res) => {
  try {
    const teams = await teamService.getAllTeams();
    res.json(teams);
  } catch (error) {
    console.error('Error getting teams:', error);
    res.status(500).json({ message: 'Error al obtener equipos' });
  }
};

const getTeamById = async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const team = await teamService.getTeamById(teamId);
    res.json(team);
  } catch (error) {
    console.error('Error getting team:', error);
    res.status(404).json({ message: error.message || 'Equipo no encontrado' });
  }
};

const getTeamsByArea = async (req, res) => {
  try {
    const areaId = parseInt(req.params.areaId);
    const teams = await teamService.getTeamsByArea(areaId);
    res.json(teams);
  } catch (error) {
    console.error('Error getting teams by area:', error);
    res.status(500).json({ message: 'Error al obtener equipos' });
  }
};

const createTeam = async (req, res) => {
  try {
    const team = await teamService.createTeam(req.body);
    res.status(201).json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    res.status(400).json({ message: error.message || 'Error al crear equipo' });
  }
};

const updateTeam = async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    const team = await teamService.updateTeam(teamId, req.body);
    res.json(team);
  } catch (error) {
    console.error('Error updating team:', error);
    res.status(404).json({ message: error.message || 'Error al actualizar equipo' });
  }
};

const deleteTeam = async (req, res) => {
  try {
    const teamId = parseInt(req.params.id);
    await teamService.deleteTeam(teamId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting team:', error);
    res.status(404).json({ message: error.message || 'Error al eliminar equipo' });
  }
};

module.exports = {
  getAllTeams,
  getTeamById,
  getTeamsByArea,
  createTeam,
  updateTeam,
  deleteTeam,
};

