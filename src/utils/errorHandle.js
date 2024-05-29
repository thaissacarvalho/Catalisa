const customErrors = require("../constants/customError");

function handleError(res, errorCode) {
    const error = customErrors[errorCode];
    if (error) {
        res.status(error.code).json({ error: error.message });
    } else {
        res.status(500).json({ error: 'Erro desconhecido' });
    }
}

module.exports = handleError;