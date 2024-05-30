function simpleMiddleware(req, res, next) {
    console.log('Middleware funcionando!');
    next();
}

module.exports = simpleMiddleware;
  