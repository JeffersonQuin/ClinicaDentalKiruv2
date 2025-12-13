const express = require('express');
const router = express.Router();
const dentistaController = require('../controllers/dentistaController');
const upload = require('../middlewares/upload'); // si usas multer para imagen

router.get('/', dentistaController.listar);
router.get('/:id', dentistaController.obtenerPorId);
router.post('/', upload.single('imagen'), dentistaController.crear);
router.put('/:id', upload.single('imagen'), dentistaController.actualizar);
router.patch('/:id/toggle-estado', dentistaController.toggleEstado);

module.exports = router;
