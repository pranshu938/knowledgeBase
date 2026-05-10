import { Link, NavLink } from "react-router-dom";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-mark">KB</span>
          <span className="logo-text">KnowledgeBase AI</span>
        </Link>

        <button
          className="nav-toggle"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          ☰
        </button>

        <nav className={`nav-links ${open ? "nav-links-open" : ""}`}>
          <NavLink to="/" className="nav-link">
            Home
          </NavLink>
          <a href="#features" className="nav-link">
            Features
          </a>
          <a href="#how-it-works" className="nav-link">
            How it works
          </a>
          <a href="#pricing" className="nav-link">
            Pricing
          </a>
          <NavLink to="/login" className="nav-link nav-link-muted">
            Log in
          </NavLink>
          <NavLink to="/register" className="nav-cta">
            Get Started
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
