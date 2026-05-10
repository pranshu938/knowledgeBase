import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getNotes, type Note } from "../services/notes";
import { useToast } from "../toast/ToastProvider";

export default function NotesPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"updated" | "created" | "title">("updated");

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(data);
    } catch (e: any) {
      showToast({ title: "Error", type: "error", message: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleNotes = useMemo(() => {
    const q = query.trim().toLowerCase();

    let list = notes.filter((n) => {
      if (!q) return true;
      const hay = `${n.title ?? ""} ${n.content ?? ""}`.toLowerCase();
      return hay.includes(q);
    });

    if (sort === "title") {
      list = [...list].sort((a, b) =>
        (a.title || "").localeCompare(b.title || "")
      );
    } else if (sort === "created") {
      list = [...list].sort(
        (a, b) =>
          new Date(b.createdAt ?? 0).getTime() -
          new Date(a.createdAt ?? 0).getTime()
      );
    } else {
      list = [...list].sort(
        (a, b) =>
          new Date(b.updatedAt ?? 0).getTime() -
          new Date(a.updatedAt ?? 0).getTime()
      );
    }

    return list;
  }, [notes, query, sort]);

  return (
    <div className="notes-page">
      {/* Header (No New Note Button) */}
      <div className="notes-header">
        <div>
          <h1 className="notes-title">Notes</h1>
          <p className="notes-subtitle">Create a new note using the sidebar.</p>
        </div>
      </div>

      {/* Controls */}
      <div className="notes-controls">
        <div className="notes-controls-left">
          <div className="notes-control">
            <label className="notes-label">Sort</label>
            <select
              className="notes-select"
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
            >
              <option value="updated">Updated</option>
              <option value="created">Created</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>

        <div
          className="notes-controls-right"
          style={{ display: "flex", gap: 8 }}
        >
          <input
            className="notes-search"
            placeholder="Search notes…"
            aria-label="Search notes"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query.trim() ? (
            <button
              className="btn btn-ghost"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              Clear
            </button>
          ) : null}
        </div>
      </div>

      {loading ? (
        <div style={{ padding: 12 }}>Loading…</div>
      ) : visibleNotes.length === 0 ? (
        <div className="notes-empty">
          <div className="notes-empty-card">
            <h3>No notes yet</h3>
            <p>
              Click <b>+ New note</b> in the sidebar to start writing.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div style={{ padding: "0 2px 10px", opacity: 0.8, fontSize: 12 }}>
            Showing <b>{visibleNotes.length}</b> note
            {visibleNotes.length === 1 ? "" : "s"}
          </div>

          <div className="notes-grid">
            {visibleNotes.map((n) => (
              <article
                key={n._id}
                className="note-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/app/notes/${n._id}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") navigate(`/app/notes/${n._id}`);
                }}
                style={{ cursor: "pointer" }}
              >
                <div className="note-card-top">
                  <div className="note-card-main">
                    <h3 className="note-title">{n.title || "Untitled"}</h3>
                    <div className="note-meta">
                      Updated{" "}
                      {n.updatedAt
                        ? new Date(n.updatedAt).toLocaleString()
                        : "—"}
                    </div>
                  </div>
                </div>

                <p className="note-preview">
                  {(n.content || "").slice(0, 140) || "No content yet…"}
                </p>

                <div className="note-tags">
                  {(n.tags || []).slice(0, 6).map((t) => (
                    <span key={t} className="tag-chip">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
