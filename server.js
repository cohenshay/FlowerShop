//packages

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("client-sessions");
const mongoose = require("mongoose");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const nodemailer = require("nodemailer");
const async = require('async');
const flash = require('express-flash');


//models
require("./models/shop");
require("./models/user");
require("./models/flower");

//config and middlewares
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://localhost:27017/flowerShop",
  { useNewUrlParser: true }
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(
  session({
    cookieName: "session",
    secret: "shskjlhfd867696",
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000
  })
);

const storage = multer.diskStorage({
  destination: "public/images/",
  filename: function(req, file, callback) {
    crypto.pseudoRandomBytes(16, function(err, raw) {
      if (err) return callback(err);
      callback(null, file.originalname + path.extname(file.originalname));
    });
  }
});
const upload = multer({ storage: storage });

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

app.get("/accountDetails", async (req, res) => {
  const user = await User.findById(req.session.user._id);
  res.render("pages/accountDetails", { user,req });
});

app.get("/signIn", (req, res) => { 
  res.render("pages/signIn", { req });
});

//Forgot
app.get("/forgot", (req, res) => { 
  res.render("pages/forgot", { req });
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
        res.redirect(200, "/");
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






app.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {      
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {      
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {    
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },

    
    function(token, user, done) {      
      var smtpTransport = nodemailer.createTransport( {
        service: 'SendGrid',
        auth: {
          user: 'cohenshay',
          pass: 'pakobig1!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Node.js Password Reset',
        text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
          'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
          'http://' + req.headers.host + '/reset/' + token + '\n\n' +
          'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      
      smtpTransport.sendMail(mailOptions, function(err) {        
        req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
        done(err, 'done');
      });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

//Reset

app.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }  
    res.render("pages/reset", { req });
  });
});

app.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        user.save(function(err) {
          done(err, user);
        });
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport( {
        service: 'SendGrid',
        auth: {
          user: 'cohenshay',
          pass: 'pakobig1!'
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'passwordreset@demo.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
       req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/');
  });
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

    let newUser = new User({
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

app.post("/addFlower", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    console.log("No file received");
    return res.send({
      success: false
    });
  } else {
    console.log("file received");
    const host = req.host;
    const filePath = req.protocol + "://" + host + "/" + req.file.path;
    return res.send({
      filePath
    });
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
