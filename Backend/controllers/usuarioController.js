const UsuarioModel = require('../models/usuarioModel');

const usuarioController = {

  listar: async (req, res) => {
    try {
      const usuarios = await UsuarioModel.listar();
      res.json(usuarios);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al listar los usuarios' } });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = await UsuarioModel.obtenerPorId(id);

      if (!usuario) {
        return res.status(404).json({ error: { message: 'Usuario no encontrado' } });
      }

      res.json(usuario);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al obtener el usuario' } });
    }
  },

  crear: async (req, res) => {
    try {
      const usuario = req.body;
      const nuevo = await UsuarioModel.crear(usuario);
      res.status(201).json(nuevo);
    } catch (error) {
      // Si el error viene de duplicados, mostramos el mensaje exacto
      res.status(400).json({ error: { message: error.message || 'Error al crear el usuario' } });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;

      const actualizado = await UsuarioModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al actualizar el usuario' } });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      await UsuarioModel.eliminar(id);
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al eliminar el usuario' } });
    }
  }

};

module.exports = usuarioController;
