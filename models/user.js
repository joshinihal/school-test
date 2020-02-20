var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student"
    }
  ]
});

exports.mongoose.model("user", userSchema);
