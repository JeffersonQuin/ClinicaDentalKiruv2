const express = require('express');
const router = express.Router();
const recetaController = require("../controllers/recetaController");
const auth = require("../auth");

router.get('/', auth.verificatoken, recetaController.listado);
router.get('/:id', auth.verificatoken, recetaController.obtenerPorId);
router.get('/paciente/:paciente_id', auth.verificatoken, recetaController.obtenerPorPaciente);
router.post('/', auth.verificatoken, recetaController.crear);
router.put('/:id', auth.verificatoken, recetaController.actualizar);
router.delete('/:id', auth.verificatoken, recetaController.eliminar);

module.exports = router;