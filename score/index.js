const express = require("express");
const redis = require("redis");
const app = express();
const path = require("path");
const session = require("express-session");
let RedisStore = require("connect-redis").default;
const bodyParser = require("body-parser");
const { get } = require("http");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
let username = "essadanyya";
app.use(express.json()); // Middleware to parse JSON bodies
let client = redis.createClient({
  socket: {
    host: "localhost",
    port: 6379,
  },
  // Pour la reconnexion automatique
  autoResendUnfulfilledCommands: true,
  autoResubscribe: true,
});
let SessionClient = redis.createClient({
  socket: {
    host: "localhost",
    port: 6381,
  },
  // Pour la reconnexion automatique
  autoResendUnfulfilledCommands: true,
  autoResubscribe: true,
});
client.on("error", (err) => console.log("Redis Client Error", err));
client.connect().then(() => {
  console.log("Connected to Redis");
});
SessionClient.on("error", (err) => console.log("Redis Client Error", err));
SessionClient.connect().then(() => {
  console.log("Connected to Redis");
});
// initialize the user client
await client.hSet(`user-session:${username}`, {
  first_name: "Yassine",
  last_name: "Es-sadany",
  username: "essadanyya",
  score: 0,
  tries: 0,
});
app.use(
  session({
    store: new RedisStore({ client: SessionClient }),
    secret: "authentification-redis-secret",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return console.log(err);
    }
    res.redirect("http://localhost:9000");
  });
});

// get the data form redis
app.get("/getscore", (req, res) => {
  //const username = req.session.username;
  client.hGetAll(`user-session:${username}`).then((user) => {
    console.log("user : ", JSON.stringify(user));
    res.json({ score: 0, tries: 0 });
  });
});

// API to get score from the other service

app.post("/setscore", async (req, res) => {
  const received_data = req.body;
  const { score, tries } = received_data;
  //store the data in redis
  await client.hIncrBy(`user-session:${username}`, "score", score);
  await client.hIncrBy(`user-session:${username}`, "tries", tries);
  console.log("received_data : ", received_data);
});

// Endpoint to get scores
app.get("/", async (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
