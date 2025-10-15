import mongoSanitize from "express-mongo-sanitize";

export const safeSanitize = (req, res, next) => {
  // Sanitize req.body and req.params only
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body);
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params);
  }

  // Skip req.query to avoid TypeError
  next();
};
