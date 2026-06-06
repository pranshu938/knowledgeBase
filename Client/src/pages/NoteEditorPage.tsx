import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
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

type SaveStatus = "ready" | "dirty" | "saving" | "saved" | "error";

export default function NoteEditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("ready");

  const [note, setNote] = useState<Note | null>(null);
  const lastSavedSnapshot = useRef("");
  const latestDraftSnapshot = useRef("");

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
        const loadedTitle = n.title ?? "Untitled";
        const loadedContent = n.content ?? "";
        const loadedTags = n.tags ?? [];

        setNote(n);
        setTitle(loadedTitle);
        setContent(loadedContent);
        setTagsText(loadedTags.join(", "));
        lastSavedSnapshot.current = JSON.stringify({
          title: loadedTitle,
          content: loadedContent,
          tags: loadedTags,
        });
        latestDraftSnapshot.current = lastSavedSnapshot.current;
        setLastSavedAt(null);
        setSaveStatus("ready");
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

  const doAutosave = useDebouncedCallback(
    async (
      payload: { title: string; content: string; tags: string[] },
      snapshot: string
    ) => {
      if (!id) return;
      setSaveStatus("saving");

      try {
        const updated = await updateNote(id, payload);
        setNote(updated);
        lastSavedSnapshot.current = snapshot;
        setLastSavedAt(new Date().toLocaleTimeString());
        setSaveStatus(
          latestDraftSnapshot.current === snapshot ? "saved" : "dirty"
        );
      } catch (e: any) {
        if (latestDraftSnapshot.current === snapshot) {
          setSaveStatus("error");
        }
      }
    },
    700
  );

  // autosave when user edits
  useEffect(() => {
    if (!note) return;

    const payload = {
      title: title || "Untitled",
      content,
      tags,
    };
    const snapshot = JSON.stringify(payload);

    if (snapshot === lastSavedSnapshot.current) return;

    latestDraftSnapshot.current = snapshot;
    setSaveStatus("dirty");
    doAutosave(payload, snapshot);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, content, tagsText]);

  const saveStatusLabel = useMemo(() => {
    if (saveStatus === "dirty") return "Unsaved changes";
    if (saveStatus === "saving") return "Saving...";
    if (saveStatus === "saved") {
      return lastSavedAt ? `Saved at ${lastSavedAt}` : "Saved";
    }
    if (saveStatus === "error") return "Save failed";
    return "Ready";
  }, [lastSavedAt, saveStatus]);

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
          <ArrowLeft size={16} />
          <span>Back</span>
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
            <ArrowLeft size={16} />
            <span>Notes</span>
          </button>

          <div className="editor-status">
            <span
              className={`editor-pill editor-pill-${saveStatus}`}
              title={saveStatus === "error" ? "Autosave failed" : undefined}
            >
              {saveStatusLabel}
            </span>
          </div>
        </div>

        <div className="editor-topbar-right">
          <span className="editor-metric">{wordCount} words</span>
          <button className="btn btn-primary" disabled>
            <Sparkles size={16} />
            <span>AI (soon)</span>
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
              <span>Go to Uploads</span>
              <ArrowRight size={16} />
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
