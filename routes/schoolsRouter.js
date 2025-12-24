const express = require('express');
const schoolsController = require('../controllers/schoolController');
const router = express.Router();

router.get('/', schoolsController.getALLSchools);

router.post('/', schoolsController.createNewSchool);

module.exports = router;