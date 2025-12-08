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
    LEFT JOIN Cordinator c ON it.cordinator_id = c.coordinator_id
    LEFT JOIN Teacher t ON c.teacher_id = t.teacher_id
    LEFT JOIN app_user u ON t.user_id = u.user_id
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

const getCoordinatorIdByUserId = async (userId) => {
  const result = await pool.query(`
    SELECT c.coordinator_id
    FROM Cordinator c
    INNER JOIN Teacher t ON c.teacher_id = t.teacher_id
    WHERE t.user_id = $1
    LIMIT 1
  `, [userId]);

  if (result.rows.length === 0) {
    return null;
  }

  return result.rows[0].coordinator_id;
};

const createTeam = async (teamData) => {
  const { name, teamEmail, description, areaId, coordinatorId, teacherId } = teamData;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    let finalCoordinatorId = coordinatorId;

    // Si se proporciona teacherId, crear o obtener el coordinador
    if (teacherId && !coordinatorId) {
      // Verificar que el docente existe y es DOCENTE
      const teacherCheck = await client.query(`
        SELECT t.teacher_id, u.user_id, u.role
        FROM Teacher t
        INNER JOIN app_user u ON t.user_id = u.user_id
        WHERE t.teacher_id = $1
      `, [teacherId]);

      if (teacherCheck.rows.length === 0) {
        throw new Error('El docente seleccionado no existe');
      }

      const teacher = teacherCheck.rows[0];
      
      if (teacher.role !== 'DOCENTE' && teacher.role !== 'COORDINADOR') {
        throw new Error('El usuario seleccionado no es un docente válido');
      }

      // Verificar si ya es coordinador
      const existingCoordinator = await client.query(
        'SELECT coordinator_id FROM Cordinator WHERE teacher_id = $1',
        [teacherId]
      );

      if (existingCoordinator.rows.length > 0) {
        finalCoordinatorId = existingCoordinator.rows[0].coordinator_id;
      } else {
        // Crear nuevo coordinador
        const coordinatorIdResult = await client.query(
          'SELECT COALESCE(MAX(coordinator_id), 0) + 1 as next_id FROM Cordinator'
        );
        finalCoordinatorId = coordinatorIdResult.rows[0].next_id;

        await client.query(
          'INSERT INTO Cordinator (coordinator_id, teacher_id) VALUES ($1, $2)',
          [finalCoordinatorId, teacherId]
        );

        // Cambiar el rol del docente a COORDINADOR
        await client.query(
          'UPDATE app_user SET role = $1 WHERE user_id = $2',
          ['COORDINADOR', teacher.user_id]
        );
      }
    }

    // Validar que se tenga un coordinador
    if (!finalCoordinatorId) {
      throw new Error('Un grupo debe tener un coordinador asignado');
    }

    // Verificar que el coordinador no esté ya coordinando otro grupo
    const existingTeam = await client.query(
      'SELECT investigation_team_id, name FROM Investigation_team WHERE cordinator_id = $1',
      [finalCoordinatorId]
    );

    if (existingTeam.rows.length > 0) {
      throw new Error(`El coordinador ya está coordinando el grupo "${existingTeam.rows[0].name}". Cada coordinador solo puede coordinar un grupo.`);
    }

    const result = await client.query(
      `INSERT INTO Investigation_team (area_id, cordinator_id, name, team_email, description)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING investigation_team_id, name, team_email, description, area_id, cordinator_id`,
      [areaId, finalCoordinatorId, name, teamEmail, description]
    );

    await client.query('COMMIT');
    return await getTeamById(result.rows[0].investigation_team_id);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const updateTeam = async (teamId, teamData, preserveCoordinator = false) => {
  const { name, teamEmail, description, areaId, coordinatorId } = teamData;

  console.log('updateTeam service - teamId:', teamId);
  console.log('updateTeam service - teamData:', teamData);
  console.log('updateTeam service - preserveCoordinator:', preserveCoordinator);

  // Validar que los campos requeridos estén presentes
  if (!name || !teamEmail || !description || areaId === undefined || areaId === null) {
    throw new Error('Faltan campos requeridos: name, teamEmail, description, areaId');
  }

  // Si preserveCoordinator es true, no actualizar el coordinator_id (para coordinadores)
  if (preserveCoordinator) {
    console.log('updateTeam service - Updating without coordinator_id');
    const result = await pool.query(
      `UPDATE Investigation_team 
       SET name = $1, team_email = $2, description = $3, area_id = $4
       WHERE investigation_team_id = $5
       RETURNING investigation_team_id, cordinator_id`,
      [name, teamEmail, description, areaId, teamId]
    );

    if (result.rows.length === 0) {
      throw new Error('Equipo no encontrado');
    }

    console.log('updateTeam service - Update result:', result.rows[0]);
    console.log('updateTeam service - cordinator_id after update:', result.rows[0].cordinator_id);

    return await getTeamById(teamId);
  } else {
    // Administradores pueden cambiar el coordinador
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // Si no se proporciona coordinatorId ni teacherId, obtener el actual del equipo
      let finalCoordinatorId = coordinatorId;
      const { teacherId } = teamData;

      if (!finalCoordinatorId && !teacherId) {
        const currentTeam = await client.query(
          'SELECT cordinator_id FROM Investigation_team WHERE investigation_team_id = $1',
          [teamId]
        );
        if (currentTeam.rows.length === 0) {
          throw new Error('Equipo no encontrado');
        }
        finalCoordinatorId = currentTeam.rows[0].cordinator_id;
      } else if (teacherId && !coordinatorId) {
        // Si se proporciona teacherId, crear o obtener el coordinador
        // Verificar que el docente existe y es DOCENTE
        const teacherCheck = await client.query(`
          SELECT t.teacher_id, u.user_id, u.role
          FROM Teacher t
          INNER JOIN app_user u ON t.user_id = u.user_id
          WHERE t.teacher_id = $1
        `, [teacherId]);

        if (teacherCheck.rows.length === 0) {
          throw new Error('El docente seleccionado no existe');
        }

        const teacher = teacherCheck.rows[0];
        
        if (teacher.role !== 'DOCENTE' && teacher.role !== 'COORDINADOR') {
          throw new Error('El usuario seleccionado no es un docente válido');
        }

        // Verificar si ya es coordinador
        const existingCoordinator = await client.query(
          'SELECT coordinator_id FROM Cordinator WHERE teacher_id = $1',
          [teacherId]
        );

        if (existingCoordinator.rows.length > 0) {
          finalCoordinatorId = existingCoordinator.rows[0].coordinator_id;
        } else {
          // Crear nuevo coordinador
          const coordinatorIdResult = await client.query(
            'SELECT COALESCE(MAX(coordinator_id), 0) + 1 as next_id FROM Cordinator'
          );
          finalCoordinatorId = coordinatorIdResult.rows[0].next_id;

          await client.query(
            'INSERT INTO Cordinator (coordinator_id, teacher_id) VALUES ($1, $2)',
            [finalCoordinatorId, teacherId]
          );

          // Cambiar el rol del docente a COORDINADOR
          await client.query(
            'UPDATE app_user SET role = $1 WHERE user_id = $2',
            ['COORDINADOR', teacher.user_id]
          );
        }
      }

      // Verificar que el coordinador no esté ya coordinando otro grupo
      // (excepto si es el mismo grupo que se está editando)
      const existingTeam = await client.query(
        'SELECT investigation_team_id, name FROM Investigation_team WHERE cordinator_id = $1 AND investigation_team_id != $2',
        [finalCoordinatorId, teamId]
      );

      if (existingTeam.rows.length > 0) {
        throw new Error(`El coordinador ya está coordinando el grupo "${existingTeam.rows[0].name}". Cada coordinador solo puede coordinar un grupo.`);
      }

      console.log('updateTeam service - Updating with coordinator_id:', finalCoordinatorId);
      const result = await client.query(
        `UPDATE Investigation_team 
         SET name = $1, team_email = $2, description = $3, area_id = $4, cordinator_id = $5
         WHERE investigation_team_id = $6
         RETURNING investigation_team_id`,
        [name, teamEmail, description, areaId, finalCoordinatorId, teamId]
      );

      if (result.rows.length === 0) {
        throw new Error('Equipo no encontrado');
      }

      await client.query('COMMIT');
      return await getTeamById(teamId);
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
};

const getTeamsByStudent = async (userId) => {
  const result = await pool.query(`
    SELECT DISTINCT
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
    INNER JOIN Application a ON it.investigation_team_id = a.investigation_team_id
    WHERE a.user_id = $1 AND a.state = 'APROBADA'
    ORDER BY it.investigation_team_id
  `, [userId]);

  return result.rows;
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
  getTeamsByStudent,
  isTeamOwnedByCoordinator,
  getCoordinatorIdByUserId,
  createTeam,
  updateTeam,
  deleteTeam,
};

