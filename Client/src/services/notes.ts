import axios from "axios";
import api from "../lib/api";

export type Note = {
  _id: string;
  title: string;
  content?: string;
  tags?: string[];
  updatedAt?: string;
  createdAt?: string;
};

export type NoteStats = {
  totalNotes: number;
  totalWords: number;
  uniqueTags: number;
  recentNotes: Pick<Note, "_id" | "title" | "updatedAt">[];
};

export const getNotes = async (): Promise<Note[]> => {
  try {
    const res = await api.get("/notes");
    return res.data.notes as Note[];
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Failed to fetch notes");
  }
};

export const createNote = async (
  payload?: Partial<Pick<Note, "title" | "content" | "tags">>
): Promise<Note> => {
  try {
    const res = await api.post("/notes", payload ?? {});
    return res.data.note as Note;
  } catch (err: any) {
    throw new Error(err?.response?.data?.message || "Failed to create note");
  }
};

export async function getNoteById(id: string) {
  const res = await api.get(`/notes/${id}`);
  return res.data.note as Note;
}

export async function updateNote(
  id: string,
  payload: Partial<Pick<Note, "title" | "content" | "tags">>
) {
  const res = await api.patch(`/notes/${id}`, payload);
  return res.data.note as Note;
}

export async function deleteNote(id: string) {
  const res = await api.delete(`/notes/${id}`);
  return res.data.note as Note;
}

export async function getNoteStats(): Promise<NoteStats> {
  try {
    const res = await api.get("/notes/stats");
    return res.data.stats as NoteStats;
  } catch (err: unknown) {
    throw new Error(
      (axios.isAxiosError(err) && err.response?.data?.message) ||
        "Failed to load dashboard stats"
    );
  }
}
