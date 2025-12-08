const pool = require('../config/database');
const teamService = require('./teamService');

const getAllProjects = async () => {
  const result = await pool.query(`
    SELECT 
      ip.investigation_project_id as "investigationProjectId",
      ip.title,
      ip.resume,
      ip.state,
      ip.team_id as "teamId",
      it.name as "teamName"
    FROM Investigation_project ip
    INNER JOIN Investigation_team it ON ip.team_id = it.investigation_team_id
    ORDER BY ip.investigation_project_id
  `);

  return result.rows;
};

const getProjectById = async (projectId) => {
  const result = await pool.query(`
    SELECT 
      ip.investigation_project_id as "investigationProjectId",
      ip.title,
      ip.resume,
      ip.state,
      ip.team_id as "teamId",
      it.name as "teamName"
    FROM Investigation_project ip
    INNER JOIN Investigation_team it ON ip.team_id = it.investigation_team_id
    WHERE ip.investigation_project_id = $1
  `, [projectId]);

  if (result.rows.length === 0) {
    throw new Error('Proyecto no encontrado');
  }

  return result.rows[0];
};

const getProjectsByTeam = async (teamId) => {
  const result = await pool.query(`
    SELECT 
      ip.investigation_project_id as "investigationProjectId",
      ip.title,
      ip.resume,
      ip.state,
      ip.team_id as "teamId",
      it.name as "teamName"
    FROM Investigation_project ip
    INNER JOIN Investigation_team it ON ip.team_id = it.investigation_team_id
    WHERE ip.team_id = $1
    ORDER BY ip.investigation_project_id
  `, [teamId]);

  return result.rows;
};

const createProject = async (projectData, userId) => {
  const { title, resume, state, teamId } = projectData;

  // Validar que el equipo pertenece al coordinador
  const isOwner = await teamService.isTeamOwnedByCoordinator(teamId, userId);
  if (!isOwner) {
    throw new Error('No tienes permiso para crear proyectos en este equipo');
  }

  const result = await pool.query(
    `INSERT INTO Investigation_project (team_id, title, resume, state)
     VALUES ($1, $2, $3, $4)
     RETURNING investigation_project_id, title, resume, state, team_id`,
    [teamId, title, resume, state]
  );

  return await getProjectById(result.rows[0].investigation_project_id);
};

const updateProject = async (projectId, projectData, userId) => {
  const { title, resume, state, teamId } = projectData;

  // Validar que el proyecto existe y pertenece al coordinador
  const existingProject = await getProjectById(projectId);
  const isOwner = await teamService.isTeamOwnedByCoordinator(existingProject.teamId, userId);
  if (!isOwner) {
    throw new Error('No tienes permiso para editar este proyecto');
  }

  // Si se cambia el equipo, validar que el nuevo equipo también pertenece al coordinador
  if (teamId !== existingProject.teamId) {
    const isNewTeamOwner = await teamService.isTeamOwnedByCoordinator(teamId, userId);
    if (!isNewTeamOwner) {
      throw new Error('No tienes permiso para mover el proyecto a este equipo');
    }
  }

  const result = await pool.query(
    `UPDATE Investigation_project 
     SET title = $1, resume = $2, state = $3, team_id = $4
     WHERE investigation_project_id = $5
     RETURNING investigation_project_id`,
    [title, resume, state, teamId, projectId]
  );

  if (result.rows.length === 0) {
    throw new Error('Proyecto no encontrado');
  }

  return await getProjectById(projectId);
};

const deleteProject = async (projectId, userId) => {
  // Validar que el proyecto existe y pertenece al coordinador
  const existingProject = await getProjectById(projectId);
  const isOwner = await teamService.isTeamOwnedByCoordinator(existingProject.teamId, userId);
  if (!isOwner) {
    throw new Error('No tienes permiso para eliminar este proyecto');
  }

  const result = await pool.query(
    'DELETE FROM Investigation_project WHERE investigation_project_id = $1 RETURNING investigation_project_id',
    [projectId]
  );

  if (result.rows.length === 0) {
    throw new Error('Proyecto no encontrado');
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

