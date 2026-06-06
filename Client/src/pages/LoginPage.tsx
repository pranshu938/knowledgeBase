import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { login } from "../services/auth/login";
import { useNavigate } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (values: LoginFormValues) => {
    // TODO: yahan baad me backend login API call karenge
    try {
      await login(values);
      navigate("/app", { replace: true });
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">
          Log in to your KnowledgeBase AI account.
        </p>
        {error && (
          <div className="auth-error-banner">
            <AlertTriangle className="auth-error-icon" size={16} />
            <span className="auth-error-text">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="auth-field">
            <label className="auth-label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="auth-input"
              placeholder="you@example.com"
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
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="auth-error">{errors.password.message}</p>
            )}
          </div>

          <button type="submit" className="auth-submit" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="auth-footer-text">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
