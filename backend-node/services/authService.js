const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { secret, expiration } = require('../config/jwt');
const pool = require('../config/database');

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user.user_id,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: expiration / 1000 } // Convert to seconds
  );
};

const register = async (registerData) => {
  const { name, email, password, role, projectAreaId } = registerData;

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

    // Si es estudiante o coordinador, crear registro en tabla correspondiente
    if (role === 'ESTUDIANTE' && projectAreaId) {
      // Obtener el siguiente student_id
      const studentIdResult = await client.query(
        'SELECT COALESCE(MAX(student_id), 0) + 1 as next_id FROM Student'
      );
      const studentId = studentIdResult.rows[0].next_id;

      await client.query(
        `INSERT INTO Student (user_id, student_id, project_id, student_email) 
         VALUES ($1, $2, $3, $4)`,
        [user.user_id, studentId, projectAreaId, email]
      );
    } else if (role === 'COORDINADOR' && projectAreaId) {
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

      // Crear coordinador
      const coordinatorIdResult = await client.query(
        'SELECT COALESCE(MAX(coordinator_id), 0) + 1 as next_id FROM Cordinator'
      );
      const coordinatorId = coordinatorIdResult.rows[0].next_id;

      await client.query(
        'INSERT INTO Cordinator (coordinator_id, teacher_id) VALUES ($1, $2)',
        [coordinatorId, teacherId]
      );
    }

    await client.query('COMMIT');

    const token = generateToken(user);

    return {
      token,
      email: user.email,
      name: user.name,
      role: user.role,
      message: 'Usuario registrado exitosamente',
    };
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

const login = async (email, password) => {
  console.log('🔐 Intentando login para:', email);
  
  // Buscar usuario
  const userResult = await pool.query(
    'SELECT user_id, name, email, password, role FROM app_user WHERE email = $1',
    [email]
  );

  if (userResult.rows.length === 0) {
    console.log('❌ Usuario no encontrado:', email);
    throw new Error('Credenciales inválidas');
  }

  const user = userResult.rows[0];
  console.log('✅ Usuario encontrado:', user.email);

  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password);
  console.log('🔑 Verificación de contraseña:', isValidPassword);

  if (!isValidPassword) {
    console.log('❌ Contraseña inválida para:', email);
    throw new Error('Credenciales inválidas');
  }

  const token = generateToken(user);
  console.log('✅ Login exitoso para:', email);

  return {
    token,
    email: user.email,
    name: user.name,
    role: user.role,
    message: 'Login exitoso',
  };
};

module.exports = {
  register,
  login,
};

