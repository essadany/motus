const express = require("express");
const app = express();
const port = process.env.PORT || 9000;
const cookieParser = require("cookie-parser");
const path = require("path");
const store = require("store2");
const jwt = require("jsonwebtoken");
const redis = require("redis");
require("dotenv").config();
const cors = require("cors");
app.use(cors());
app.use("/", express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// create redis client
let client = redis.createClient({
  host: "localhost",
  port: 6380,

});
client.on("connect", function () {
  console.log("Connected to Redis...");
}
);
client.on("error", function (err) {
  console.log("Error " + err);
}
);
client.hSet("test", "firstname", "test", "lastname", "test", "username", "test", "password", "test");

// a variable to save a session

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1800s",
  });
}

//Handle the 404 error and change the url with the /autorize route.

app.get("*", (req, res, next) => {
  if (
    (req.query.client_id != process.env.CLIENT_ID) &
    (req.query.scope != "motus_app")
  ) {
    console.log("Non authorized to go here");
    res.status(403).send("Error 403 : non authorized");
  } else {
    next();
  }
});

app.get("/authorize", (req, res, next) => {
  res.sendFile("/login.html", { root: __dirname + "/public" });
});

app.post("/authorize", (req, res) => {
  var check = false;
  client.hGetAll(req.body.username, (err, user) => {
    if (user && user.password === req.body.password) {
      check = true;
    }
    if (check) {
      // Generate a token for the user
      const access_token = generateAccessToken({ username: req.body.username });
      console.log(access_token);
      console.log(req.query.redirect_uri);
      res.status(302).redirect(req.query.redirect_uri + "?token=" + access_token);
      res.redirect("http://localhost:3000/");
      res.send(`Hey there, welcome <a href=\'/logout'>click to logout</a>`);
    } else {
      res.send("Invalid username or password");
    }
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/register", (req, res) => {
  res.sendFile("/register.html", { root: __dirname + "/public" });
});

app.post("/register", (req, res) => {
  var check = false;
  client.hGetAll(req.body.username, (err, user) => {
    if (user) {
      check = true;
    }
    if (check) {
      res.status(201).json({
        erreur: "Il existe déjà cet username",
      });
    } else {
      if (req.body.password != req.body.password2) {
        res.status(201).json({
          erreur: "Mauvais mot de passe pour cette session",
        });
      } else {
        client.hmset(req.body.username, {
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          password: req.body.password,
        });
        console.log(client.hgetall(req.body.username));
        var urlconnexion =
          req.protocol +
          "://" +
          req.get("host") +
          "/authorize?client_id=" +
          req.query["client_id"] +
          "&scope=" +
          req.query["scope"] +
          "&redirect_uri=" +
          req.query["redirect_uri"];
        res.status(201).json({
          message: "Vous pouvez vous connecter ",
          Clique_Here: urlconnexion,
        });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
