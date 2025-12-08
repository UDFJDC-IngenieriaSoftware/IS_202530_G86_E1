const pool = require('../config/database');

const getAllUsers = async () => {
  const result = await pool.query(`
    SELECT 
      u.user_id as "userId",
      u.name,
      u.email,
      u.role,
      pa.proyect_area_id as "projectAreaId",
      pa.name as "projectAreaName",
      c.coordinator_id as "coordinatorId"
    FROM app_user u
    LEFT JOIN Student s ON u.user_id = s.user_id
    LEFT JOIN Teacher t ON u.user_id = t.user_id
    LEFT JOIN Project_area pa ON s.project_id = pa.proyect_area_id OR t.project_id = pa.proyect_area_id
    LEFT JOIN Cordinator c ON t.teacher_id = c.teacher_id
    ORDER BY u.user_id
  `);

  return result.rows;
};

const getUserById = async (userId) => {
  const result = await pool.query(`
    SELECT 
      u.user_id as "userId",
      u.name,
      u.email,
      u.role,
      pa.proyect_area_id as "projectAreaId",
      pa.name as "projectAreaName",
      c.coordinator_id as "coordinatorId"
    FROM app_user u
    LEFT JOIN Student s ON u.user_id = s.user_id
    LEFT JOIN Teacher t ON u.user_id = t.user_id
    LEFT JOIN Project_area pa ON s.project_id = pa.proyect_area_id OR t.project_id = pa.proyect_area_id
    LEFT JOIN Cordinator c ON t.teacher_id = c.teacher_id
    WHERE u.user_id = $1
  `, [userId]);

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const result = await pool.query(`
    SELECT 
      u.user_id as "userId",
      u.name,
      u.email,
      u.role,
      pa.proyect_area_id as "projectAreaId",
      pa.name as "projectAreaName"
    FROM app_user u
    LEFT JOIN Student s ON u.user_id = s.user_id
    LEFT JOIN Teacher t ON u.user_id = t.user_id
    LEFT JOIN Project_area pa ON s.project_id = pa.proyect_area_id OR t.project_id = pa.proyect_area_id
    WHERE u.email = $1
  `, [email]);

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
};

const updateUser = async (userId, userData) => {
  const { name, email, role, projectAreaId } = userData;
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    // Obtener el rol actual del usuario
    const currentUserResult = await client.query(
      'SELECT role FROM app_user WHERE user_id = $1',
      [userId]
    );

    if (currentUserResult.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const currentRole = currentUserResult.rows[0].role;

    // Si el usuario es estudiante, no permitir cambiar el rol
    if (currentRole === 'ESTUDIANTE' && role !== 'ESTUDIANTE') {
      throw new Error('No se puede cambiar el rol de un estudiante. Los estudiantes siempre deben mantener su rol.');
    }

    // Actualizar usuario
    const result = await client.query(
      `UPDATE app_user 
       SET name = $1, email = $2, role = $3 
       WHERE user_id = $4 
       RETURNING user_id, name, email, role`,
      [name, email, role, userId]
    );

    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    // Si se proporciona projectAreaId, actualizar en Teacher
    if (projectAreaId && (role === 'DOCENTE' || role === 'COORDINADOR')) {
      await client.query(
        `UPDATE Teacher 
         SET project_id = $1 
         WHERE user_id = $2`,
        [projectAreaId, userId]
      );
    }

    await client.query('COMMIT');
    
    // Obtener el usuario completo con información de proyecto
    const fullUser = await getUserById(userId);
    return fullUser;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const deleteUser = async (userId) => {
  const result = await pool.query(
    'DELETE FROM app_user WHERE user_id = $1 RETURNING user_id',
    [userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }
};

const createUser = async (userData) => {
  const { name, email, password, role, projectAreaId } = userData;
  const bcrypt = require('bcryptjs');

  // Validar email del dominio udistrital
  if (!email.endsWith('@udistrital.edu.co')) {
    throw new Error('El email debe ser del dominio @udistrital.edu.co');
  }

  // Verificar si el usuario ya existe
  const existingUser = await pool.query(
    'SELECT user_id FROM app_user WHERE email = $1',
    [email]
  );

  if (existingUser.rows.length > 0) {
    throw new Error('El email ya está registrado');
  }

  // Validar que el rol sea solo DOCENTE
  if (role !== 'DOCENTE') {
    throw new Error('Solo se pueden crear docentes. Los coordinadores se asignan al asignar un grupo a un docente.');
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Iniciar transacción
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Crear usuario
    const userResult = await client.query(
      `INSERT INTO app_user (name, email, password, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING user_id, name, email, role`,
      [name, email, hashedPassword, role]
    );

    const user = userResult.rows[0];

    // Crear registro en tabla Teacher (tanto DOCENTE como COORDINADOR son teachers)
    if (projectAreaId) {
      // Obtener el siguiente teacher_id
      const teacherIdResult = await client.query(
        'SELECT COALESCE(MAX(teacher_id), 0) + 1 as next_id FROM Teacher'
      );
      const teacherId = teacherIdResult.rows[0].next_id;

      await client.query(
        `INSERT INTO Teacher (user_id, teacher_id, project_id, teacher_email) 
         VALUES ($1, $2, $3, $4)`,
        [user.user_id, teacherId, projectAreaId, email]
      );

      // NOTA: Los coordinadores NO se crean aquí. Se asignan cuando un docente es nombrado coordinador de un grupo.
    }

    await client.query('COMMIT');

    // Obtener el usuario completo con información de proyecto
    const fullUser = await getUserById(user.user_id);
    return fullUser;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getUserWithCoordinatorInfo = async (userId) => {
  const result = await pool.query(`
    SELECT 
      u.user_id as "userId",
      u.name,
      u.email,
      u.role,
      pa.proyect_area_id as "projectAreaId",
      pa.name as "projectAreaName",
      c.coordinator_id as "coordinatorId",
      COALESCE(
        json_agg(
          json_build_object(
            'investigationTeamId', it.investigation_team_id,
            'name', it.name
          )
        ) FILTER (WHERE it.investigation_team_id IS NOT NULL),
        '[]'::json
      ) as "coordinatedTeams"
    FROM app_user u
    LEFT JOIN Student s ON u.user_id = s.user_id
    LEFT JOIN Teacher t ON u.user_id = t.user_id
    LEFT JOIN Project_area pa ON s.project_id = pa.proyect_area_id OR t.project_id = pa.proyect_area_id
    LEFT JOIN Cordinator c ON t.teacher_id = c.teacher_id
    LEFT JOIN Investigation_team it ON c.coordinator_id = it.cordinator_id
    WHERE u.user_id = $1
    GROUP BY u.user_id, u.name, u.email, u.role, pa.proyect_area_id, pa.name, c.coordinator_id
  `, [userId]);

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
};

const updateCoordinatorTeams = async (coordinatorId, teamId) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Validar que se proporcione un grupo
    if (!teamId) {
      throw new Error('Un coordinador debe tener un grupo asignado');
    }

    // Verificar que el grupo existe
    const teamCheck = await client.query(
      'SELECT cordinator_id FROM Investigation_team WHERE investigation_team_id = $1',
      [teamId]
    );
    
    if (teamCheck.rows.length === 0) {
      throw new Error('El grupo seleccionado no existe');
    }

    // Obtener el grupo actual de este coordinador
    const currentTeamResult = await client.query(
      'SELECT investigation_team_id FROM Investigation_team WHERE cordinator_id = $1 LIMIT 1',
      [coordinatorId]
    );
    
    const currentTeamId = currentTeamResult.rows.length > 0 ? currentTeamResult.rows[0].investigation_team_id : null;

    // Si el nuevo grupo es diferente al actual, hacer el cambio
    if (currentTeamId !== teamId) {
      const newTeamCurrentCoordinator = teamCheck.rows[0].cordinator_id;

      // Si el nuevo grupo ya tiene otro coordinador, no permitir el cambio
      if (newTeamCurrentCoordinator && newTeamCurrentCoordinator !== coordinatorId) {
        throw new Error('El grupo seleccionado ya tiene otro coordinador asignado');
      }

      // Asignar el nuevo grupo al coordinador
      await client.query(
        'UPDATE Investigation_team SET cordinator_id = $1 WHERE investigation_team_id = $2',
        [coordinatorId, teamId]
      );

      // Si había un grupo anterior, ahora quedará sin coordinador
      // Esto es aceptable temporalmente, pero el administrador debe asignar otro coordinador
      // No lanzamos error, pero el sistema debe asegurar que todos los grupos tengan coordinador
    }

    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const getTeamsWithoutCoordinator = async (currentCoordinatorId = null) => {
  // Obtener grupos sin coordinador o que tengan el coordinador actual (para edición)
  let query = `
    SELECT 
      it.investigation_team_id as "investigationTeamId",
      it.name,
      it.team_email as "teamEmail",
      it.description,
      ia.investigation_area_id as "areaId",
      ia.name as "areaName",
      it.cordinator_id as "coordinatorId"
    FROM Investigation_team it
    INNER JOIN Investigation_area ia ON it.area_id = ia.investigation_area_id
    WHERE it.cordinator_id IS NULL
  `;
  
  const params = [];
  
  // Si se está editando un coordinador, incluir también su grupo actual
  if (currentCoordinatorId) {
    query += ` OR it.cordinator_id = $1`;
    params.push(currentCoordinatorId);
  }
  
  query += ` ORDER BY it.investigation_team_id`;
  
  const result = await pool.query(query, params);
  return result.rows;
};

const getAllCoordinators = async (excludeTeamId = null) => {
  // Obtener coordinadores que no tienen grupo asignado, o el coordinador del equipo que se está editando
  let query = `
    SELECT DISTINCT
      c.coordinator_id as "coordinatorId",
      u.user_id as "userId",
      u.name,
      u.email,
      pa.proyect_area_id as "projectAreaId",
      pa.name as "projectAreaName"
    FROM Cordinator c
    INNER JOIN Teacher t ON c.teacher_id = t.teacher_id
    INNER JOIN app_user u ON t.user_id = u.user_id
    LEFT JOIN Project_area pa ON t.project_id = pa.proyect_area_id
    LEFT JOIN Investigation_team it ON it.cordinator_id = c.coordinator_id
    WHERE it.investigation_team_id IS NULL
  `;
  
  const params = [];
  
  // Si se está editando un equipo, incluir también su coordinador actual
  if (excludeTeamId) {
    query += ` OR it.investigation_team_id = $1`;
    params.push(excludeTeamId);
  }
  
  query += ` ORDER BY u.name`;
  
  const result = await pool.query(query, params);
  return result.rows;
};

const getAvailableTeachers = async (excludeTeamId = null) => {
  // Obtener docentes que NO son coordinadores, o el docente coordinador del equipo que se está editando
  let query = `
    SELECT DISTINCT
      t.teacher_id as "teacherId",
      u.user_id as "userId",
      u.name,
      u.email,
      pa.proyect_area_id as "projectAreaId",
      pa.name as "projectAreaName",
      c.coordinator_id as "coordinatorId"
    FROM Teacher t
    INNER JOIN app_user u ON t.user_id = u.user_id
    LEFT JOIN Project_area pa ON t.project_id = pa.proyect_area_id
    LEFT JOIN Cordinator c ON c.teacher_id = t.teacher_id
    LEFT JOIN Investigation_team it ON it.cordinator_id = c.coordinator_id
    WHERE u.role = 'DOCENTE' AND (c.coordinator_id IS NULL OR it.investigation_team_id IS NULL)
  `;
  
  const params = [];
  
  // Si se está editando un equipo, incluir también su coordinador actual
  if (excludeTeamId) {
    query += ` OR it.investigation_team_id = $1`;
    params.push(excludeTeamId);
  }
  
  query += ` ORDER BY u.name`;
  
  const result = await pool.query(query, params);
  return result.rows;
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
  createUser,
  getUserWithCoordinatorInfo,
  updateCoordinatorTeams,
  getTeamsWithoutCoordinator,
  getAllCoordinators,
  getAvailableTeachers,
};

