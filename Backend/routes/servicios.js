// routes/servicios.js
const express = require('express');
const router = express.Router();
const serviciosController = require("../controllers/servicios");

// Rutas públicas (no requieren autenticación para listar)
router.get('/', serviciosController.listado);
router.get('/:id', serviciosController.obtenerPorId);

module.exports = router;