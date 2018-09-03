const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("client-sessions");
const User = require("./models/user");

let users = [
  new User("shay", "cohen", 33, 0),
  new User("gabi", "kashni", 32, 1),
  new User("ivgeny", "izenstat", 12, 2),
  new User("michele", "lablance", 37, 3),
  new User("alex", "razi", 33, 4),
  new User("noa", "gani", 55, 5)
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
// app.set('views', __dirname + '/views');

app.use(
  session({
    cookieName: "session",
    secret: "shskjlhfd867696",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

//Pages
app.get("/", function(req, res) {
  res.render('pages/index');
});

app.get("/contact", function(req, res) {
  res.render("pages/contact");
});

app.get("/shops", function(req, res) {
  res.render("pages/shops");
});

app.get("/users", function(req, res) {
  res.render("pages/users",{users});
});

app.get("/catalog", function(req, res) {
  res.render("pages/catalog");
});

app.get("/employees", function(req, res) {
  res.render("pages/employees");
});

// Login

app.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (!user) {
      res.render("login.jade", { error: "Invalid email or password." });
    } else {
      if (req.body.password === user.password) {
        // sets a cookie with the user's info
        req.session.user = user;
        res.redirect("/dashboard");
      } else {
        res.render("login.jade", { error: "Invalid email or password." });
      }
    }
  });
});

app.listen(8080);
