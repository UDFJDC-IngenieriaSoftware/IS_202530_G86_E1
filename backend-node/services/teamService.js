const pool = require('../config/database');

const getAllTeams = async () => {
  const result = await pool.query(`
    SELECT 
      it.investigation_team_id as "investigationTeamId",
      it.name,
      it.team_email as "teamEmail",
      it.description,
      ia.investigation_area_id as "areaId",
      ia.name as "areaName",
      c.coordinator_id as "coordinatorId",
      u.name as "coordinatorName",
      u.email as "coordinatorEmail"
    FROM Investigation_team it
    INNER JOIN Investigation_area ia ON it.area_id = ia.investigation_area_id
    INNER JOIN Cordinator c ON it.cordinator_id = c.coordinator_id
    INNER JOIN Teacher t ON c.teacher_id = t.teacher_id
    INNER JOIN app_user u ON t.user_id = u.user_id
    ORDER BY it.investigation_team_id
  `);

  return result.rows;
};

const getTeamById = async (teamId) => {
  const result = await pool.query(`
    SELECT 
      it.investigation_team_id as "investigationTeamId",
      it.name,
      it.team_email as "teamEmail",
      it.description,
      ia.investigation_area_id as "areaId",
      ia.name as "areaName",
      c.coordinator_id as "coordinatorId",
      u.name as "coordinatorName",
      u.email as "coordinatorEmail"
    FROM Investigation_team it
    INNER JOIN Investigation_area ia ON it.area_id = ia.investigation_area_id
    INNER JOIN Cordinator c ON it.cordinator_id = c.coordinator_id
    INNER JOIN Teacher t ON c.teacher_id = t.teacher_id
    INNER JOIN app_user u ON t.user_id = u.user_id
    WHERE it.investigation_team_id = $1
  `, [teamId]);

  if (result.rows.length === 0) {
    throw new Error('Equipo no encontrado');
  }

  return result.rows[0];
};

const getTeamsByArea = async (areaId) => {
  const result = await pool.query(`
    SELECT 
      it.investigation_team_id as "investigationTeamId",
      it.name,
      it.team_email as "teamEmail",
      it.description,
      ia.investigation_area_id as "areaId",
      ia.name as "areaName",
      c.coordinator_id as "coordinatorId",
      u.name as "coordinatorName",
      u.email as "coordinatorEmail"
    FROM Investigation_team it
    INNER JOIN Investigation_area ia ON it.area_id = ia.investigation_area_id
    INNER JOIN Cordinator c ON it.cordinator_id = c.coordinator_id
    INNER JOIN Teacher t ON c.teacher_id = t.teacher_id
    INNER JOIN app_user u ON t.user_id = u.user_id
    WHERE ia.investigation_area_id = $1
    ORDER BY it.investigation_team_id
  `, [areaId]);

  return result.rows;
};

const createTeam = async (teamData) => {
  const { name, teamEmail, description, areaId, coordinatorId } = teamData;

  const result = await pool.query(
    `INSERT INTO Investigation_team (area_id, cordinator_id, name, team_email, description)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING investigation_team_id, name, team_email, description, area_id, cordinator_id`,
    [areaId, coordinatorId, name, teamEmail, description]
  );

  return await getTeamById(result.rows[0].investigation_team_id);
};

const updateTeam = async (teamId, teamData) => {
  const { name, teamEmail, description, areaId, coordinatorId } = teamData;

  const result = await pool.query(
    `UPDATE Investigation_team 
     SET name = $1, team_email = $2, description = $3, area_id = $4, cordinator_id = $5
     WHERE investigation_team_id = $6
     RETURNING investigation_team_id`,
    [name, teamEmail, description, areaId, coordinatorId, teamId]
  );

  if (result.rows.length === 0) {
    throw new Error('Equipo no encontrado');
  }

  return await getTeamById(teamId);
};

const deleteTeam = async (teamId) => {
  const result = await pool.query(
    'DELETE FROM Investigation_team WHERE investigation_team_id = $1 RETURNING investigation_team_id',
    [teamId]
  );

  if (result.rows.length === 0) {
    throw new Error('Equipo no encontrado');
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

