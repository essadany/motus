const express = require("express");
const session = require("express-session");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const redis = require("redis");
let RedisStore = require("connect-redis").default;
let redisClient = redis.createClient({
  socket: {
    host: "localhost",
    port: 6381,
  },
  // Pour la reconnexion automatique
  autoResendUnfulfilledCommands: true,
  autoResubscribe: true,
});
redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.connect().then(() => {
  console.log("Connected to Redis");
});
const port = 9000;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: "authentification-redis-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

// Configurer les sessions
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 3600000, // 1 heure
    },
  })
);

redisClient.on("error", (err) => {
  console.log("Erreur Redis :", err);
});

// Routes
app.get("/", (req, res) => {
  res.sendFile("login.html", { root: "./public" });
});

app.get("/register", (req, res) => {
  res.sendFile("register.html", { root: "./public" });
});

// Route pour le login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  redisClient.hGetAll(username, (err, user) => {
    if (err) {
      return res.status(500).send("Erreur de serveur");
    }
    if (!user.username || user.password !== password) {
      return res
        .status(401)
        .send("Nom d'utilisateur ou mot de passe incorrect!");
    }
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect("http://localhost:3000");
  });
});

// Route pour l'enregistrement
app.post("/register", (req, res) => {
  const { firstname, lastname, username, password } = req.body;

  redisClient.hExists(username, "username", (err, exists) => {
    if (err) {
      return res.status(500).send("Erreur de serveur");
    }
    if (exists) {
      return res.status(400).send("Le nom d'utilisateur est déjà pris.");
    }
    redisClient.hSet(
      username,
      "firstname",
      firstname,
      "lastname",
      lastname,
      "username",
      username,
      "password",
      password,
      (err) => {
        if (err) {
          return res
            .status(500)
            .send("Erreur lors de l'enregistrement de l'utilisateur");
        }
        req.session.loggedin = true;
        req.session.username = username;
        res.send("Compte créé avec succès!");
      }
    );
  });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
