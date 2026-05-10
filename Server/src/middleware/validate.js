const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        errors: result.error.errors.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // validated + cleaned data (e.g. trims, transforms, etc)
    req.body = result.data;
    next();
  };
};

module.exports = {
  validate,
};
