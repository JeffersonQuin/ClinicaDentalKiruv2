// routes/sucursales.js
const express = require('express');
const router = express.Router();
const sucursalesController = require("../controllers/sucursales");

// Rutas públicas (no requieren autenticación para listar)
router.get('/', sucursalesController.listado);
router.get('/:id', sucursalesController.obtenerPorId);

module.exports = router;