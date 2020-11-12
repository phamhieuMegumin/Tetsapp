const mongoose = require("mongoose");
const TodosSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
  },
  {
    collection: "Todos",
  }
);

module.exports = mongoose.model("Todos", TodosSchema);
