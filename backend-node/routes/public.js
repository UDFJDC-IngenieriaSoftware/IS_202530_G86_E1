const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/project-areas', publicController.getAllProjectAreas);
router.get('/investigation-areas', publicController.getAllInvestigationAreas);
router.get('/product-types', publicController.getAllProductTypes);

module.exports = router;

