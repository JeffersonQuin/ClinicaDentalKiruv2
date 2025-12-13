const EspecialidadModel = require('../models/especialidadModel');

const especialidadController = {

  listar: async (req, res) => {
    try {
      const data = await EspecialidadModel.listar();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al listar las especialidades' } });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const esp = await EspecialidadModel.obtenerPorId(id);

      if (!esp) {
        return res.status(404).json({ error: { message: 'Especialidad no encontrada' } });
      }

      res.json(esp);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al obtener la especialidad' } });
    }
  },

  crear: async (req, res) => {
    try {
      const esp = req.body;
      const nueva = await EspecialidadModel.crear(esp);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: { message: 'Error al crear la especialidad' } });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const datos = req.body;
      const actualizado = await EspecialidadModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: 'Error al actualizar la especialidad' } });
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

      // Obtener la especialidad existente
      const especialidadExistente = await EspecialidadModel.obtenerPorId(id);
      if (!especialidadExistente) {
        return res.status(404).json({ error: { message: 'Especialidad no encontrada' } });
      }

      // Actualizar solo el estado
      const datos = {
        ...especialidadExistente,
        estado: estado
      };

      const actualizado = await EspecialidadModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al cambiar el estado de la especialidad' } });
    }
  }

};

module.exports = especialidadController;
