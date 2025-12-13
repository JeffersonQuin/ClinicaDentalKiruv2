const router = require('express').Router();
const citaController = require('../controllers/citaController');
const { verificatoken } = require('../auth');

// TODAS las rutas protegidas con JWT
// El middleware verificatoken inyecta req.decoded con info del usuario

// Listar todas las citas
router.get('/', verificatoken, citaController.listado);

// Listar citas por paciente
router.get('/paciente/:pacienteId', verificatoken, citaController.listarPorPaciente);

// Listar citas por dentista
router.get('/dentista/:dentistaId', verificatoken, citaController.listarPorDentista);

// Obtener próximas citas de un dentista
router.get('/dentista/:dentistaId/proximas', verificatoken, citaController.proximasCitas);

// Obtener estadísticas de un dentista
router.get('/dentista/:dentistaId/estadisticas', verificatoken, citaController.estadisticas);

// Obtener horarios disponibles (incluye reservas y citas)
router.get('/horarios-disponibles', verificatoken, citaController.horariosDisponibles);

// Obtener cita por ID
router.get('/:id', verificatoken, citaController.obtenerPorId);

// Crear nueva cita
router.post('/', verificatoken, citaController.crear);

// Actualizar cita
router.put('/:id', verificatoken, citaController.actualizar);

// Cambiar estado de cita
router.patch('/:id/estado', verificatoken, citaController.cambiarEstado);

// Completar cita
router.patch('/:id/completar', verificatoken, citaController.completar);

// Cancelar cita
router.patch('/:id/cancelar', verificatoken, citaController.cancelar);

// Soft delete
router.delete('/:id', verificatoken, citaController.eliminar);

module.exports = router;