const pool = require('../config/database');

const getAllProjectAreas = async () => {
  const result = await pool.query(
    'SELECT proyect_area_id as "proyectAreaId", name, project_email as "projectEmail" FROM Project_area ORDER BY proyect_area_id'
  );
  return result.rows;
};

const getProjectAreaById = async (proyectAreaId) => {
  const result = await pool.query(
    'SELECT proyect_area_id as "proyectAreaId", name, project_email as "projectEmail" FROM Project_area WHERE proyect_area_id = $1',
    [proyectAreaId]
  );
  if (result.rows.length === 0) {
    throw new Error('Proyecto curricular no encontrado');
  }
  return result.rows[0];
};

const createProjectArea = async (projectAreaData) => {
  const { name, projectEmail } = projectAreaData;
  
  // Validar que el nombre no esté vacío
  if (!name || name.trim() === '') {
    throw new Error('El nombre del proyecto curricular es obligatorio');
  }
  
  // Validar que el email no esté vacío
  if (!projectEmail || projectEmail.trim() === '') {
    throw new Error('El email del proyecto curricular es obligatorio');
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(projectEmail.trim())) {
    throw new Error('El email debe tener un formato válido');
  }
  
  // Obtener el siguiente ID disponible
  const maxIdResult = await pool.query(
    'SELECT COALESCE(MAX(proyect_area_id), 0) + 1 as next_id FROM Project_area'
  );
  const nextId = maxIdResult.rows[0].next_id;
  
  // Verificar si ya existe un proyecto con el mismo nombre
  const existing = await pool.query(
    'SELECT proyect_area_id FROM Project_area WHERE LOWER(name) = LOWER($1)',
    [name.trim()]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('Ya existe un proyecto curricular con ese nombre');
  }
  
  const result = await pool.query(
    'INSERT INTO Project_area (proyect_area_id, name, project_email) VALUES ($1, $2, $3) RETURNING proyect_area_id as "proyectAreaId", name, project_email as "projectEmail"',
    [nextId, name.trim(), projectEmail.trim()]
  );
  
  return result.rows[0];
};

const updateProjectArea = async (proyectAreaId, projectAreaData) => {
  const { name, projectEmail } = projectAreaData;
  
  // Verificar que el proyecto existe
  await getProjectAreaById(proyectAreaId);
  
  // Validar que el nombre no esté vacío
  if (!name || name.trim() === '') {
    throw new Error('El nombre del proyecto curricular es obligatorio');
  }
  
  // Validar que el email no esté vacío
  if (!projectEmail || projectEmail.trim() === '') {
    throw new Error('El email del proyecto curricular es obligatorio');
  }
  
  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(projectEmail.trim())) {
    throw new Error('El email debe tener un formato válido');
  }
  
  // Verificar si ya existe otro proyecto con el mismo nombre
  const existing = await pool.query(
    'SELECT proyect_area_id FROM Project_area WHERE LOWER(name) = LOWER($1) AND proyect_area_id != $2',
    [name.trim(), proyectAreaId]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('Ya existe otro proyecto curricular con ese nombre');
  }
  
  const result = await pool.query(
    'UPDATE Project_area SET name = $1, project_email = $2 WHERE proyect_area_id = $3 RETURNING proyect_area_id as "proyectAreaId", name, project_email as "projectEmail"',
    [name.trim(), projectEmail.trim(), proyectAreaId]
  );
  
  return result.rows[0];
};

const deleteProjectArea = async (proyectAreaId) => {
  // Verificar que el proyecto existe
  await getProjectAreaById(proyectAreaId);
  
  // Verificar si hay estudiantes usando este proyecto curricular
  const studentsUsingArea = await pool.query(
    'SELECT COUNT(*) as count FROM Student WHERE project_id = $1',
    [proyectAreaId]
  );
  
  // Verificar si hay docentes usando este proyecto curricular
  const teachersUsingArea = await pool.query(
    'SELECT COUNT(*) as count FROM Teacher WHERE project_id = $1',
    [proyectAreaId]
  );
  
  // Verificar si hay áreas de investigación usando este proyecto curricular
  const investigationAreasUsingArea = await pool.query(
    'SELECT COUNT(*) as count FROM Investigation_area WHERE project_area_id = $1',
    [proyectAreaId]
  );
  
  const totalStudents = parseInt(studentsUsingArea.rows[0].count);
  const totalTeachers = parseInt(teachersUsingArea.rows[0].count);
  const totalInvestigationAreas = parseInt(investigationAreasUsingArea.rows[0].count);
  
  if (totalStudents > 0 || totalTeachers > 0 || totalInvestigationAreas > 0) {
    const reasons = [];
    if (totalStudents > 0) reasons.push(`${totalStudents} estudiante(s)`);
    if (totalTeachers > 0) reasons.push(`${totalTeachers} docente(s)`);
    if (totalInvestigationAreas > 0) reasons.push(`${totalInvestigationAreas} área(s) de investigación`);
    
    throw new Error(`No se puede eliminar el proyecto curricular porque está siendo utilizado por: ${reasons.join(', ')}`);
  }
  
  await pool.query(
    'DELETE FROM Project_area WHERE proyect_area_id = $1',
    [proyectAreaId]
  );
  
  return { message: 'Proyecto curricular eliminado exitosamente' };
};

const isProjectAreaInUse = async (proyectAreaId) => {
  const students = await pool.query(
    'SELECT COUNT(*) as count FROM Student WHERE project_id = $1',
    [proyectAreaId]
  );
  const teachers = await pool.query(
    'SELECT COUNT(*) as count FROM Teacher WHERE project_id = $1',
    [proyectAreaId]
  );
  const investigationAreas = await pool.query(
    'SELECT COUNT(*) as count FROM Investigation_area WHERE project_area_id = $1',
    [proyectAreaId]
  );
  
  return (
    parseInt(students.rows[0].count) > 0 ||
    parseInt(teachers.rows[0].count) > 0 ||
    parseInt(investigationAreas.rows[0].count) > 0
  );
};

const getUsersByProjectArea = async (proyectAreaId) => {
  // Obtener estudiantes
  const students = await pool.query(`
    SELECT 
      u.user_id as "userId",
      u.name,
      u.email,
      u.role,
      s.student_id as "studentId"
    FROM app_user u
    INNER JOIN Student s ON u.user_id = s.user_id
    WHERE s.project_id = $1
    ORDER BY u.name
  `, [proyectAreaId]);

  // Obtener docentes
  const teachers = await pool.query(`
    SELECT 
      u.user_id as "userId",
      u.name,
      u.email,
      u.role,
      t.teacher_id as "teacherId"
    FROM app_user u
    INNER JOIN Teacher t ON u.user_id = t.user_id
    WHERE t.project_id = $1
    ORDER BY u.name
  `, [proyectAreaId]);

  return {
    students: students.rows,
    teachers: teachers.rows
  };
};

module.exports = {
  getAllProjectAreas,
  getProjectAreaById,
  createProjectArea,
  updateProjectArea,
  deleteProjectArea,
  isProjectAreaInUse,
  getUsersByProjectArea,
};

