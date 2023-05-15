// Middleware measure performance
const measurePerformance = (req, res, next) => {
    const start = process.hrtime();

    res.on('finish', () => {
        const end = process.hrtime(start);
        const duration = end[0] * 1000 + end[1] / 1000000;
        console.log(`Endpoint ${req.method} ${req.url} completed in ${duration}ms`);
    });

    next();
};

module.exports = {
    measurePerformance,
};
