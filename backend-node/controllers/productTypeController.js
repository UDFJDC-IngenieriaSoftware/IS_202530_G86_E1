const productTypeService = require('../services/productTypeService');

const getAllProductTypes = async (req, res) => {
  try {
    const productTypes = await productTypeService.getAllProductTypes();
    res.json(productTypes);
  } catch (error) {
    console.error('Error getting product types:', error);
    res.status(500).json({ message: 'Error al obtener tipos de producto' });
  }
};

const getProductTypeById = async (req, res) => {
  try {
    const productTypeId = parseInt(req.params.id);
    const productType = await productTypeService.getProductTypeById(productTypeId);
    res.json(productType);
  } catch (error) {
    console.error('Error getting product type:', error);
    res.status(404).json({ message: error.message || 'Tipo de producto no encontrado' });
  }
};

const createProductType = async (req, res) => {
  try {
    const productType = await productTypeService.createProductType(req.body);
    res.status(201).json(productType);
  } catch (error) {
    console.error('Error creating product type:', error);
    res.status(400).json({ message: error.message || 'Error al crear tipo de producto' });
  }
};

const updateProductType = async (req, res) => {
  try {
    const productTypeId = parseInt(req.params.id);
    const productType = await productTypeService.updateProductType(productTypeId, req.body);
    res.json(productType);
  } catch (error) {
    console.error('Error updating product type:', error);
    res.status(400).json({ message: error.message || 'Error al actualizar tipo de producto' });
  }
};

const deleteProductType = async (req, res) => {
  try {
    const productTypeId = parseInt(req.params.id);
    await productTypeService.deleteProductType(productTypeId);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting product type:', error);
    res.status(400).json({ message: error.message || 'Error al eliminar tipo de producto' });
  }
};

module.exports = {
  getAllProductTypes,
  getProductTypeById,
  createProductType,
  updateProductType,
  deleteProductType,
};

