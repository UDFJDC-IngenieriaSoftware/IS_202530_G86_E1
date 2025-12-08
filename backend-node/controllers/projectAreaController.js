const projectAreaService = require('../services/projectAreaService');

const getAllProjectAreas = async (req, res) => {
  try {
    const projectAreas = await projectAreaService.getAllProjectAreas();
    res.json(projectAreas);
  } catch (error) {
    console.error('Error getting project areas:', error);
    res.status(500).json({ message: 'Error al obtener proyectos curriculares' });
  }
};

const getProjectAreaById = async (req, res) => {
  try {
    const proyectAreaId = parseInt(req.params.id);
    const projectArea = await projectAreaService.getProjectAreaById(proyectAreaId);
    res.json(projectArea);
  } catch (error) {
    console.error('Error getting project area:', error);
    res.status(404).json({ message: error.message || 'Proyecto curricular no encontrado' });
  }
};

const createProjectArea = async (req, res) => {
  try {
    const projectArea = await projectAreaService.createProjectArea(req.body);
    res.status(201).json(projectArea);
  } catch (error) {
    console.error('Error creating project area:', error);
    res.status(400).json({ message: error.message || 'Error al crear proyecto curricular' });
  }
};

const updateProjectArea = async (req, res) => {
  try {
    const proyectAreaId = parseInt(req.params.id);
    const projectArea = await projectAreaService.updateProjectArea(proyectAreaId, req.body);
    res.json(projectArea);
  } catch (error) {
    console.error('Error updating project area:', error);
    res.status(400).json({ message: error.message || 'Error al actualizar proyecto curricular' });
  }
};

const deleteProjectArea = async (req, res) => {
  try {
    const proyectAreaId = parseInt(req.params.id);
    await projectAreaService.deleteProjectArea(proyectAreaId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project area:', error);
    res.status(400).json({ message: error.message || 'Error al eliminar proyecto curricular' });
  }
};

const getUsersByProjectArea = async (req, res) => {
  try {
    const proyectAreaId = parseInt(req.params.id);
    const users = await projectAreaService.getUsersByProjectArea(proyectAreaId);
    res.json(users);
  } catch (error) {
    console.error('Error getting users by project area:', error);
    res.status(500).json({ message: 'Error al obtener usuarios del proyecto curricular' });
  }
};

module.exports = {
  getAllProjectAreas,
  getProjectAreaById,
  createProjectArea,
  updateProjectArea,
  deleteProjectArea,
  getUsersByProjectArea,
};

