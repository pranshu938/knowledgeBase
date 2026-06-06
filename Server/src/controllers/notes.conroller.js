const mongoose = require("mongoose");
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

const getNoteStats = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user.userId);

  const [result] = await Note.aggregate([
    { $match: { userId } },
    {
      $facet: {
        totals: [
          {
            $group: {
              _id: null,
              totalNotes: { $sum: 1 },
              totalWords: {
                $sum: {
                  $size: {
                    $regexFindAll: {
                      input: { $ifNull: ["$content", ""] },
                      regex: /\S+/,
                    },
                  },
                },
              },
            },
          },
        ],
        uniqueTags: [
          { $unwind: "$tags" },
          { $match: { tags: { $ne: "" } } },
          { $group: { _id: { $toLower: "$tags" } } },
          { $count: "count" },
        ],
        recentNotes: [
          { $sort: { updatedAt: -1 } },
          { $limit: 5 },
          { $project: { title: 1, updatedAt: 1 } },
        ],
      },
    },
  ]);

  const totals = result?.totals?.[0] ?? {};

  res.set("Cache-Control", "no-store");
  res.status(200).json({
    stats: {
      totalNotes: totals.totalNotes ?? 0,
      totalWords: totals.totalWords ?? 0,
      uniqueTags: result?.uniqueTags?.[0]?.count ?? 0,
      recentNotes: result?.recentNotes ?? [],
    },
  });
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
    { new: true },
  ).lean();

  if (!note) return res.status(404).json({ message: "Note not found" });
  res.status(200).json({ note });
};

const deleteNote = async (req, res) => {
  const note = await Note.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  }).lean();

  if (!note) return res.status(404).json({ message: "Note not found" });
  res.status(200).json({ note });
};

module.exports = {
  createNote,
  getNotes,
  getNoteStats,
  getNoteById,
  updateNote,
  deleteNote,
};
