const errorHandler = (err, req, res, next) => {
    console.error('Error capturado:', err);

    // Si el error tiene un status asignado, lo usamos, si no, 500
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    res.status(statusCode).json({
        error: message,
        status: statusCode
    });
};

const validateId = (paramName = 'id') => (req, res, next) => {
    const value = req.params[paramName];
    if (!/^[1-9]\d*$/.test(value) || Number(value) > 2147483647) {
        const error = new Error(`El parámetro ${paramName} debe ser un número entero positivo`);
        error.statusCode = 400;
        return next(error);
    }
    next();
};

module.exports = { errorHandler, validateId };

