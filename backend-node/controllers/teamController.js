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

const getMyTeams = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log('getMyTeams - userId:', userId);
    console.log('getMyTeams - req.user:', req.user);
    const teams = await teamService.getTeamsByCoordinator(userId);
    console.log('getMyTeams - teams found:', teams.length);
    res.json(teams);
  } catch (error) {
    console.error('Error getting my teams:', error);
    res.status(500).json({ message: 'Error al obtener mis equipos' });
  }
};

const createTeam = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;
    const { coordinatorId, teacherId } = req.body;

    // Si es coordinador, asignarse automáticamente como coordinador
    if (userRole === 'COORDINADOR') {
      // Obtener el coordinatorId del usuario actual
      const userCoordinator = await teamService.getCoordinatorIdByUserId(userId);
      if (!userCoordinator) {
        return res.status(400).json({ message: 'El usuario no es un coordinador válido' });
      }
      req.body.coordinatorId = userCoordinator;
    } else if (userRole === 'ADMINISTRADOR') {
      // Los administradores deben proporcionar un docente (teacherId) o coordinador existente
      if (!teacherId && !coordinatorId) {
        return res.status(400).json({ message: 'Debe seleccionar un docente coordinador para el grupo' });
      }
    }

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
    const userId = req.user.userId;
    const userRole = req.user.role;
    
    console.log('updateTeam - teamId:', teamId);
    console.log('updateTeam - userId:', userId);
    console.log('updateTeam - userRole:', userRole);
    console.log('updateTeam - req.body:', req.body);
    
    // Validar que los campos requeridos estén presentes
    const { name, teamEmail, description, areaId } = req.body;
    if (!name || !teamEmail || !description || !areaId) {
      return res.status(400).json({ 
        message: 'Faltan campos requeridos: name, teamEmail, description, areaId' 
      });
    }
    
    // Preparar los datos del equipo
    const teamData = {
      name: name.trim(),
      teamEmail: teamEmail.trim(),
      description: description.trim(),
      areaId: parseInt(areaId, 10),
      teacherId: req.body.teacherId ? parseInt(req.body.teacherId, 10) : undefined,
      coordinatorId: req.body.coordinatorId ? parseInt(req.body.coordinatorId, 10) : undefined
    };
    
    // Validar que areaId sea un número válido
    if (isNaN(teamData.areaId)) {
      return res.status(400).json({ message: 'El área de investigación debe ser un número válido' });
    }
    
    // Si es coordinador, verificar que el equipo le pertenece
    if (userRole === 'COORDINADOR') {
      const isOwner = await teamService.isTeamOwnedByCoordinator(teamId, userId);
      if (!isOwner) {
        return res.status(403).json({ message: 'No tienes permiso para editar este equipo' });
      }
      // Los coordinadores no pueden cambiar el coordinator_id
      console.log('updateTeam - Updating as coordinator, preserveCoordinator=true');
      const team = await teamService.updateTeam(teamId, teamData, true);
      res.json(team);
    } else {
      // Administradores pueden cambiar todo, incluyendo el coordinador
      // Si no se proporciona coordinatorId, mantener el actual
      const coordinatorId = req.body.coordinatorId ? parseInt(req.body.coordinatorId, 10) : undefined;
      const adminTeamData = { ...teamData };
      if (coordinatorId && !isNaN(coordinatorId)) {
        adminTeamData.coordinatorId = coordinatorId;
      }
      console.log('updateTeam - Updating as admin, preserveCoordinator=false');
      const team = await teamService.updateTeam(teamId, adminTeamData, false);
      res.json(team);
    }
  } catch (error) {
    console.error('Error updating team:', error);
    console.error('Error stack:', error.stack);
    res.status(400).json({ message: error.message || 'Error al actualizar equipo' });
  }
};

const getMyTeamsAsStudent = async (req, res) => {
  try {
    const userId = req.user.userId;
    const teams = await teamService.getTeamsByStudent(userId);
    res.json(teams);
  } catch (error) {
    console.error('Error getting my teams as student:', error);
    res.status(500).json({ message: 'Error al obtener mis grupos' });
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
  getMyTeams,
  getMyTeamsAsStudent,
  createTeam,
  updateTeam,
  deleteTeam,
};

