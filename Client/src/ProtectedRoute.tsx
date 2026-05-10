import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./lib/api";

export const ProtectedRoute = () => {
  const [ok, setOk] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;

    api
      .get("/me")
      .then(() => {
        if (alive) setOk(true);
      })
      .catch(() => {
        if (alive) setOk(false);
      });

    return () => {
      alive = false; // prevent state update after unmount
    };
  }, []);

  if (ok === null) return <div>Loading...</div>;

  return ok ? <Outlet /> : <Navigate to="/login" replace />;
};
