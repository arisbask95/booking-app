// Central error handler: services throw Error objects with a `.status`,
// controllers just re-throw via next(err), this turns them into JSON.
function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  if (status === 500) {
    console.error(err);
  }
  res.status(status).json({ error: err.message || "internal server error" });
}

module.exports = errorHandler;
