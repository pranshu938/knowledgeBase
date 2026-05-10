const Note = require("../models/note.model");

const createNote = async (req, res) => {
  const { title = "Untitled", content = "", tags = [] } = req.body;

  const note = await Note.create({
    userId: req.user.userId,
    title,
    content,
    tags,
  });

  res.status(201).json({ note });
};

const getNotes = async (req, res) => {
  const notes = await Note.find({ userId: req.user.userId })
    .sort({ updatedAt: -1 })
    .lean();
  res.set("Cache-Control", "no-store");
  res.status(200).json({ notes });
};

const getNoteById = async (req, res) => {
  const note = await Note.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  }).lean();

  if (!note) return res.status(404).json({ message: "Note not found" });
  res.status(200).json({ note });
};

const updateNote = async (req, res) => {
  const { title, content, tags } = req.body;

  const note = await Note.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    {
      ...(title !== undefined ? { title } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(tags !== undefined ? { tags } : {}),
    },
    { new: true }
  ).lean();

  if (!note) return res.status(404).json({ message: "Note not found" });
  res.status(200).json({ note });
};

module.exports = { createNote, getNotes, getNoteById, updateNote };
