const handleRespone = (res, statusCode, data) => {
  return res.status(statusCode).json(data);
};

module.exports = handleRespone;
