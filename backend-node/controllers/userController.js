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

module.exports = {
  getAllUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  deleteUser,
};

