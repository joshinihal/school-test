var mongoose = require("mongoose");
var studentSchema = new mongoose.Schema({
  name: String,
  age: String,
  school: String,
  class: String,
  division: String,
  status: String
});

exports.mongoose.model("Student", studentSchema);
