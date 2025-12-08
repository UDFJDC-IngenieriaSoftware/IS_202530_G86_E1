const pool = require('../config/database');

const getAllInvestigationAreas = async () => {
  const result = await pool.query(`
    SELECT 
      ia.investigation_area_id as "investigationAreaId",
      ia.project_area_id as "projectAreaId",
      ia.name,
      ia.description,
      pa.name as "projectAreaName"
    FROM Investigation_area ia
    INNER JOIN Project_area pa ON ia.project_area_id = pa.proyect_area_id
    ORDER BY ia.investigation_area_id
  `);
  return result.rows;
};

const getInvestigationAreasByProjectArea = async (projectAreaId) => {
  const result = await pool.query(`
    SELECT 
      ia.investigation_area_id as "investigationAreaId",
      ia.project_area_id as "projectAreaId",
      ia.name,
      ia.description,
      pa.name as "projectAreaName"
    FROM Investigation_area ia
    INNER JOIN Project_area pa ON ia.project_area_id = pa.proyect_area_id
    WHERE ia.project_area_id = $1
    ORDER BY ia.investigation_area_id
  `, [projectAreaId]);
  return result.rows;
};

const getInvestigationAreaById = async (investigationAreaId) => {
  const result = await pool.query(`
    SELECT 
      ia.investigation_area_id as "investigationAreaId",
      ia.project_area_id as "projectAreaId",
      ia.name,
      ia.description,
      pa.name as "projectAreaName"
    FROM Investigation_area ia
    INNER JOIN Project_area pa ON ia.project_area_id = pa.proyect_area_id
    WHERE ia.investigation_area_id = $1
  `, [investigationAreaId]);
  
  if (result.rows.length === 0) {
    throw new Error('Área de investigación no encontrada');
  }
  return result.rows[0];
};

const createInvestigationArea = async (investigationAreaData) => {
  const { name, description, projectAreaId } = investigationAreaData;
  
  // Validar que el nombre no esté vacío
  if (!name || name.trim() === '') {
    throw new Error('El nombre del área de investigación es obligatorio');
  }
  
  // Validar que la descripción no esté vacía
  if (!description || description.trim() === '') {
    throw new Error('La descripción del área de investigación es obligatoria');
  }
  
  // Validar que el projectAreaId existe
  const projectAreaCheck = await pool.query(
    'SELECT proyect_area_id FROM Project_area WHERE proyect_area_id = $1',
    [projectAreaId]
  );
  
  if (projectAreaCheck.rows.length === 0) {
    throw new Error('El proyecto curricular especificado no existe');
  }
  
  // Verificar si ya existe un área con el mismo nombre en el mismo proyecto
  const existing = await pool.query(
    'SELECT investigation_area_id FROM Investigation_area WHERE LOWER(name) = LOWER($1) AND project_area_id = $2',
    [name.trim(), projectAreaId]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('Ya existe un área de investigación con ese nombre en este proyecto curricular');
  }
  
  const result = await pool.query(
    'INSERT INTO Investigation_area (project_area_id, name, description) VALUES ($1, $2, $3) RETURNING investigation_area_id as "investigationAreaId", project_area_id as "projectAreaId", name, description',
    [projectAreaId, name.trim(), description.trim()]
  );
  
  return await getInvestigationAreaById(result.rows[0].investigationAreaId);
};

const updateInvestigationArea = async (investigationAreaId, investigationAreaData) => {
  const { name, description, projectAreaId } = investigationAreaData;
  
  // Verificar que el área existe
  await getInvestigationAreaById(investigationAreaId);
  
  // Validar que el nombre no esté vacío
  if (!name || name.trim() === '') {
    throw new Error('El nombre del área de investigación es obligatorio');
  }
  
  // Validar que la descripción no esté vacía
  if (!description || description.trim() === '') {
    throw new Error('La descripción del área de investigación es obligatoria');
  }
  
  // Si se cambia el projectAreaId, validar que existe
  if (projectAreaId) {
    const projectAreaCheck = await pool.query(
      'SELECT proyect_area_id FROM Project_area WHERE proyect_area_id = $1',
      [projectAreaId]
    );
    
    if (projectAreaCheck.rows.length === 0) {
      throw new Error('El proyecto curricular especificado no existe');
    }
  }
  
  // Verificar si ya existe otra área con el mismo nombre en el mismo proyecto
  const currentArea = await getInvestigationAreaById(investigationAreaId);
  const finalProjectAreaId = projectAreaId || currentArea.projectAreaId;
  
  const existing = await pool.query(
    'SELECT investigation_area_id FROM Investigation_area WHERE LOWER(name) = LOWER($1) AND project_area_id = $2 AND investigation_area_id != $3',
    [name.trim(), finalProjectAreaId, investigationAreaId]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('Ya existe otra área de investigación con ese nombre en este proyecto curricular');
  }
  
  const finalName = name.trim();
  const finalDescription = description.trim();
  
  await pool.query(
    'UPDATE Investigation_area SET name = $1, description = $2, project_area_id = $3 WHERE investigation_area_id = $4',
    [finalName, finalDescription, finalProjectAreaId, investigationAreaId]
  );
  
  return await getInvestigationAreaById(investigationAreaId);
};

const deleteInvestigationArea = async (investigationAreaId) => {
  // Verificar que el área existe
  await getInvestigationAreaById(investigationAreaId);
  
  // Verificar si hay equipos usando esta área
  const teamsUsingArea = await pool.query(
    'SELECT COUNT(*) as count FROM Investigation_team WHERE area_id = $1',
    [investigationAreaId]
  );
  
  if (parseInt(teamsUsingArea.rows[0].count) > 0) {
    throw new Error('No se puede eliminar el área de investigación porque está siendo utilizada por uno o más equipos de investigación');
  }
  
  await pool.query(
    'DELETE FROM Investigation_area WHERE investigation_area_id = $1',
    [investigationAreaId]
  );
  
  return { message: 'Área de investigación eliminada exitosamente' };
};

module.exports = {
  getAllInvestigationAreas,
  getInvestigationAreasByProjectArea,
  getInvestigationAreaById,
  createInvestigationArea,
  updateInvestigationArea,
  deleteInvestigationArea,
};

