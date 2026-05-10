const { z } = require("zod");

// POST /api/auth/register
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// POST /api/auth/login
const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email" }),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

module.exports = {
  registerSchema,
  loginSchema,
};
