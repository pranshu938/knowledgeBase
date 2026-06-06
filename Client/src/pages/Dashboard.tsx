import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  Tags,
  Text,
} from "lucide-react";
import {
  getNoteStats,
  type NoteStats,
} from "../services/notes";

const numberFormatter = new Intl.NumberFormat();

export default function DashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<NoteStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setStats(await getNoteStats());
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard stats"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  return (
    <div className="dashboard-page">
      <h2 className="page-title">Overview</h2>
      <p className="page-subtitle">
        A live snapshot of your personal knowledge base.
      </p>

      {loading ? (
        <DashboardSkeleton />
      ) : error ? (
        <div className="dashboard-error" role="alert">
          <div>
            <h3>Couldn&apos;t load your overview</h3>
            <p>{error}</p>
          </div>
          <button className="btn btn-primary" onClick={loadStats}>
            Try again
          </button>
        </div>
      ) : stats ? (
        <>
          <div className="dashboard-grid">
            <MetricCard
              icon={FileText}
              label="Total notes"
              value={stats.totalNotes}
              helper="Notes saved in your workspace"
            />
            <MetricCard
              icon={Text}
              label="Total words"
              value={stats.totalWords}
              helper="Words written across all notes"
            />
            <MetricCard
              icon={Tags}
              label="Unique tags"
              value={stats.uniqueTags}
              helper="Topics used to organize your notes"
            />
          </div>

          <section className="dashboard-recent">
            <div className="dashboard-section-header">
              <div>
                <h3>Recently updated</h3>
                <p>Your latest note activity</p>
              </div>
              <button
                type="button"
                className="dashboard-view-all"
                onClick={() => navigate("/app/notes")}
              >
                <span>View all</span>
                <ArrowRight size={15} />
              </button>
            </div>

            {stats.recentNotes.length > 0 ? (
              <div className="dashboard-recent-list">
                {stats.recentNotes.map((note) => (
                  <button
                    type="button"
                    className="dashboard-recent-item"
                    key={note._id}
                    onClick={() => navigate(`/app/notes/${note._id}`)}
                  >
                    <span className="dashboard-recent-icon">
                      <FileText size={17} />
                    </span>
                    <span className="dashboard-recent-copy">
                      <strong>{note.title || "Untitled"}</strong>
                      <small>
                        Updated{" "}
                        {note.updatedAt
                          ? new Date(note.updatedAt).toLocaleString()
                          : "recently"}
                      </small>
                    </span>
                    <ArrowRight
                      className="dashboard-recent-arrow"
                      size={17}
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="dashboard-recent-empty">
                <FileText size={22} />
                <p>Your recently updated notes will appear here.</p>
              </div>
            )}
          </section>
        </>
      ) : null}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
}: {
  icon: typeof FileText;
  label: string;
  value: number;
  helper: string;
}) {
  return (
    <div className="dashboard-card">
      <div className="dashboard-card-heading">
        <span className="dashboard-card-icon">
          <Icon size={18} />
        </span>
        <h3>{label}</h3>
      </div>
      <p className="dashboard-number">{numberFormatter.format(value)}</p>
      <p className="dashboard-muted">{helper}</p>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="dashboard-loading" aria-label="Loading overview">
      <div className="dashboard-grid">
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="dashboard-card dashboard-card-skeleton" key={index}>
            <div className="dashboard-skeleton-line dashboard-skeleton-label" />
            <div className="dashboard-skeleton-line dashboard-skeleton-value" />
            <div className="dashboard-skeleton-line dashboard-skeleton-helper" />
          </div>
        ))}
      </div>
      <div className="dashboard-recent dashboard-recent-skeleton">
        <div className="dashboard-skeleton-line dashboard-skeleton-heading" />
        {Array.from({ length: 3 }).map((_, index) => (
          <div className="dashboard-skeleton-row" key={index}>
            <div className="dashboard-skeleton-circle" />
            <div className="dashboard-skeleton-copy">
              <div className="dashboard-skeleton-line" />
              <div className="dashboard-skeleton-line dashboard-skeleton-short" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
