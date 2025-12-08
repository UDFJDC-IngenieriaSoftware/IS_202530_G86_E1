const pool = require('../config/database');

const createApplication = async (applicationData, userEmail) => {
  const { investigationTeamId, applicationMessage } = applicationData;

  // Obtener user_id del email
  const userResult = await pool.query(
    'SELECT user_id FROM app_user WHERE email = $1',
    [userEmail]
  );

  if (userResult.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  const userId = userResult.rows[0].user_id;

  // Verificar que el usuario sea estudiante o docente
  const userRoleResult = await pool.query(
    'SELECT role FROM app_user WHERE user_id = $1',
    [userId]
  );

  const userRole = userRoleResult.rows[0].role;
  if (userRole !== 'ESTUDIANTE' && userRole !== 'DOCENTE') {
    throw new Error('Solo los estudiantes y docentes pueden aplicar a equipos');
  }

  const result = await pool.query(
    `INSERT INTO Application (user_id, investigation_team_id, state, application_date, application_message)
     VALUES ($1, $2, $3, CURRENT_DATE, $4)
     RETURNING application_id, user_id, investigation_team_id, state, application_date, application_message`,
    [userId, investigationTeamId, 'PENDIENTE', applicationMessage]
  );

  return await getApplicationById(result.rows[0].application_id);
};

const getApplicationsByUser = async (userEmail) => {
  const result = await pool.query(`
    SELECT 
      a.application_id as "applicationId",
      a.user_id as "userId",
      a.investigation_team_id as "investigationTeamId",
      a.state,
      a.application_date as "applicationDate",
      a.application_message as "applicationMessage",
      a.answer_date as "answerDate",
      a.answer_message as "answerMessage",
      u.name as "userName",
      u.email as "userEmail",
      it.name as "teamName"
    FROM Application a
    INNER JOIN app_user u ON a.user_id = u.user_id
    INNER JOIN Investigation_team it ON a.investigation_team_id = it.investigation_team_id
    WHERE u.email = $1
    ORDER BY a.application_date DESC
  `, [userEmail]);

  return result.rows;
};

const getApplicationsByTeam = async (teamId) => {
  const result = await pool.query(`
    SELECT 
      a.application_id as "applicationId",
      a.user_id as "userId",
      a.investigation_team_id as "investigationTeamId",
      a.state,
      a.application_date as "applicationDate",
      a.application_message as "applicationMessage",
      a.answer_date as "answerDate",
      a.answer_message as "answerMessage",
      u.name as "userName",
      u.email as "userEmail",
      u.role as "userRole",
      it.name as "teamName"
    FROM Application a
    INNER JOIN app_user u ON a.user_id = u.user_id
    INNER JOIN Investigation_team it ON a.investigation_team_id = it.investigation_team_id
    WHERE a.investigation_team_id = $1
    ORDER BY a.application_date DESC
  `, [teamId]);

  return result.rows;
};

const getApplicationById = async (applicationId) => {
  const result = await pool.query(`
    SELECT 
      a.application_id as "applicationId",
      a.user_id as "userId",
      a.investigation_team_id as "investigationTeamId",
      a.state,
      a.application_date as "applicationDate",
      a.application_message as "applicationMessage",
      a.answer_date as "answerDate",
      a.answer_message as "answerMessage",
      u.name as "userName",
      u.email as "userEmail",
      it.name as "teamName"
    FROM Application a
    INNER JOIN app_user u ON a.user_id = u.user_id
    INNER JOIN Investigation_team it ON a.investigation_team_id = it.investigation_team_id
    WHERE a.application_id = $1
  `, [applicationId]);

  if (result.rows.length === 0) {
    throw new Error('Aplicación no encontrada');
  }

  return result.rows[0];
};

const getApplicationByUserAndTeam = async (userEmail, teamId) => {
  const result = await pool.query(`
    SELECT 
      a.application_id as "applicationId",
      a.user_id as "userId",
      a.investigation_team_id as "investigationTeamId",
      a.state,
      a.application_date as "applicationDate",
      a.application_message as "applicationMessage",
      a.answer_date as "answerDate",
      a.answer_message as "answerMessage",
      u.name as "userName",
      u.email as "userEmail",
      it.name as "teamName"
    FROM Application a
    INNER JOIN app_user u ON a.user_id = u.user_id
    INNER JOIN Investigation_team it ON a.investigation_team_id = it.investigation_team_id
    WHERE u.email = $1 AND a.investigation_team_id = $2
    ORDER BY a.application_date DESC
    LIMIT 1
  `, [userEmail, teamId]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0];
};

const updateApplicationStatus = async (applicationId, state, answerMessage) => {
  const result = await pool.query(
    `UPDATE Application 
     SET state = $1, answer_message = $2, answer_date = CURRENT_DATE
     WHERE application_id = $3
     RETURNING application_id`,
    [state, answerMessage, applicationId]
  );

  if (result.rows.length === 0) {
    throw new Error('Aplicación no encontrada');
  }

  return await getApplicationById(applicationId);
};

module.exports = {
  createApplication,
  getApplicationsByUser,
  getApplicationsByTeam,
  getApplicationByUserAndTeam,
  updateApplicationStatus,
};

