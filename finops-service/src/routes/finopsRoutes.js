// finopsRoutes.js
// Express Router definitions for FinOps routes, securing them for SUPER_ADMIN role only

const express = require('express');
const router = express.Router();
const finopsController = require('../controllers/finopsController');
const { authenticate, requireRole } = require('../../shared/auth');
const validation = require('../validation/finopsValidation');

// All FinOps endpoints are restricted strictly to SUPER_ADMIN per constraints
router.get('/dashboard', authenticate, requireRole('SUPER_ADMIN'), finopsController.getDashboard);
router.get('/recommendations', authenticate, requireRole('SUPER_ADMIN'), finopsController.getRecommendations);
router.post('/recommendations/:id/apply', authenticate, requireRole('SUPER_ADMIN'), finopsController.applyRecommendation);
router.post('/costs', authenticate, requireRole('SUPER_ADMIN'), validation.validateCostsPayload, finopsController.recordCosts);

module.exports = router;
