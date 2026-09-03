const OK = (res, message = "Success", data = null) => {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
};

const Created = (res, message = "Created", data = null) => {
  return res.status(201).json({
    success: true,
    message,
    data
  
  });
};

const NoContent = (res) => {
  return res.status(204).send();
};

const BadRequest = (res, message = "Bad Request") => {
  return res.status(400).json({
    success: false,
    message,
  });
};

const Unauthorized = (res, message = "Unauthorized") => {
  return res.status(401).json({
    success: false,
    message,
  });
};

const Forbidden = (res, message = "Forbidden") => {
  return res.status(403).json({
    success: false,
    message,
  });
};

const NotFound = (res, message = "Not Found") => {
  return res.status(404).json({
    success: false,
    message,
  });
};

const AlreadyExist = (res, message = "Already Exists") => {
  return res.status(409).json({
    success: false,
    message,
  });
};

const ValidationError = (res, errors = []) => {
  return res.status(422).json({
    success: false,
    message: "Validation Failed",
    errors,
  });
};

const TooManyRequests = (res, message = "Too Many Requests") => {
  return res.status(429).json({
    success: false,
    message,
  });
};

const InternalServerError = (
  res,
  message = "Internal Server Error",
  error = null
) => {
  return res.status(500).json({
    success: false,
    message,
    error: error?.message || null,
  });
};

export {
  OK,
  Created,
  NoContent,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
  AlreadyExist,
  ValidationError,
  TooManyRequests,
  InternalServerError,
};