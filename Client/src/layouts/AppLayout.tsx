import React, { useEffect, useState, useRef } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bot,
  ChevronDown,
  FileText,
  FolderOpen,
  Plus,
  Settings,
} from "lucide-react";
import { logout } from "../services/auth/logout";
import { useToast } from "../toast/ToastProvider";
import { createNote } from "../services/notes";

function AppLayoutTopbarRight({ logout }: { logout: () => void }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="app-topbar-right">
      <input
        className="app-topbar-search"
        placeholder="Search (coming soon)…"
      />

      <div className="app-user-menu" ref={menuRef}>
        <button
          type="button"
          className="app-avatar-btn"
          onClick={() => setOpen(!open)}
        >
          <span className="app-avatar">P</span>
          <ChevronDown className="app-avatar-caret" size={14} />
        </button>

        {open && (
          <div className="app-user-dropdown">
            <button className="app-user-item">Profile</button>
            <button className="app-user-item">Settings</button>
            <button className="app-user-item app-user-logout" onClick={logout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const AppLayout: React.FC = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
      showToast({
        title: "Logged out",
        type: "success",
        message: "See you again!",
      });
    } catch (err) {}
  };
  const handleCreate = async () => {
    try {
      const note = await createNote({}); // backend defaults to "Untitled"
      navigate(`/app/notes/${note._id}`);
    } catch (e: any) {
      showToast({ title: "Error", type: "error", message: e.message });
    }
  };

  return (
    <div className="app-shell">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="app-sidebar-header">
          <div className="app-logo-circle">KB</div>
          <span className="app-logo-text">KB Workspace</span>
        </div>

        {/* Primary CTA */}
        <button className="app-sidebar-cta" onClick={handleCreate}>
          <Plus size={16} />
          <span>New note</span>
        </button>

        {/* Main navigation */}
        <div className="app-sidebar-section">
          <p className="app-sidebar-section-title">Main</p>
          <nav className="app-nav">
            <NavLink to="/app" end className="app-nav-link">
              <BarChart3 className="app-nav-icon" size={17} />
              <span>Overview</span>
            </NavLink>
            <NavLink to="/app/notes" className="app-nav-link">
              <FileText className="app-nav-icon" size={17} />
              <span>Notes</span>
            </NavLink>
            <NavLink to="/app/uploads" className="app-nav-link">
              <FolderOpen className="app-nav-icon" size={17} />
              <span>Uploads</span>
            </NavLink>
            <NavLink to="/app/chat" className="app-nav-link">
              <Bot className="app-nav-icon" size={17} />
              <span>AI Chat</span>
            </NavLink>
          </nav>
        </div>

        {/* Spaces / quick access */}
        <div className="app-sidebar-section">
          <p className="app-sidebar-section-title">Spaces</p>
          <div className="app-sidebar-chip-list">
            <button className="app-sidebar-chip app-sidebar-chip-active">
              All notes
            </button>
            <button className="app-sidebar-chip">DSA prep</button>
            <button className="app-sidebar-chip">React / Next</button>
            <button className="app-sidebar-chip">Job prep</button>
          </div>
        </div>

        <div className="app-sidebar-footer">
          <button className="app-sidebar-footer-btn">
            <Settings size={15} />
            <span>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="app-shell-main">
        {/* Top bar */}
        <header className="app-topbar">
          <div className="app-topbar-row">
            <div className="app-topbar-left">
              <h1 className="app-topbar-title">KnowledgeBase</h1>
              <p className="app-topbar-subtitle">
                Your private AI workspace for notes & PDFs.
              </p>
            </div>
            <AppLayoutTopbarRight logout={handleLogout} />
          </div>

          {/* 👇 Ye nav mobile pe dikhayenge, desktop pe hide rahega */}
          <nav className="app-topbar-nav">
            <NavLink to="/app" end className="app-topbar-nav-link">
              Overview
            </NavLink>
            <NavLink to="/app/notes" className="app-topbar-nav-link">
              Notes
            </NavLink>
            <NavLink to="/app/uploads" className="app-topbar-nav-link">
              Uploads
            </NavLink>
            <NavLink to="/app/chat" className="app-topbar-nav-link">
              AI Chat
            </NavLink>
          </nav>
        </header>

        <main className="app-shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
