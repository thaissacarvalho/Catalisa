const customErrors = require('../utils/customErrors');

const errorHandler = (err, req, res, next) => {
  if (!err.status || !customErrors[err.status]) {
    // Se não for um erro conhecido, retorna um erro genérico
    res.status(error.code).json(error.message);
  } else {
    // Retorna o erro personalizado
    const error = customErrors[err.status];
    res.status(error.code).json({ error: error.message });
  }
};

module.exports = errorHandler;
