const express = require('express');
const studentsController = require('../controllers/studentsController');
const { ensureAuth } = require('../middleware/auth');
const router = express.Router();

// Public endpoints
router.post('/login', studentsController.loginStudent);
router.post('/register', studentsController.createNewStudent); // registration

// Protect all routes below (including GET)
router.use(ensureAuth);

router.get('/', studentsController.getAllStudents);

module.exports = router;