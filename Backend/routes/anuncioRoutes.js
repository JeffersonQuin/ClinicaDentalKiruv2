const express = require('express');
const router = express.Router();
const anuncioController = require('../controllers/anuncioController');
const upload = require('../middlewares/upload');

// CRUD de anuncios con soporte de imagen
router.get('/', anuncioController.listar);
router.get('/:id', anuncioController.obtenerPorId);
router.post('/', upload.single('imagen'), anuncioController.crear);
router.put('/:id', upload.single('imagen'), anuncioController.actualizar);
router.delete('/:id', anuncioController.eliminar);

module.exports = router;
