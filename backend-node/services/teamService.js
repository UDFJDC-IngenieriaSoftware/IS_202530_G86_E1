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

const getTeamsByCoordinator = async (userId) => {
  console.log('getTeamsByCoordinator - userId:', userId, 'type:', typeof userId);
  const userIdInt = parseInt(userId);
  console.log('getTeamsByCoordinator - userIdInt:', userIdInt);
  
  try {
    // Primero, verificar que el usuario existe y obtener su información de coordinador
    const userCheck = await pool.query(`
      SELECT 
        u.user_id, 
        u.email, 
        u.role, 
        t.teacher_id, 
        c.coordinator_id
      FROM app_user u
      LEFT JOIN Teacher t ON u.user_id = t.user_id
      LEFT JOIN Cordinator c ON t.teacher_id = c.teacher_id
      WHERE u.user_id = $1
    `, [userIdInt]);
    
    console.log('getTeamsByCoordinator - userCheck.rows.length:', userCheck.rows.length);
    console.log('getTeamsByCoordinator - userCheck:', JSON.stringify(userCheck.rows, null, 2));
    
    if (userCheck.rows.length === 0) {
      console.log('getTeamsByCoordinator - Usuario no encontrado');
      return [];
    }
    
    const user = userCheck.rows[0];
    console.log('getTeamsByCoordinator - user.role:', user.role);
    console.log('getTeamsByCoordinator - user.teacher_id:', user.teacher_id);
    console.log('getTeamsByCoordinator - user.coordinator_id:', user.coordinator_id);
    
    if (!user.coordinator_id) {
      console.log('getTeamsByCoordinator - Usuario no es coordinador o no tiene coordinator_id');
      // Intentar obtener todos los coordinadores para debug
      const allCoordinators = await pool.query(`
        SELECT c.coordinator_id, t.teacher_id, u.user_id, u.email
        FROM Cordinator c
        INNER JOIN Teacher t ON c.teacher_id = t.teacher_id
        INNER JOIN app_user u ON t.user_id = u.user_id
      `);
      console.log('getTeamsByCoordinator - Todos los coordinadores:', JSON.stringify(allCoordinators.rows, null, 2));
      return [];
    }
    
    // Ahora obtener los equipos usando el coordinator_id
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
      WHERE c.coordinator_id = $1
      ORDER BY it.investigation_team_id
    `, [user.coordinator_id]);

    console.log('getTeamsByCoordinator - result.rows.length:', result.rows.length);
    console.log('getTeamsByCoordinator - result.rows:', JSON.stringify(result.rows, null, 2));
    
    // Si no hay resultados, verificar que existen equipos para ese coordinador
    if (result.rows.length === 0) {
      const allTeams = await pool.query(`
        SELECT it.investigation_team_id, it.name, it.cordinator_id, c.coordinator_id as c_coord_id
        FROM Investigation_team it
        LEFT JOIN Cordinator c ON it.cordinator_id = c.coordinator_id
      `);
      console.log('getTeamsByCoordinator - Todos los equipos:', JSON.stringify(allTeams.rows, null, 2));
    }
    
    return result.rows;
  } catch (error) {
    console.error('getTeamsByCoordinator - Error:', error);
    throw error;
  }
};

const isTeamOwnedByCoordinator = async (teamId, userId) => {
  const result = await pool.query(`
    SELECT COUNT(*) as count
    FROM Investigation_team it
    INNER JOIN Cordinator c ON it.cordinator_id = c.coordinator_id
    INNER JOIN Teacher t ON c.teacher_id = t.teacher_id
    INNER JOIN app_user u ON t.user_id = u.user_id
    WHERE it.investigation_team_id = $1 AND u.user_id = $2
  `, [teamId, userId]);

  return parseInt(result.rows[0].count) > 0;
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
  getTeamsByCoordinator,
  isTeamOwnedByCoordinator,
  createTeam,
  updateTeam,
  deleteTeam,
};

