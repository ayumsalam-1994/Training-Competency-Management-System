/**
 * Competency Routes
 * Defines API endpoints for competencies and certificates
 */

const express = require('express');
const router = express.Router();
const competencyController = require('./competencyController');
const { authGuard } = require('../middleware/authMiddleware');

// Competency endpoints
router.get('/', authGuard, competencyController.getAllCompetencies.bind(competencyController));
router.get('/:id', authGuard, competencyController.getCompetencyById.bind(competencyController));
router.post('/', authGuard, competencyController.createCompetency.bind(competencyController));
router.get('/user/:userId', authGuard, competencyController.getUserCompetencies.bind(competencyController));

module.exports = router;
