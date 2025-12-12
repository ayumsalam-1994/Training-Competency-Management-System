/**
 * Competency Routes
 * Defines API endpoints for competencies and certificates
 */

const express = require('express');
const router = express.Router();
const competencyController = require('./competencyController');
const { authGuard } = require('../middleware/authMiddleware');

// Competency endpoints
// Note: Specific routes must come BEFORE parameterized routes (:id)
router.get('/', authGuard, competencyController.getAllCompetencies.bind(competencyController));
router.post('/', authGuard, competencyController.createCompetency.bind(competencyController));

// User-specific competency routes
router.get('/user/me', authGuard, competencyController.getUserCompetencies.bind(competencyController));
router.get('/user/:userId', authGuard, competencyController.getUserCompetencies.bind(competencyController));

// Stats endpoint
router.get('/stats', authGuard, competencyController.getUserCompetencyStats.bind(competencyController));

// Parameterized routes last
router.get('/:id', authGuard, competencyController.getCompetencyById.bind(competencyController));

// User competency assignment and level updates
router.post('/assign', authGuard, competencyController.assignCompetencyToUser.bind(competencyController));
router.put('/user/:userId/competency/:competencyId', authGuard, competencyController.updateUserCompetencyLevel.bind(competencyController));

module.exports = router;
