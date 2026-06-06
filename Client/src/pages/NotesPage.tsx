import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Plus, Trash2 } from "lucide-react";
import {
  createNote,
  deleteNote,
  getNotes,
  type Note,
} from "../services/notes";
import { useToast } from "../toast/ToastProvider";

export default function NotesPage() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [noteToDelete, setNoteToDelete] = useState<Note | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [creating, setCreating] = useState(false);
  const [duplicatingId, setDuplicatingId] = useState<string | null>(null);

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

  const handleDelete = async () => {
    if (!noteToDelete) return;

    try {
      setDeleting(true);
      await deleteNote(noteToDelete._id);
      setNotes((current) =>
        current.filter((item) => item._id !== noteToDelete._id)
      );
      setNoteToDelete(null);
      showToast({
        title: "Deleted",
        type: "success",
        message: "Note deleted successfully.",
      });
    } catch (e: any) {
      showToast({ title: "Error", type: "error", message: e.message });
    } finally {
      setDeleting(false);
    }
  };

  const handleCreate = async () => {
    try {
      setCreating(true);
      const note = await createNote({});
      navigate(`/app/notes/${note._id}`);
    } catch (e: any) {
      showToast({ title: "Error", type: "error", message: e.message });
    } finally {
      setCreating(false);
    }
  };

  const handleDuplicate = async (note: Note) => {
    try {
      setDuplicatingId(note._id);
      const duplicate = await createNote({
        title: `${note.title || "Untitled"} Copy`,
        content: note.content || "",
        tags: note.tags || [],
      });

      showToast({
        title: "Duplicated",
        type: "success",
        message: "Note copied successfully.",
      });
      navigate(`/app/notes/${duplicate._id}`);
    } catch (e: any) {
      showToast({ title: "Error", type: "error", message: e.message });
    } finally {
      setDuplicatingId(null);
    }
  };

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
        <div className="notes-grid" aria-label="Loading notes">
          {Array.from({ length: 4 }).map((_, index) => (
            <article className="note-card note-card-skeleton" key={index}>
              <div className="note-card-top">
                <div className="note-card-main">
                  <div className="skeleton-line skeleton-title" />
                  <div className="skeleton-line skeleton-meta" />
                </div>
                <div className="skeleton-icon" />
              </div>

              <div className="skeleton-preview">
                <div className="skeleton-line" />
                <div className="skeleton-line skeleton-short" />
              </div>

              <div className="note-tags">
                <div className="skeleton-chip" />
                <div className="skeleton-chip skeleton-chip-short" />
              </div>
            </article>
          ))}
        </div>
      ) : visibleNotes.length === 0 ? (
        <div className="notes-empty">
          <div className="notes-empty-card">
            <h3>No notes yet</h3>
            <p>
              Start with a blank note and build your knowledge base from
              there.
            </p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleCreate}
              disabled={creating}
            >
              <Plus size={16} />
              <span>{creating ? "Creating..." : "Create first note"}</span>
            </button>
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
                  <div className="note-actions">
                    <button
                      type="button"
                      className="btn btn-ghost note-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDuplicate(n);
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                      }}
                      disabled={duplicatingId === n._id}
                      aria-label={`Duplicate ${n.title || "Untitled"}`}
                      title="Duplicate note"
                    >
                      <Copy size={16} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger-ghost note-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNoteToDelete(n);
                      }}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                      }}
                      aria-label={`Delete ${n.title || "Untitled"}`}
                      title="Delete note"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
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

      {noteToDelete ? (
        <div
          className="modal-backdrop"
          role="presentation"
          onClick={() => {
            if (!deleting) setNoteToDelete(null);
          }}
        >
          <div
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-note-title"
            aria-describedby="delete-note-description"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="confirm-modal-icon" aria-hidden="true">
              <Trash2 size={22} />
            </div>
            <div className="confirm-modal-body">
              <h3 id="delete-note-title">Delete note?</h3>
              <p id="delete-note-description">
                This will permanently delete{" "}
                <strong>{noteToDelete.title || "Untitled"}</strong>. This
                action cannot be undone.
              </p>
            </div>
            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setNoteToDelete(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete note"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
