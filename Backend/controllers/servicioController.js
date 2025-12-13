const ServicioModel = require('../models/servicioModel');

const servicioController = {

  listar: async (req, res) => {
    try {
      const servicios = await ServicioModel.listar();
      res.json(servicios);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al listar los servicios' } });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const servicio = await ServicioModel.obtenerPorId(id);

      if (!servicio) {
        return res.status(404).json({ error: { message: 'Servicio no encontrado' } });
      }

      res.json(servicio);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al obtener el servicio' } });
    }
  },

  crear: async (req, res) => {
    try {
      const { titulo, descripcion, categoria, estado } = req.body;

      const servicio = { titulo, descripcion, categoria, estado };

      if (req.file) {
        servicio.imagen = `/uploads/${req.file.filename}`;
      }

      const nuevo = await ServicioModel.crear(servicio);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al crear el servicio' } });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const servicioExistente = await ServicioModel.obtenerPorId(id);

      if (!servicioExistente) {
        return res.status(404).json({ error: { message: 'Servicio no encontrado' } });
      }

      const datos = {
        titulo: req.body.titulo ?? servicioExistente.titulo,
        descripcion: req.body.descripcion ?? servicioExistente.descripcion,
        categoria: req.body.categoria ?? servicioExistente.categoria,
        estado: req.body.estado ?? servicioExistente.estado,
        imagen: servicioExistente.imagen
      };

      if (req.file) {
        datos.imagen = `/uploads/${req.file.filename}`;
      }

      const actualizado = await ServicioModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al actualizar el servicio' } });
    }
  },

  toggleEstado: async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.body;

      // Validar que estado sea válido
      if (estado !== 'activo' && estado !== 'inactivo') {
        return res.status(400).json({ error: { message: 'El estado debe ser "activo" o "inactivo"' } });
      }

      // Obtener el servicio existente
      const servicioExistente = await ServicioModel.obtenerPorId(id);
      if (!servicioExistente) {
        return res.status(404).json({ error: { message: 'Servicio no encontrado' } });
      }

      // Actualizar solo el estado
      const datos = {
        ...servicioExistente,
        estado: estado
      };

      const actualizado = await ServicioModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al cambiar el estado del servicio' } });
    }
  }

};

module.exports = servicioController;
