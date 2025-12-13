const DentistaEspecialidadModel = require('../models/dentistaEspecialidadModel');

const dentistaEspecialidadController = {

  listar: async (req, res) => {
    try {
      const data = await DentistaEspecialidadModel.listar();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al listar dentista-especialidad' } });
    }
  },

  obtenerPorDentista: async (req, res) => {
    try {
      const { dentista_id } = req.params;
      const data = await DentistaEspecialidadModel.obtenerPorDentista(dentista_id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al obtener especialidades del dentista' } });
    }
  },

  asignar: async (req, res) => {
    try {
      const { dentista_id, especialidad_id } = req.body;
      const nuevo = await DentistaEspecialidadModel.asignar(dentista_id, especialidad_id);
      res.status(201).json(nuevo);
    } catch (error) {
      res.status(400).json({ error: { message: 'Error al asignar especialidad al dentista' } });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { dentista_id, especialidad_id } = req.body;
      await DentistaEspecialidadModel.eliminar(dentista_id, especialidad_id);
      res.json({ message: 'Especialidad removida del dentista' });
    } catch (error) {
      res.status(500).json({ error: { message: 'Error al eliminar especialidad del dentista' } });
    }
  },

  reemplazarEspecialidades: async (req, res) => {
    try {
      const { dentista_id, especialidades } = req.body;
      if (!Array.isArray(especialidades)) {
        return res.status(400).json({ error: 'especialidades debe ser un array' });
      }

      await DentistaEspecialidadModel.eliminarTodas(dentista_id);

      for (const espId of especialidades) {
        await DentistaEspecialidadModel.asignar(dentista_id, espId);
      }

      res.json({ message: 'Especialidades actualizadas correctamente' });

    } catch (error) {
      res.status(500).json({ error: 'Error al reemplazar especialidades' });
    }
  }

};

module.exports = dentistaEspecialidadController;
