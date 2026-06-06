const express = require("express");
const checkAuth = require("../middleware/auth.middleware");
const { validate } = require("../middleware/validate");
const {
  createNoteSchema,
  updateNoteSchema,
  noteIdSchema,
} = require("../validation/note.validation");
const {
  createNote,
  getNotes,
  getNoteStats,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/notes.conroller");

const router = express.Router();

router.post("/", checkAuth, validate(createNoteSchema), createNote);
router.get("/", checkAuth, getNotes);
router.get("/stats", checkAuth, getNoteStats);

router.get(
  "/:id",
  checkAuth,
  validate(noteIdSchema, "params"),
  getNoteById
);
router.patch(
  "/:id",
  checkAuth,
  validate(noteIdSchema, "params"),
  validate(updateNoteSchema),
  updateNote
);
router.delete(
  "/:id",
  checkAuth,
  validate(noteIdSchema, "params"),
  deleteNote
);

module.exports = router;
