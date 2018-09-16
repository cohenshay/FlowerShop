//packages

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("client-sessions");
const mongoose = require("mongoose");

//models
require("./models/shop");
require("./models/user");
require("./models/flower");

//config and middlewares
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/flowerShop",{ useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.use(
  session({
    cookieName: "session",
    secret: "shskjlhfd867696",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

//model instances
const User = mongoose.model("users");
const Shop = mongoose.model("shops");
const Flower = mongoose.model("flowers");


//Pages
app.get("/", (req, res) => {
  res.render("pages/index", { req });
});

app.get("/contact", (req, res) => {
  res.render("pages/contact", { req });
});

app.get("/about", (req, res) => {
  res.render("pages/about", { req });
});

app.get("/shops", async (req, res) => {
  try {
    const user = await checkSession(req, res);
    if (user != null && user.type == "admin") {
      const shops = await Shop.find({});
      res.render("pages/shops", { shops, req });
    } else res.status(401).redirect("/");
  } catch (error) {
    console.log(error);
  }
});

app.get("/users", async (req, res) => {
  try {
    const user = await checkSession(req, res);
    if (user != null && user.type != "user") {
      const users = await User.find({});
      res.render("pages/users", { users, req });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/catalog", async (req, res) => {
  try {
    const user = await checkSession(req, res);
    if (user) {
      const flowers = await Flower.find({});
      res.render("pages/catalog", { flowers, req });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/employees", async (req, res) => {
  try {
    const user = await checkSession(req, res);
    if (user != null && user.type == "admin") {
      const users = await User.find({});
      res.render("pages/employees", { users, req });
    }
  } catch (error) {
    console.log(error);
  }
});

app.get("/login", (req, res) => {
  res.render("pages/login", { req });
});

// Login

app.post("/login", async (req, res) => {
  try {
    const currentUser = await User.findOne({ username: req.body.username });
    if (!currentUser) {
      res.status(422).render("pages/index", { error: "Invalid user", req });
    } else {
      if (req.body.password === currentUser.password) {
        // sets a cookie with the user's info
        req.session.user = currentUser;
        res.redirect(200,"/");
        //   res.render("pages/index",{req});
      } else {
        res
          .status(422)
          .render("pages/index", { error: "Invalid password.", req });
      }
    }
  } catch (error) {
    console.log(error);
  }
});

//Logout
app.get("/logout", (req, res) => {
  req.session.reset();
  res.render("pages/index", { req });
});

//UPDATE
app.put("/updateUser", async (req, res) => {
  try {
    let updatedUser = await User.findByIdAndUpdate(
      req.body.id,
      { $set: req.body },
      { new: true }
    );
    if (updatedUser) {
      res.status(200).send(updatedUser);
    }

    res.status(404).send();
  } catch (error) {
    console.log(error);
  }
});

//DELETE
app.delete("/deleteUser", async (req, res) => {
  try {
    let currentUser = await User.findByIdAndRemove(req.body.id);

    if (currentUser) {
      res.status(200).send(currentUser);
    }
    res.status(404).send();
  } catch (error) {
    console.log(error);
  }
});

//ADD
app.post("/addUser", async (req, res) => {
  try {
    const {
      fname,
      lname,
      address,
      email,
      contact,
      type,
      username,
      password
    } = req.body;

    const newUser = new User({
      fname,
      lname,
      address,
      email,
      contact,
      type,
      username,
      password
    });

    const existingUser = await User.findOne({ username });

    if (existingUser) res.status(409).send({ error: "user already exist" });
    else {
      newUser = await newUser.save();
      res.status(200).send(newUser);
    }
  } catch (error) {
    console.log(error);
  }
});



//helpers

const checkSession = async (req, res) => {
  let currentUser = null;
  try {
    if (req.session && req.session.user) {
      // Check if session exists

      currentUser = await User.findById(req.session.user._id);
      if (!currentUser) {
        // if the user isn't found, reset the session info and
        // redirect the user to the login page
        req.session.reset();
        res.render("pages/login", { req });
        return;
      }
    } else {
      req.session.reset();
      res.render("pages/login", { req });
      return;
    }
    return currentUser;
  } catch (error) {
    return currentUser;
  }
};

app.listen(8080);
