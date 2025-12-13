const AnuncioModel = require('../models/anuncioModel');

const anuncioController = {

  listar: async (req, res) => {
    try {
      const anuncios = await AnuncioModel.listar();
      res.json(anuncios);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al listar los anuncios' } });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const anuncio = await AnuncioModel.obtenerPorId(id);

      if (!anuncio) {
        return res.status(404).json({ error: { message: 'Anuncio no encontrado' } });
      }

      res.json(anuncio);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al obtener el anuncio' } });
    }
  },

  crear: async (req, res) => {
    try {
      const { titulo, descripcion, categoria, fecha_publicacion, fecha_expiracion, userId, estado } = req.body;

      const anuncio = { titulo, descripcion, categoria, fecha_publicacion, fecha_expiracion, userId, estado };

      // Guardar imagen si se sube
      if (req.file) {
        anuncio.imagen = `/uploads/${req.file.filename}`;
      }

      const nuevo = await AnuncioModel.crear(anuncio);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al crear el anuncio' } });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const anuncioExistente = await AnuncioModel.obtenerPorId(id);
      if (!anuncioExistente) {
        return res.status(404).json({ error: { message: 'Anuncio no encontrado' } });
      }

      const datos = {
        titulo: req.body.titulo ?? anuncioExistente.titulo,
        descripcion: req.body.descripcion ?? anuncioExistente.descripcion,
        categoria: req.body.categoria ?? anuncioExistente.categoria,
        fecha_publicacion: req.body.fecha_publicacion ?? anuncioExistente.fecha_publicacion,
        fecha_expiracion: req.body.fecha_expiracion ?? anuncioExistente.fecha_expiracion,
        userId: req.body.userId ?? anuncioExistente.userId,
        estado: req.body.estado ?? anuncioExistente.estado,
        imagen: anuncioExistente.imagen
      };

      if (req.file) {
        datos.imagen = `/uploads/${req.file.filename}`;
      }

      const actualizado = await AnuncioModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al actualizar el anuncio' } });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;
      await AnuncioModel.eliminar(id);
      res.json({ message: 'Anuncio eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al eliminar el anuncio' } });
    }
  }

};

module.exports = anuncioController;
