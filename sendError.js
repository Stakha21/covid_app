export default function (err, res) {
  const errorMessage = err.message ? err.message : "Internal server error!";
  const statusCode = err.response?.status ? err.response?.status : 500;
  res.status(statusCode).send(errorMessage);
}
