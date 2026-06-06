const express = require("express");
const checkAuth = require("../middleware/auth.middleware");
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/notes.conroller");

const router = express.Router();

router.post("/", checkAuth, createNote);
router.get("/", checkAuth, getNotes);

router.get("/:id", checkAuth, getNoteById);
router.patch("/:id", checkAuth, updateNote);
router.delete("/:id", checkAuth, deleteNote);

module.exports = router;
