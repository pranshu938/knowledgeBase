import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getNoteById, updateNote, type Note } from "../services/notes";
import { useToast } from "../toast/ToastProvider";

function useDebouncedCallback<T extends any[]>(
  cb: (...args: T) => void,
  delayMs: number
) {
  const t = useRef<number | null>(null);

  return (...args: T) => {
    if (t.current) window.clearTimeout(t.current);
    t.current = window.setTimeout(() => cb(...args), delayMs);
  };
}

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const [note, setNote] = useState<Note | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsText, setTagsText] = useState(""); // comma-separated
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    (async () => {
      setLoading(true);
      try {
        const n = await getNoteById(id);
        setNote(n);
        setTitle(n.title ?? "Untitled");
        setContent(n.content ?? "");
        setTagsText((n.tags ?? []).join(", "));
      } catch (e: any) {
        showToast({
          type: "error",
          title: "Error",
          message: e.message || "Failed to load note",
        });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const tags = useMemo(() => {
    return tagsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
  }, [tagsText]);

  const doAutosave = useDebouncedCallback(async () => {
    if (!id) return;
    setSaving(true);
    setSaveError(null);

    try {
      const updated = await updateNote(id, {
        title: title || "Untitled",
        content,
        tags,
      });
      setNote(updated);
      setLastSavedAt(new Date().toLocaleTimeString());
    } catch (e: any) {
      setSaveError(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  }, 700);

  // autosave when user edits
  useEffect(() => {
    if (!note) return;
    doAutosave();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tagsText]);

  const wordCount = useMemo(() => {
    const text = content.trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }, [content]);

  if (loading) {
    return <div style={{ padding: 12 }}>Loading note…</div>;
  }

  if (!note) {
    return (
      <div style={{ padding: 12 }}>
        <button
          className="btn btn-ghost"
          onClick={() => navigate("/app/notes")}
        >
          ← Back
        </button>
        <div style={{ marginTop: 12 }}>Note not found.</div>
      </div>
    );
  }

  return (
    <div className="editor-shell">
      {/* Top bar */}
      <div className="editor-topbar">
        <div className="editor-topbar-left">
          <button
            className="btn btn-ghost"
            onClick={() => navigate("/app/notes")}
          >
            ← Notes
          </button>

          <div className="editor-status">
            {saving ? (
              <span className="editor-pill">Saving…</span>
            ) : saveError ? (
              <span className="editor-pill editor-pill-danger">
                Save failed
              </span>
            ) : (
              <span className="editor-pill">
                {lastSavedAt ? `Saved at ${lastSavedAt}` : "Saved"}
              </span>
            )}
          </div>
        </div>

        <div className="editor-topbar-right">
          <span className="editor-metric">{wordCount} words</span>
          <button className="btn btn-primary" disabled>
            ✨ AI (soon)
          </button>
        </div>
      </div>

      <div className="editor-grid">
        {/* Main editor */}
        <section className="editor-main">
          <input
            className="editor-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
          />

          <textarea
            className="editor-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing… (autosave is ON)"
          />
        </section>

        {/* Right panel */}
        <aside className="editor-side">
          <div className="editor-card">
            <div className="editor-card-title">Tags</div>
            <input
              className="editor-input"
              value={tagsText}
              onChange={(e) => setTagsText(e.target.value)}
              placeholder="e.g. react, dsa, work"
            />
            <div className="editor-help">Comma separated</div>
          </div>

          <div className="editor-card">
            <div className="editor-card-title">Uploads (next)</div>
            <div className="editor-muted">
              You’ll attach PDFs/images to this note here. For now, use the
              Uploads page.
            </div>

            <button
              className="btn btn-ghost"
              onClick={() => navigate("/app/uploads")}
            >
              Go to Uploads →
            </button>
          </div>

          <div className="editor-card">
            <div className="editor-card-title">AI Actions (next)</div>
            <div className="editor-muted">
              Summarize, generate flashcards, and ask questions from this note.
            </div>
            <button className="btn btn-ghost" disabled>
              Summarize (soon)
            </button>
            <button className="btn btn-ghost" disabled>
              Generate Q&A (soon)
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
