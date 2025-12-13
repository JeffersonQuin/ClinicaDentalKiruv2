const express = require('express');
const router = express.Router();
const sucursalController = require('../controllers/sucursalController');
const upload = require('../middlewares/upload');

router.get('/', sucursalController.listar);
router.get('/:id', sucursalController.obtenerPorId);
router.post('/', upload.single('imagen'), sucursalController.crear);
router.put('/:id', upload.single('imagen'), sucursalController.actualizar);
router.patch('/:id/toggle-activo', sucursalController.toggleActivo);

module.exports = router;
