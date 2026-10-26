// One log line per request: METHOD /path STATUS 12ms
// Query strings are dropped and the one-time Google session id in the path is
// masked, so tokens never end up in the logs.
function requestLogger(req, res, next) {
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const ms = Number(process.hrtime.bigint() - start) / 1e6;
    const path = req.originalUrl.split('?')[0].replace(/^(\/auth\/google\/session\/).+$/, '$1***');
    console.log(`${req.method} ${path} ${res.statusCode} ${ms.toFixed(0)}ms`);
  });
  next();
}

module.exports = { requestLogger };