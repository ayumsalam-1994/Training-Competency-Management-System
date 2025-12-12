/**
 * Certificate Routes
 * Defines API endpoints for certificate management
 */

const express = require('express');
const router = express.Router();
const competencyController = require('./competencyController');
const { authGuard } = require('../middleware/authMiddleware');

// Certificate endpoints
router.get('/', authGuard, competencyController.getUserCertificates.bind(competencyController));
router.post('/', authGuard, competencyController.issueCertificate.bind(competencyController));
router.get('/:id/download', authGuard, competencyController.downloadCertificate.bind(competencyController));

module.exports = router;
