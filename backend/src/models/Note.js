const mongoose = require("mongoose");

// first we create a schema
// second we create a model of that schema

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
); // createdAt, updatedAt

const Note = mongoose.model("Note", noteSchema);

module.exports = Note;
