const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("client-sessions");
const User = require("./models/user");
const Shop = require("./models/shop");
const Flower = require("./models/flower");

const imagesPrefix = "images/"

let userCounter = 0;

let users = [
  new User(userCounter++,"shay", "cohen","herzeliya, hakesem 6" ,"shaycohen@gmail.com" ,"+972534296062", "admin", "shaycohen", "1234"),
  new User(userCounter++,"gabi", "kashani","kfar sava, giborim 19" ,"gabikashani@gmail.com","+972545896025", "employee", "gabikashani", "1234","1"),
  new User(userCounter++,"ivgeny", "izenstat","nes-tziona, nahshon 11" , "ivgenyizenstat@gmail.com","+972544568796", "user", "ivgenyizenstat", "1234"),
  new User(userCounter++,"michele", "lablance","natanya, haprahim 66" ,  "michelelablance@gmail.com","+972545556632", "user", "michelelablance", "1234"),
  new User(userCounter++,"alex", "razi","hod-hasharon, narkis 20" ,  "alexrazi@gmail.com","+972545489632", "user", "alexrazi", "1234"),
  new User(userCounter++,"maayan", "sharif","afula, tut 26" ,  "maayansharif@gmail.com","+972547896541", "user", "maayansharif", "1234"),
  new User(userCounter++,"sagi", "cohen","bnei-brak, shevet 20" ,  "sagicohen@gmail.com","+972546663547", "user", "sagicohen", "1234"),
  new User(userCounter++,"nir", "buktus","raanana, gezer 47" ,  "@gmail.com","+972541234567", "user", "nirbuktus", "1234"),
  new User(userCounter++,"shalom", "frid","hod-hasharon, ginunim 2" ,  "@gmail.com","+972549856985", "user", "shalomfrid", "1234"),
  new User(userCounter++,"noa", "gani","tel-aviv, birenboim 1",  "@gmail.com","+972545478932", "user", "noagani", "1234")
];

let shopCounter = 1;

let shops = [
  new Shop("balizer", "tel-aviv",shopCounter++),
  new Shop("zer4u", "herzeliya",shopCounter++),
  new Shop("flowers", "raanana",shopCounter++),
  new Shop("alydafna", "ramat-gan",shopCounter++),
  new Shop("perah", "jerusalem",shopCounter++),
  new Shop("zer", "kfar-sava",shopCounter++)
];

let flowers = [
  new Flower("Spring Delight",150,imagesPrefix+"200_cs0_4ae586037084c14e0638da297d434257.jpg"),
  new Flower("Van Gogh", 100,imagesPrefix+"200_cs0_ee6e21f61f419c3ded10fdfb62151024.jpg"),
  new Flower("Ruby Red", 239,imagesPrefix+"200_cs0_d408fad945075d2a6fc77d0ca72c3b9d.jpg"),
  new Flower("White Dove", 250,imagesPrefix+"200_cs0_b709e120a5f7d989d2e567ff15e1d243.jpg"),
  new Flower("Blooming Summer", 85,imagesPrefix+"200_cs0_a71c40a4546bd44a338c364300404272.jpg"),
  new Flower("Pink Melody",149, imagesPrefix+"200_cs0_af64307136a5ba2846813bd301bb073e.jpg"),
  new Flower("Pink Tracery",155, imagesPrefix+"200_cs0_3b5aa72489124b9f414e36b075da083e.jpg"),
  new Flower("White Fantasy",145, imagesPrefix+"200_cs0_a05b04abbd7590bf2aba834a7d56198d.jpg"),
  new Flower("Spectacular bouquet of purple shades",150,imagesPrefix+"200_cs0_edfa55a4ed71f9afa21c8ed7bbf6a930.jpg"),
  
];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

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
  res.render("pages/index", { req });
});

app.get("/contact", function(req, res) {
  res.render("pages/contact", { req });
});

app.get("/about", function(req, res) {
  res.render("pages/about", { req });
});

app.get("/shops", function(req, res) {
    const user = checkSession(req, res);
    if (user!=null && user.type=="admin") {
      res.render("pages/shops", { shops, req });
    }
    else res.status(401).redirect("/");
});

app.get("/users", function(req, res) {
    const user = checkSession(req, res);
    if (user!=null && user.type!="user") {
      res.render("pages/users", { users, req });
    }
});

app.get("/catalog", function(req, res) {
  if (checkSession(req, res)) {
    res.render("pages/catalog", {flowers, req });
  }
});

app.get("/employees", function(req, res) {
    const user = checkSession(req, res);
    if (user!=null && user.type=="admin") {
        res.render("pages/employees", { users, req });
    }
});

// Login
app.get("/login", function(req, res) {
  res.render("pages/login", { req });
});

//Update
app.put("/updateUser", function(req, res) {
    
    let oldUser = users.find(x=>x.id==req.body.id);
    const {fname, lname, address,email,contact,type} = req.body;

    if (oldUser)
    {
        for (var i in users) {
            if (users[i].id == req.body.id) {
                users[i].fname = fname;
                users[i].lname = lname;
                users[i].address = address;
                users[i].email = email;
                users[i].contact = contact;
                users[i].type = type;
               break; 
            }
          }

        res.status(200).send();
    }
    res.status(404).send();
});

//DELETE
app.delete("/deleteUser", function(req, res) {
    
    let currentUser = users.find(x=>x.id==req.body.id);
    const index = users.indexOf(currentUser);
    const {id} = req.body;

    if (currentUser)
    {
        users.splice(index,1);

        res.status(200).send();
    }
    res.status(404).send();
});

//ADD
app.post("/addUser", function(req, res) {
    
   
    const {fname, lname, address,email,contact,type,username,password} = req.body;
    const newUser = new User(userCounter++,fname,lname, address,email,contact,type,username,password);

   
       users.push(newUser)

        res.status(200).send();
    
   
});


app.post("/login", (req, res) => {    
  const currentUser = users.find(x => x.username == req.body.username);
  if (!currentUser) {
    res.status(422).render("pages/index", { error: "Invalid user", req });
  } else {
    if (req.body.password === currentUser.password) {
      // sets a cookie with the user's info
      req.session.user = currentUser;
      res.redirect("/", 200);
      //   res.render("pages/index",{req});
    } else {
      res
        .status(422)
        .render("pages/index", { error: "Invalid password.", req });
    }
  }
});

//logout
app.get("/logout", function(req, res) {
  req.session.reset();
  res.render("pages/index", { req });
});

//helpers

const checkSession = (req, res) => {
  let currentUser=null;
  if (req.session && req.session.user) {
    // Check if session exists

    currentUser = users.find(x => x.id == req.session.user.id);
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
};

app.listen(8080);
