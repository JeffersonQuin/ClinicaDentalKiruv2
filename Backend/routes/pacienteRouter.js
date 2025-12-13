const express = require('express');
const router = express.Router();
const pacientesController = require('../controllers/pacienteController');
const auth = require("../auth");

router.get('/', auth.verificatoken, pacientesController.listado);
router.get('/:id', auth.verificatoken, pacientesController.obtenerPorId);
router.post('/', auth.verificatoken, pacientesController.crear);
router.put('/:id', auth.verificatoken, pacientesController.actualizar);
router.delete('/:id', auth.verificatoken, pacientesController.eliminar);
router.get('/ci/:ci', auth.verificatoken, pacientesController.buscarPorCI);
router.get('/email/:gmail', auth.verificatoken, pacientesController.buscarPorEmail);

module.exports = router;