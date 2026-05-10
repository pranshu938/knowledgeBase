import React from "react";

const DashboardPage: React.FC = () => {
  return (
    <div>
      <h2 className="page-title">Overview</h2>
      <p className="page-subtitle">
        High-level look at your notes, uploads and AI activity.
      </p>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Total notes</h3>
          <p className="dashboard-number">0</p>
          <p className="dashboard-muted">
            Once you start creating notes, they&apos;ll show up here.
          </p>
        </div>
        <div className="dashboard-card">
          <h3>Uploaded documents</h3>
          <p className="dashboard-number">0</p>
          <p className="dashboard-muted">
            PDFs & docs you upload will be indexed for AI search.
          </p>
        </div>
        <div className="dashboard-card">
          <h3>AI conversations</h3>
          <p className="dashboard-number">0</p>
          <p className="dashboard-muted">
            Your chat history will appear once you talk to the AI.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
