const pool = require('../config/database');
const teamService = require('./teamService');

const getAllProjects = async () => {
  const result = await pool.query(`
    SELECT 
      ip.investigation_project_id as "investigationProjectId",
      ip.title,
      ip.resume,
      ip.state,
      ip.team_id as "teamId",
      it.name as "teamName",
      pt.product_type_id as "productTypeId",
      pt.name as "productTypeName",
      p.document
    FROM Investigation_project ip
    INNER JOIN Investigation_team it ON ip.team_id = it.investigation_team_id
    LEFT JOIN Product p ON ip.investigation_project_id = p.investigation_project_id
    LEFT JOIN Product_type pt ON p.type_product_id = pt.product_type_id
    ORDER BY ip.investigation_project_id, p.product_id DESC
  `);

  // Si hay múltiples productos, tomar el más reciente (ya ordenado DESC)
  // Priorizar el que tenga document si existe
  const uniqueProjects = new Map();
  result.rows.forEach(row => {
    const existing = uniqueProjects.get(row.investigationProjectId);
    if (!existing) {
      uniqueProjects.set(row.investigationProjectId, row);
    } else if (row.document && !existing.document) {
      // Si el nuevo tiene document y el existente no, reemplazar
      uniqueProjects.set(row.investigationProjectId, row);
    }
  });

  return Array.from(uniqueProjects.values());
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
      p.type_product_id as "productTypeId",
      p.document
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
      it.name as "teamName",
      p.document
    FROM Investigation_project ip
    INNER JOIN Investigation_team it ON ip.team_id = it.investigation_team_id
    LEFT JOIN Product p ON ip.investigation_project_id = p.investigation_project_id
    WHERE ip.team_id = $1
    ORDER BY ip.investigation_project_id, p.product_id DESC
  `, [teamId]);

  // Si hay múltiples productos, tomar el más reciente (ya ordenado DESC)
  // Priorizar el que tenga document si existe
  const uniqueProjects = new Map();
  result.rows.forEach(row => {
    const existing = uniqueProjects.get(row.investigationProjectId);
    if (!existing) {
      uniqueProjects.set(row.investigationProjectId, row);
    } else if (row.document && !existing.document) {
      // Si el nuevo tiene document y el existente no, reemplazar
      uniqueProjects.set(row.investigationProjectId, row);
    }
  });

  return Array.from(uniqueProjects.values());
};

const createProject = async (projectData, userId) => {
  const { title, resume, state, teamId, productTypeId, document } = projectData;
  
  console.log('createProject - projectData:', projectData);
  console.log('createProject - document:', document);
  console.log('createProject - document type:', typeof document);

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

  // Si se proporcionó un tipo de producto o un documento, crear un producto asociado
  const hasDocument = document && typeof document === 'string' && document.trim() !== '';
  console.log('createProject - hasDocument:', hasDocument);
  console.log('createProject - productTypeId:', productTypeId);
  
  if (productTypeId || hasDocument) {
    const today = new Date().toISOString().split('T')[0]; // Fecha actual en formato YYYY-MM-DD
    
    // Determinar el tipo de producto a usar
    let finalProductTypeId = productTypeId;
    if (!finalProductTypeId) {
      // Si hay document pero no productTypeId, buscar un tipo por defecto
      const defaultProductType = await pool.query(
        'SELECT product_type_id FROM Product_type ORDER BY product_type_id LIMIT 1'
      );
      if (defaultProductType.rows.length > 0) {
        finalProductTypeId = defaultProductType.rows[0].product_type_id;
        console.log('createProject - Using default productTypeId:', finalProductTypeId);
      } else {
        throw new Error('No hay tipos de producto disponibles. Debe crear al menos uno para guardar el documento.');
      }
    }
    
    // Guardar el documento (puede ser vacío si solo se proporciona productTypeId)
    const documentValue = hasDocument ? document.trim() : '';
    console.log('createProject - Saving document:', documentValue);
    console.log('createProject - Inserting Product with:', { projectId, finalProductTypeId, title, documentValue, today });
    
    await pool.query(
      `INSERT INTO Product (investigation_project_id, type_product_id, title, document, public_date)
       VALUES ($1, $2, $3, $4, $5)`,
      [projectId, finalProductTypeId, title, documentValue, today]
    );
    
    console.log('createProject - Product inserted successfully');
  } else {
    console.log('createProject - No productTypeId or document provided, skipping Product creation');
  }

  return await getProjectById(projectId);
};

const updateProject = async (projectId, projectData, userId) => {
  const { title, resume, state, teamId, productTypeId, document } = projectData;
  
  console.log('updateProject - projectData:', projectData);
  console.log('updateProject - document:', document);
  console.log('updateProject - document type:', typeof document);

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

  // Verificar si ya existe un producto para este proyecto
  const existingProduct = await pool.query(
    'SELECT product_id, document, type_product_id FROM Product WHERE investigation_project_id = $1 LIMIT 1',
    [projectId]
  );

  const hasDocument = document !== undefined && document !== null && typeof document === 'string' && document.trim() !== '';
  console.log('updateProject - hasDocument:', hasDocument);
  console.log('updateProject - existingProduct.rows.length:', existingProduct.rows.length);

  // Si se proporcionó un tipo de producto o un documento, manejar el Product
  if (productTypeId || hasDocument) {
    if (existingProduct.rows.length === 0) {
      // Crear un nuevo producto
      const today = new Date().toISOString().split('T')[0];
      
      // Determinar el tipo de producto a usar
      let finalProductTypeId = productTypeId;
      if (!finalProductTypeId) {
        // Si hay document pero no productTypeId, buscar un tipo por defecto
        const defaultProductType = await pool.query(
          'SELECT product_type_id FROM Product_type ORDER BY product_type_id LIMIT 1'
        );
        if (defaultProductType.rows.length > 0) {
          finalProductTypeId = defaultProductType.rows[0].product_type_id;
        } else {
          throw new Error('No hay tipos de producto disponibles. Debe crear al menos uno para guardar el documento.');
        }
      }
      
      const documentValue = hasDocument ? document.trim() : '';
      console.log('updateProject - Creating Product with document:', documentValue);
      await pool.query(
        `INSERT INTO Product (investigation_project_id, type_product_id, title, document, public_date)
        VALUES ($1, $2, $3, $4, $5)`,
        [projectId, finalProductTypeId, title, documentValue, today]
      );
    } else {
      // Actualizar el producto existente
      const documentValue = hasDocument 
        ? document.trim() 
        : (existingProduct.rows[0].document || '');
      const typeToUse = productTypeId || existingProduct.rows[0].type_product_id;
      
      console.log('updateProject - Updating Product with document:', documentValue);
      await pool.query(
        `UPDATE Product 
         SET type_product_id = $1, title = $2, document = $3
         WHERE investigation_project_id = $4 AND product_id = $5`,
        [typeToUse, title, documentValue, projectId, existingProduct.rows[0].product_id]
      );
    }
  } else if (existingProduct.rows.length > 0 && hasDocument) {
    // Si solo se está actualizando el documento (sin cambiar tipo ni crear nuevo)
    const documentValue = document.trim();
    console.log('updateProject - Updating only document:', documentValue);
    await pool.query(
      `UPDATE Product 
       SET document = $1
       WHERE investigation_project_id = $2 AND product_id = $3`,
      [documentValue, projectId, existingProduct.rows[0].product_id]
    );
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

