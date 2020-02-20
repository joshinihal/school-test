var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var session = require("express-session");
var methodOverride = require("method-override");
var User = require("./models/user.js");
var Student = require("./models/student.js");
app.use(methodOverride("_method"));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(session({ secret: "xyz" }));

const uri =
  "mongodb+srv://user:1234@cluster0-k18a8.mongodb.net/mytestdb?retryWrites=true&w=majority";

mongoose.connect(uri, { useNewUrlParser: true });

var db = mongoose.connection;
console.log(db);
db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/logout", function(req, res) {
  req.session.user_id = null;
  res.render("login");
});

app.post("/loginsuccess", function(req, res) {
  var loggedEmail = req.body.email;
  var loggedPassword = req.body.password;
  User.findOne({ email: loggedEmail, password: loggedPassword }, function(
    err,
    user
  ) {
    if (err) {
      console.log(err);
    } else {
      if (user != null) {
        req.session.user_id = user._id;
        console.log(req.session.user_id);
        res.redirect("/students");
      } else {
        res.redirect("/login");
      }
    }
  });
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/registersuccess", function(req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var newUser = { email: email, password: password };
  User.create(newUser, function(err, user) {
    if (err) {
      console.log(err);
    } else {
      console.log("created new user");
      console.log(user);
    }
  });
  res.redirect("/login");
});

app.get("/students", function(req, res) {
  User.find({ _id: req.session.user_id })
    .populate("students")
    .exec(function(err, user) {
      if (err) {
        console.log(err);
      } else {
        console.log(user);
        res.render("index", { user: user[0] });
      }
    });
});

app.post("/students", function(req, res) {
  var name = req.body.name;
  var date = req.body.date;
  var school = req.body.school;
  var classNumber = req.body.classNumber;
  var division = req.body.division;
  var status = req.body.status;
  console.log("Session is");
  console.log(req.session.user_id);
  var newStudent = {
    name: name,
    date: date,
    school: school,
    class: classNumber,
    division: division,
    status: status
  };

  Student.create(newStudent, function(err, student) {
    if (err) {
      console.log(err);
    } else {
      console.log("created new student");
      console.log(student);
      User.findOne({ _id: req.session.user_id }, function(err, foundUSer) {
        if (err) {
          console.log(err);
        } else {
          console.log(foundUSer);
          foundUSer.students.push(student);
          foundUSer.save(function(err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log(data);
            }
          });
        }
      });
    }
  });
});

app.get("/students/new", function(req, res) {
  res.render("new.ejs");
});

app.get("/students/:id/edit", function(req, res) {
  console.log("put req");
  var myId = req.params.id;
  console.log(myId);
  Student.findById(req.params.id, function(err, foundstudent) {
    if (err) {
      console.log(err);
    } else {
      console.log(foundstudent);
      res.render("update.ejs", { student: foundstudent });
    }
  });
});

app.put("/students/:id", function(req, res) {
  console.log("put req");
  var schoolid = req.body._id;
  var name = req.body.name;
  var date = req.body.date;
  var school = req.body.school;
  var classNumber = req.body.classNumber;
  var division = req.body.division;
  var status = req.body.status;

  var updatedStudent = {
    name: name,
    date: date,
    school: school,
    class: classNumber,
    division: division,
    status: status
  };

  console.log(updatedStudent);
  Student.findByIdAndUpdate(schoolid, updatedStudent, { new: true }, function(
    err,
    student
  ) {
    if (err) {
      console.log(err);
    } else {
      console.log("updated student");
      console.log(student);
    }
  });
});

app.delete("/destroy/:id", function(req, res) {
  Student.findByIdAndRemove(req.params.id, (err, tasks) => {
    if (err) {
      console.log(err);
    } else {
      console.log(" successfully deleted");
    }
  });
});

app.listen(process.env.PORT, process.env.IP, function() {
  console.log("Project has started");
});
