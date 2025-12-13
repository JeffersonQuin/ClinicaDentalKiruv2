const jwt = require("jsonwebtoken");
const util = require('util');

const jwtVerify = util.promisify(jwt.verify);

module.exports = {
  verificatoken: async (req, res, next) => {
    try {
      let token = req.get("authorization");
      
      if (!token) {
        return res.status(403).json({
          success: 0,
          message: "No existe Token"
        });
      }

      token = token.slice(7);
      const decoded = await jwtVerify(token, process.env.SECRET);
      req.decoded = decoded;
      next();
    } catch (err) {
      return res.status(403).json({
        success: 0,
        message: "Token Invalido"
      });
    }
  }
};