const SucursalModel = require('../models/sucursalModel');

const sucursalController = {

  listar: async (req, res) => {
    try {
      const data = await SucursalModel.listar();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al listar las sucursales' } });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const sucursal = await SucursalModel.obtenerPorId(id);

      if (!sucursal) {
        return res.status(404).json({ error: { message: 'Sucursal no encontrada' } });
      }

      res.json(sucursal);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al obtener la sucursal' } });
    }
  },

  crear: async (req, res) => {
    try {
      const { nombre, ubicacion, direccion, descripcion, latitud, longitud, activo } = req.body;

      const sucursal = { nombre, ubicacion, direccion, descripcion, latitud, longitud, activo };

      if (req.file) {
        sucursal.imagen = `/uploads/${req.file.filename}`;
      }

      const nueva = await SucursalModel.crear(sucursal);
      res.status(201).json(nueva);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al crear la sucursal' } });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;

      // Obtener la sucursal existente
      const sucursalExistente = await SucursalModel.obtenerPorId(id);
      if (!sucursalExistente) {
        return res.status(404).json({ error: { message: 'Sucursal no encontrada' } });
      }

      // Construir los datos a actualizar, usando los existentes si no se envían
      const datos = {
        nombre: req.body.nombre ?? sucursalExistente.nombre,
        ubicacion: req.body.ubicacion ?? sucursalExistente.ubicacion,
        direccion: req.body.direccion ?? sucursalExistente.direccion,
        descripcion: req.body.descripcion ?? sucursalExistente.descripcion,
        latitud: req.body.latitud ?? sucursalExistente.latitud,
        longitud: req.body.longitud ?? sucursalExistente.longitud,
        activo: req.body.activo !== undefined ? req.body.activo : sucursalExistente.activo,
        imagen: sucursalExistente.imagen // por defecto mantiene la existente
      };

      // Si hay archivo nuevo, reemplazar la imagen
      if (req.file) {
        datos.imagen = `/uploads/${req.file.filename}`;
      }

      const actualizado = await SucursalModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al actualizar la sucursal' } });
    }
  },

  toggleActivo: async (req, res) => {
    try {
      const { id } = req.params;
      const { activo } = req.body;

      // Validar que activo sea un booleano
      if (typeof activo !== 'boolean') {
        return res.status(400).json({ error: { message: 'El campo activo debe ser un valor booleano' } });
      }

      // Obtener la sucursal existente
      const sucursalExistente = await SucursalModel.obtenerPorId(id);
      if (!sucursalExistente) {
        return res.status(404).json({ error: { message: 'Sucursal no encontrada' } });
      }

      // Actualizar solo el estado activo
      const datos = {
        ...sucursalExistente,
        activo: activo
      };

      const actualizado = await SucursalModel.actualizar(id, datos);
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: { message: error.message || 'Error al cambiar el estado de la sucursal' } });
    }
  }

};

module.exports = sucursalController;
