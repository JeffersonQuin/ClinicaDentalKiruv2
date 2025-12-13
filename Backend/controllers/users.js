const jwt = require('jsonwebtoken');
const util = require('util');
const userModel = require('../models/users');

const jwtSign = util.promisify(jwt.sign);

module.exports = {
  listado: async (req, res) => {
    try {
      const results = await userModel.listado();
      return res.status(200).json({
        success: 1,
        data: results
      });
    } catch (err) {
      console.error('Error en listado:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener usuarios'
      });
    }
  },

  obtenerPorId: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userModel.obtenerPorId(id);
      
      if (!user) {
        return res.status(404).json({
          success: 0,
          message: 'Usuario no encontrado'
        });
      }

      return res.status(200).json({
        success: 1,
        data: user
      });
    } catch (err) {
      console.error('Error en obtenerPorId:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al obtener el usuario'
      });
    }
  },

  crear: async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({
          success: 0,
          message: 'Username y password son requeridos'
        });
      }

      const userId = await userModel.crear(req.body);
      const userCreado = await userModel.obtenerPorId(userId);

      return res.status(201).json({
        success: 1,
        data: userCreado
      });
    } catch (err) {
      console.error('Error en crear:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al crear el usuario'
      });
    }
  },

  actualizar: async (req, res) => {
    try {
      const { id } = req.params;
      const { username, password, email, tipo, state } = req.body;

      if (!username && !password && !email && !tipo && !state) {
        return res.status(400).json({
          success: 0,
          message: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      if (tipo && !['CLIENT', 'DENTIST', 'ADMIN'].includes(tipo)) {
        return res.status(400).json({
          success: 0,
          message: 'Tipo inválido'
        });
      }

      const userExiste = await userModel.obtenerPorId(id);
      if (!userExiste) {
        return res.status(404).json({
          success: 0,
          message: 'Usuario no encontrado'
        });
      }

      await userModel.actualizar(id, req.body);
      const userActualizado = await userModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: userActualizado
      });
    } catch (err) {
      console.error('Error en actualizar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al actualizar el usuario'
      });
    }
  },

  eliminar: async (req, res) => {
    try {
      const { id } = req.params;

      const userExiste = await userModel.obtenerPorId(id);
      if (!userExiste) {
        return res.status(404).json({
          success: 0,
          message: 'Usuario no encontrado'
        });
      }

      await userModel.eliminar(id);

      return res.status(200).json({
        success: 1,
        message: 'Usuario eliminado correctamente'
      });
    } catch (err) {
      console.error('Error en eliminar:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al eliminar el usuario'
      });
    }
  },

  login: async (req, res) => {
    try {
      const body = req.body;
      const results = await userModel.verifica(body);

      if (results) {
        const token = await jwtSign(JSON.stringify(results), process.env.SECRET);
        return res.status(200).json({
          data: results,
          token: token
        });
      } else {
        return res.status(403).json({
          success: 0,
          message: 'Credenciales Erroneas'
        });
      }
    } catch (err) {
      console.error('Error en login:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error en la Base de Datos'
      });
    }
  },

  promocionarUsuario: async (req, res) => {
    try {
      const { id } = req.params;
      const { tipo, password } = req.body;

      if (!tipo || !password) {
        return res.status(400).json({
          success: 0,
          message: 'Tipo y password son requeridos'
        });
      }

      if (!['CLIENT', 'DENTIST', 'ADMIN'].includes(tipo)) {
        return res.status(400).json({
          success: 0,
          message: 'Tipo inválido'
        });
      }

      const userExiste = await userModel.obtenerPorId(id);
      if (!userExiste) {
        return res.status(404).json({
          success: 0,
          message: 'Usuario no encontrado'
        });
      }

      if (userExiste.password) {
        return res.status(400).json({
          success: 0,
          message: 'Usuario ya tiene contraseña asignada'
        });
      }

      await userModel.promocionarUsuario(id, req.body);
      const userPromovido = await userModel.obtenerPorId(id);

      return res.status(200).json({
        success: 1,
        data: userPromovido
      });
    } catch (err) {
      console.error('Error en promocionarUsuario:', err);
      return res.status(500).json({
        success: 0,
        message: 'Error al promocionar usuario'
      });
    }
  }
};