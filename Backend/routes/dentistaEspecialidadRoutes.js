const express = require('express');
const router = express.Router();
const controller = require('../controllers/dentistaEspecialidadController');

router.get('/', controller.listar); // Todas las relaciones
router.get('/:dentista_id', controller.obtenerPorDentista); // Especialidades de un dentista
router.post('/', controller.asignar); // Asignar una especialidad
router.delete('/', controller.eliminar); // Remover una especialidad
router.put('/reemplazar', controller.reemplazarEspecialidades); // Reemplazar todas las especialidades de un dentista

module.exports = router;
