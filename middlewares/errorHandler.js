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

module.exports = errorHandler;

