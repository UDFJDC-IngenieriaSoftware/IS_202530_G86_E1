const userService = require('../services/userService');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error getting users:', error);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.getUserById(userId);
    res.json(user);
  } catch (error) {
    console.error('Error getting user:', error);
    res.status(404).json({ message: error.message || 'Usuario no encontrado' });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await userService.getUserByEmail(req.user.email);
    res.json(user);
  } catch (error) {
    console.error('Error getting current user:', error);
    res.status(404).json({ message: error.message || 'Usuario no encontrado' });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.updateUser(userId, req.body);
    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(404).json({ message: error.message || 'Error al actualizar usuario' });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await userService.deleteUser(userId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(404).json({ message: error.message || 'Error al eliminar usuario' });
  }
};

const createUser = async (req, res) => {
  try {
    const { validationResult } = require('express-validator');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: errors.array()[0].msg
      });
    }

    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: error.message || 'Error al crear usuario' });
  }
};

const getUserWithCoordinatorInfo = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await userService.getUserWithCoordinatorInfo(userId);
    res.json(user);
  } catch (error) {
    console.error('Error getting user with coordinator info:', error);
    res.status(404).json({ message: error.message || 'Usuario no encontrado' });
  }
};

const updateCoordinatorTeams = async (req, res) => {
  try {
    const coordinatorId = parseInt(req.params.coordinatorId);
    const { teamId } = req.body;
    
    if (!teamId) {
      return res.status(400).json({ message: 'Un coordinador debe tener un grupo asignado' });
    }
    
    await userService.updateCoordinatorTeams(coordinatorId, teamId);
    res.json({ message: 'Grupo actualizado exitosamente' });
  } catch (error) {
    console.error('Error updating coordinator teams:', error);
    res.status(400).json({ message: error.message || 'Error al actualizar grupo' });
  }
};

const getTeamsWithoutCoordinator = async (req, res) => {
  try {
    const currentCoordinatorId = req.query.coordinatorId ? parseInt(req.query.coordinatorId) : null;
    const teams = await userService.getTeamsWithoutCoordinator(currentCoordinatorId);
    res.json(teams);
  } catch (error) {
    console.error('Error getting teams without coordinator:', error);
    res.status(500).json({ message: error.message || 'Error al obtener grupos' });
  }
};

const getAllCoordinators = async (req, res) => {
  try {
    const excludeTeamId = req.query.excludeTeamId ? parseInt(req.query.excludeTeamId) : null;
    const coordinators = await userService.getAllCoordinators(excludeTeamId);
    res.json(coordinators);
  } catch (error) {
    console.error('Error getting coordinators:', error);
    res.status(500).json({ message: error.message || 'Error al obtener coordinadores' });
  }
};

const getAvailableTeachers = async (req, res) => {
  try {
    const excludeTeamId = req.query.excludeTeamId ? parseInt(req.query.excludeTeamId) : null;
    const teachers = await userService.getAvailableTeachers(excludeTeamId);
    res.json(teachers);
  } catch (error) {
    console.error('Error getting available teachers:', error);
    res.status(500).json({ message: error.message || 'Error al obtener docentes disponibles' });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
  createUser,
  getUserWithCoordinatorInfo,
  updateCoordinatorTeams,
  getTeamsWithoutCoordinator,
  getAllCoordinators,
  getAvailableTeachers,
};

