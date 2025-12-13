const express = require('express');
const router = express.Router();
const dependientesController = require("../controllers/dependientes");
const auth = require("../auth");

// Todas las rutas requieren autenticación
router.get('/', auth.verificatoken, dependientesController.listado);
router.get('/:id', auth.verificatoken, dependientesController.obtenerPorId);
router.post('/', auth.verificatoken, dependientesController.crear);
router.put('/:id', auth.verificatoken, dependientesController.actualizar);
router.delete('/:id', auth.verificatoken, dependientesController.eliminar);
router.patch('/:id/restaurar', auth.verificatoken, dependientesController.restaurar);

module.exports = router;
