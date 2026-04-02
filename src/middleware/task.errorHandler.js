function errorHandler(err, req, res, next){
    console.error(`[ERROR] ${req.method} ${req.path}`, err.message);

    if(err.code === 'P2002'){
        return res.status(409).json({
            success: false,
            error: 'A record with this value already exists',
        });
    }

    if(err.code === 'p2025'){
        return res.status(404).json({
            success: false,
            error: 'Record not found',
        });
    }

    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'production'
        ? 'Internal Server Error'
        : err.message,
    });
}

module.exports = errorHandler;