const validate = (schema, source = "body") => {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: result.error.issues.map((err) => ({
          path: err.path.join("."),
          message: err.message,
        })),
      });
    }

    // validated + cleaned data (e.g. trims, transforms, etc)
    req[source] = result.data;
    next();
  };
};

module.exports = {
  validate,
};
