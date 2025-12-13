const DentistaModel = require('../models/dentistaModel');

const dentistaController = {

  listar: async (req, res) => {
    try {
      const data = await DentistaModel.listar();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al listar los dentistas' } });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const dentista = await DentistaModel.obtenerPorId(id);

      if (!dentista) {
        return res.status(404).json({ error: { message: 'Dentista no encontrado' } });
      }

      res.json(dentista);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al obtener el dentista' } });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, segundo_nombre, apellido_paterno, apellido_materno, estado } = req.body;

      const dentista = {
        nombre,
        segundo_nombre,
        apellido_paterno,
        apellido_materno,
        estado
      };

      if (req.file) {
        dentista.imagen = `/uploads/${req.file.filename}`;
      } else {
        dentista.imagen = null;
      }

      const nuevo = await DentistaModel.crear(dentista);
      res.status(201).json(nuevo);

    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al crear el dentista' } });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;

      // Obtener el dentista existente
      const dentistaExistente = await DentistaModel.obtenerPorId(id);
      if (!dentistaExistente) {
        return res.status(404).json({ error: { message: 'Dentista no encontrado' } });
      }

      // Construir los datos a actualizar, usando los existentes si no se envían
      const datos = {
        nombre: req.body.nombre ?? dentistaExistente.nombre,
        segundo_nombre: req.body.segundo_nombre ?? dentistaExistente.segundo_nombre,
        apellido_paterno: req.body.apellido_paterno ?? dentistaExistente.apellido_paterno,
        apellido_materno: req.body.apellido_materno ?? dentistaExistente.apellido_materno,
        estado: req.body.estado ?? dentistaExistente.estado,
        imagen: dentistaExistente.imagen // mantener imagen existente por defecto
      };

      // Si hay archivo nuevo, reemplazar la imagen
      if (req.file) {
        datos.imagen = `/uploads/${req.file.filename}`;
      }

      const actualizado = await DentistaModel.actualizar(id, datos);
      res.json(actualizado);

    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al actualizar el dentista' } });
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

      // Obtener el dentista existente
      const dentistaExistente = await DentistaModel.obtenerPorId(id);
      if (!dentistaExistente) {
        return res.status(404).json({ error: { message: 'Dentista no encontrado' } });
      }

      // Actualizar solo el estado
      const datos = {
        ...dentistaExistente,
        estado: estado
      };

      const actualizado = await DentistaModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al cambiar el estado del dentista' } });
    }
  }

};

module.exports = dentistaController;
