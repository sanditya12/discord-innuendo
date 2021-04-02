const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const keywordSchema = new Schema({
  word: {
    type: String,
    required: true,
  },
});

const Keyword = mongoose.model("Keyword", keywordSchema);

module.exports = Keyword;
