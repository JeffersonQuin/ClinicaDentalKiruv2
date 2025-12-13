const express = require('express');
const router = express.Router();
const usersController = require("../controllers/users");
const auth = require("../auth");

router.get('/', auth.verificatoken, usersController.listado);
router.get('/:id', auth.verificatoken, usersController.obtenerPorId);
router.post('/', auth.verificatoken, usersController.crear);
router.put('/:id', auth.verificatoken, usersController.actualizar);
router.delete('/:id', auth.verificatoken, usersController.eliminar);
router.patch('/:id/promocionar', auth.verificatoken, usersController.promocionarUsuario);

router.post('/login', usersController.login);

module.exports = router;