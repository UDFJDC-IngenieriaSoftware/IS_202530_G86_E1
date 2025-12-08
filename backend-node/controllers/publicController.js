const pool = require('../config/database');

const getAllProjectAreas = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT proyect_area_id as "proyectAreaId", name, project_email as "projectEmail" FROM Project_area ORDER BY proyect_area_id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting project areas:', error);
    res.status(500).json({ message: 'Error al obtener áreas de proyecto' });
  }
};

const getAllInvestigationAreas = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting investigation areas:', error);
    res.status(500).json({ message: 'Error al obtener áreas de investigación' });
  }
};

const getAllProductTypes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT product_type_id as "productTypeId", name, description FROM Product_type ORDER BY product_type_id'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting product types:', error);
    res.status(500).json({ message: 'Error al obtener tipos de producto' });
  }
};

module.exports = {
  getAllProjectAreas,
  getAllInvestigationAreas,
  getAllProductTypes,
};

