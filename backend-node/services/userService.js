const pool = require('../config/database');

const getAllUsers = async () => {
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
      pa.name as "projectAreaName"
    FROM app_user u
    LEFT JOIN Student s ON u.user_id = s.user_id
    LEFT JOIN Teacher t ON u.user_id = t.user_id
    LEFT JOIN Project_area pa ON s.project_id = pa.proyect_area_id OR t.project_id = pa.proyect_area_id
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
  const { name, email, role } = userData;

  const result = await pool.query(
    `UPDATE app_user 
     SET name = $1, email = $2, role = $3 
     WHERE user_id = $4 
     RETURNING user_id, name, email, role`,
    [name, email, role, userId]
  );

  if (result.rows.length === 0) {
    throw new Error('Usuario no encontrado');
  }

  return result.rows[0];
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

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  updateUser,
  deleteUser,
};

