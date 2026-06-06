import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { registerUser } from "../services/auth/register";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: RegisterFormValues) => {
    // TODO: yahan baad me backend register API call karenge
    try {
      setError(null);
      await registerUser({
        name: values.name,
        email: values.email,
        password: values.password,
      });
      navigate("/app", { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-subtitle">
          Start building your own AI-powered knowledge base.
        </p>
        {error && (
          <div className="auth-error-banner">
            <AlertTriangle className="auth-error-icon" size={16} />
            <span className="auth-error-text">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="name">
              Name
            </label>
            <input id="name" className="auth-input" {...register("name")} />
            {errors.name && <p className="auth-error">{errors.name.message}</p>}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              {...register("email")}
            />
            {errors.email && (
              <p className="auth-error">{errors.email.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="auth-input"
              {...register("password")}
            />
            {errors.password && (
              <p className="auth-error">{errors.password.message}</p>
            )}
          </div>

          <div className="auth-field">
            <label className="auth-label" htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="auth-input"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="auth-error">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
