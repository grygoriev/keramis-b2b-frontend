// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const authJwt = require('../middlewares/authJwt');
const isInternalManager = require('../middlewares/isInternalManager');

// POST /api/auth/register
router.post('/register', authController.register);

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/logout
router.post('/logout', authController.logout);

// GET /api/auth/clients - только для internal_manager
router.get('/clients', authJwt, isInternalManager, authController.listClients);

// GET /api/auth/client-groups
router.get('/client-groups', authJwt, isInternalManager, authController.listClientGroups);

// PATCH /api/auth/clients/:clientId
router.patch(
	'/clients/:clientId',
	authJwt,
	isInternalManager,
	authController.updateClient
);

module.exports = router;
