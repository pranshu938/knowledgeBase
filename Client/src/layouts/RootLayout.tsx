import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const RootLayout: React.FC = () => {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const element = document.getElementById(hash.slice(1));
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [hash, pathname]);

  return (
    <div className="app-root">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
