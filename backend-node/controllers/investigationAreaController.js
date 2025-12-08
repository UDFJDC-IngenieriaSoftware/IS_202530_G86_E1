const investigationAreaService = require('../services/investigationAreaService');

const getAllInvestigationAreas = async (req, res) => {
  try {
    const investigationAreas = await investigationAreaService.getAllInvestigationAreas();
    res.json(investigationAreas);
  } catch (error) {
    console.error('Error getting investigation areas:', error);
    res.status(500).json({ message: 'Error al obtener áreas de investigación' });
  }
};

const getInvestigationAreasByProjectArea = async (req, res) => {
  try {
    const projectAreaId = parseInt(req.params.projectAreaId);
    const investigationAreas = await investigationAreaService.getInvestigationAreasByProjectArea(projectAreaId);
    res.json(investigationAreas);
  } catch (error) {
    console.error('Error getting investigation areas by project area:', error);
    res.status(500).json({ message: 'Error al obtener áreas de investigación' });
  }
};

const getInvestigationAreaById = async (req, res) => {
  try {
    const investigationAreaId = parseInt(req.params.id);
    const investigationArea = await investigationAreaService.getInvestigationAreaById(investigationAreaId);
    res.json(investigationArea);
  } catch (error) {
    console.error('Error getting investigation area:', error);
    res.status(404).json({ message: error.message || 'Área de investigación no encontrada' });
  }
};

const createInvestigationArea = async (req, res) => {
  try {
    const investigationArea = await investigationAreaService.createInvestigationArea(req.body);
    res.status(201).json(investigationArea);
  } catch (error) {
    console.error('Error creating investigation area:', error);
    res.status(400).json({ message: error.message || 'Error al crear área de investigación' });
  }
};

const updateInvestigationArea = async (req, res) => {
  try {
    const investigationAreaId = parseInt(req.params.id);
    const investigationArea = await investigationAreaService.updateInvestigationArea(investigationAreaId, req.body);
    res.json(investigationArea);
  } catch (error) {
    console.error('Error updating investigation area:', error);
    res.status(400).json({ message: error.message || 'Error al actualizar área de investigación' });
  }
};

const deleteInvestigationArea = async (req, res) => {
  try {
    const investigationAreaId = parseInt(req.params.id);
    await investigationAreaService.deleteInvestigationArea(investigationAreaId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting investigation area:', error);
    res.status(400).json({ message: error.message || 'Error al eliminar área de investigación' });
  }
};

module.exports = {
  getAllInvestigationAreas,
  getInvestigationAreasByProjectArea,
  getInvestigationAreaById,
  createInvestigationArea,
  updateInvestigationArea,
  deleteInvestigationArea,
};

