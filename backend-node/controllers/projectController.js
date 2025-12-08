const projectService = require('../services/projectService');

const getAllProjects = async (req, res) => {
  try {
    const projects = await projectService.getAllProjects();
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
};

const getProjectById = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const project = await projectService.getProjectById(projectId);
    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(404).json({ message: error.message || 'Proyecto no encontrado' });
  }
};

const getProjectsByTeam = async (req, res) => {
  try {
    const teamId = parseInt(req.params.teamId);
    const projects = await projectService.getProjectsByTeam(teamId);
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects by team:', error);
    res.status(500).json({ message: 'Error al obtener proyectos' });
  }
};

const createProject = async (req, res) => {
  try {
    const userId = req.user.userId;
    const project = await projectService.createProject(req.body, userId);
    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({ message: error.message || 'Error al crear proyecto' });
  }
};

const updateProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user.userId;
    const project = await projectService.updateProject(projectId, req.body, userId);
    res.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(404).json({ message: error.message || 'Error al actualizar proyecto' });
  }
};

const deleteProject = async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const userId = req.user.userId;
    await projectService.deleteProject(projectId, userId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(404).json({ message: error.message || 'Error al eliminar proyecto' });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectsByTeam,
  createProject,
  updateProject,
  deleteProject,
};

