const pool = require('../config/database');

const getAllProductTypes = async () => {
  const result = await pool.query(
    'SELECT product_type_id as "productTypeId", name, description FROM Product_type ORDER BY product_type_id'
  );
  return result.rows;
};

const getProductTypeById = async (productTypeId) => {
  const result = await pool.query(
    'SELECT product_type_id as "productTypeId", name, description FROM Product_type WHERE product_type_id = $1',
    [productTypeId]
  );
  if (result.rows.length === 0) {
    throw new Error('Tipo de producto no encontrado');
  }
  return result.rows[0];
};

const createProductType = async (productTypeData) => {
  const { name, description } = productTypeData;
  
  // Validar que el nombre no esté vacío
  if (!name || name.trim() === '') {
    throw new Error('El nombre del tipo de producto es obligatorio');
  }
  
  // Validar que la descripción no esté vacía
  if (!description || description.trim() === '') {
    throw new Error('La descripción del tipo de producto es obligatoria');
  }
  
  // Verificar si ya existe un tipo con el mismo nombre
  const existing = await pool.query(
    'SELECT product_type_id FROM Product_type WHERE LOWER(name) = LOWER($1)',
    [name.trim()]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('Ya existe un tipo de producto con ese nombre');
  }
  
  const result = await pool.query(
    'INSERT INTO Product_type (name, description) VALUES ($1, $2) RETURNING product_type_id as "productTypeId", name, description',
    [name.trim(), description.trim()]
  );
  
  return result.rows[0];
};

const updateProductType = async (productTypeId, productTypeData) => {
  const { name, description } = productTypeData;
  
  // Verificar que el tipo existe
  await getProductTypeById(productTypeId);
  
  // Validar que el nombre no esté vacío
  if (!name || name.trim() === '') {
    throw new Error('El nombre del tipo de producto es obligatorio');
  }
  
  // Validar que la descripción no esté vacía
  if (!description || description.trim() === '') {
    throw new Error('La descripción del tipo de producto es obligatoria');
  }
  
  // Verificar si ya existe otro tipo con el mismo nombre
  const existing = await pool.query(
    'SELECT product_type_id FROM Product_type WHERE LOWER(name) = LOWER($1) AND product_type_id != $2',
    [name.trim(), productTypeId]
  );
  
  if (existing.rows.length > 0) {
    throw new Error('Ya existe otro tipo de producto con ese nombre');
  }
  
  const result = await pool.query(
    'UPDATE Product_type SET name = $1, description = $2 WHERE product_type_id = $3 RETURNING product_type_id as "productTypeId", name, description',
    [name.trim(), description.trim(), productTypeId]
  );
  
  return result.rows[0];
};

const deleteProductType = async (productTypeId) => {
  // Verificar que el tipo existe
  await getProductTypeById(productTypeId);
  
  // Verificar si hay productos usando este tipo
  const productsUsingType = await pool.query(
    'SELECT COUNT(*) as count FROM Product WHERE type_product_id = $1',
    [productTypeId]
  );
  
  if (parseInt(productsUsingType.rows[0].count) > 0) {
    throw new Error('No se puede eliminar el tipo de producto porque está siendo utilizado por uno o más productos');
  }
  
  await pool.query(
    'DELETE FROM Product_type WHERE product_type_id = $1',
    [productTypeId]
  );
  
  return { message: 'Tipo de producto eliminado exitosamente' };
};

const isProductTypeInUse = async (productTypeId) => {
  const result = await pool.query(
    'SELECT COUNT(*) as count FROM Product WHERE type_product_id = $1',
    [productTypeId]
  );
  return parseInt(result.rows[0].count) > 0;
};

module.exports = {
  getAllProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
  isProductTypeInUse,
};

