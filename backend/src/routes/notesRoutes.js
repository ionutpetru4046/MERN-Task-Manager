const express = require("express");
const {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
} = require("../controllers/notesController.js");

const router = express.Router();

router.get("/", getAllNotes); // GET
router.get("/:id", getNoteById); // GET
router.post("/", createNote); // POST
router.put("/:id", updateNote); // PUT
router.delete("/:id", deleteNote); // DELETE

module.exports = router;
