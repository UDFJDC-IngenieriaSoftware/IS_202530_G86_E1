const pool = require('../config/database');
const teamService = require('./teamService');

const getAllProjects = async () => {
  const result = await pool.query(`
    SELECT DISTINCT ON (ip.investigation_project_id)
      ip.investigation_project_id as "investigationProjectId",
      ip.title,
      ip.resume,
      ip.state,
      ip.team_id as "teamId",
      it.name as "teamName",
      pt.product_type_id as "productTypeId",
      pt.name as "productTypeName"
    FROM Investigation_project ip
    INNER JOIN Investigation_team it ON ip.team_id = it.investigation_team_id
    LEFT JOIN Product p ON ip.investigation_project_id = p.investigation_project_id
    LEFT JOIN Product_type pt ON p.type_product_id = pt.product_type_id
    ORDER BY ip.investigation_project_id, p.product_id DESC
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
      it.name as "teamName",
      p.type_product_id as "productTypeId"
    FROM Investigation_project ip
    INNER JOIN Investigation_team it ON ip.team_id = it.investigation_team_id
    LEFT JOIN Product p ON ip.investigation_project_id = p.investigation_project_id
    WHERE ip.investigation_project_id = $1
    LIMIT 1
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
  const { title, resume, state, teamId, productTypeId } = projectData;

  // Validar que el equipo pertenece al coordinador
  const isOwner = await teamService.isTeamOwnedByCoordinator(teamId, userId);
  if (!isOwner) {
    throw new Error('No tienes permiso para crear proyectos en este equipo');
  }

  // Validar que el tipo de producto existe si se proporciona
  if (productTypeId) {
    const productTypeCheck = await pool.query(
      'SELECT product_type_id FROM Product_type WHERE product_type_id = $1',
      [productTypeId]
    );
    if (productTypeCheck.rows.length === 0) {
      throw new Error('Tipo de producto no válido');
    }
  }

  // Crear el proyecto
  const result = await pool.query(
    `INSERT INTO Investigation_project (team_id, title, resume, state)
     VALUES ($1, $2, $3, $4)
     RETURNING investigation_project_id, title, resume, state, team_id`,
    [teamId, title, resume, state]
  );

  const projectId = result.rows[0].investigation_project_id;

  // Si se proporcionó un tipo de producto, crear un producto asociado
  if (productTypeId) {
    const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    await pool.query(
      `INSERT INTO Product (investigation_project_id, type_product_id, title, document, public_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [projectId, productTypeId, title, 'documento_inicial.pdf', today]
    );
  }

  return await getProjectById(projectId);
};

const updateProject = async (projectId, projectData, userId) => {
  const { title, resume, state, teamId, productTypeId } = projectData;

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

  // Validar que el tipo de producto existe si se proporciona
  if (productTypeId) {
    const productTypeCheck = await pool.query(
      'SELECT product_type_id FROM Product_type WHERE product_type_id = $1',
      [productTypeId]
    );
    if (productTypeCheck.rows.length === 0) {
      throw new Error('Tipo de producto no válido');
    }
  }

  // Actualizar el proyecto
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

  // Si se proporcionó un tipo de producto, verificar si ya existe un producto para este proyecto
  // Si no existe, crear uno nuevo; si existe, actualizar el tipo
  if (productTypeId) {
    const existingProduct = await pool.query(
      'SELECT product_id FROM Product WHERE investigation_project_id = $1 LIMIT 1',
      [projectId]
    );

    if (existingProduct.rows.length === 0) {
      // Crear un nuevo producto
      const today = new Date().toISOString().split('T')[0];
      await pool.query(
        `INSERT INTO Product (investigation_project_id, type_product_id, title, document, public_date)
         VALUES ($1, $2, $3, $4, $5)`,
        [projectId, productTypeId, title, 'documento_actualizado.pdf', today]
      );
    } else {
      // Actualizar el tipo de producto existente
      await pool.query(
        `UPDATE Product 
         SET type_product_id = $1, title = $2
         WHERE investigation_project_id = $3 AND product_id = $4`,
        [productTypeId, title, projectId, existingProduct.rows[0].product_id]
      );
    }
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

