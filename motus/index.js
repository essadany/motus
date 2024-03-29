const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const redis = require("redis");
let RedisStore = require("connect-redis").default;
const axios = require("axios");
const bodyParser = require("body-parser");
const os = require("os");
const session = require("express-session");
const port = process.env.PORT || 3000; // Utilise la variable d'environnement PORT, ou 3000 par défaut
let score = 0;
let tries = 0;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
let SessionClient = redis.createClient({
  socket: {
    host: "localhost",
    port: 6381,
  },
  // Pour la reconnexion automatique
  autoResendUnfulfilledCommands: true,
  autoResubscribe: true,
});
SessionClient.on("error", (err) => console.log("Redis Client Error", err));
SessionClient.connect().then(() => {
  console.log("Connected to Redis");
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

//get the score from the score service
app.post("/getscore", async (req, res) => {
  const received_data = req.body;
  const { score, tries } = req.body;
  score = score;
  tries = tries;
});
app.get("/", (req, res) => {
  res.send("Hello World!");
  //console.log(req.session.username);
  //username = req.session.username;
});
const filePath = path.join(__dirname, "liste_francais_utf8.txt");
var getWordOfTheDay = (filteredWords) => {
  const date = new Date();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return filteredWords[(day + month + year) % filteredWords.length];
};

app.get("/readfile", (req, res) => {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la lecture du fichier");
    }

    const words = data.split(/\r?\n|\s/);

    const filteredWords = words.filter((word) => word.length > 0);

    res.json(filteredWords);
  });
});

app.post("/checkword", async (req, res) => {
  const userWord = req.body.word.toLowerCase(); // Get the word submitted by the user
  console.log("USERWORD : ", userWord);

  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la lecture du fichier");
    }

    const words = data.split(/\r?\n|\s/);
    const filteredWords = words.filter((word) => word.length > 0);
    const wordOfTheDay = getWordOfTheDay(filteredWords).toLowerCase();
    console.log(wordOfTheDay);

    let result = [];
    for (let i = 0; i < userWord.length; i++) {
      if (userWord[i] === wordOfTheDay[i]) {
        result.push({ letter: userWord[i], class: "correct" });
      } else if (wordOfTheDay.includes(userWord[i])) {
        result.push({ letter: userWord[i], class: "present" });
      } else {
        result.push({ letter: userWord[i], class: "absent" });
      }
    }

    if (userWord === wordOfTheDay) {
      score = 1;
    }
    console.log("SCORE : ", score);

    // Increment tries
    tries = 1;
    console.log("TRIES : ", tries);

    // Post score and tries to the score service
    try {
      const scoreResponse = await axios.post("http://localhost:5000/setscore", {
        score: score,
        tries: tries,
      });
      console.log(scoreResponse.data);

      // Combine both responses
      const finalResponse = {
        result: result, // Result of word check
        scoreData: scoreResponse.data, // Response from score service
      };

      // Send the combined response back to the client
      res.json(finalResponse);
      score = 0;
    } catch (error) {
      console.error("Error posting to score service:", error);
      res.status(500).json({
        error: "Erreur lors de la communication avec le service de score",
      });
    }
  });
});

app.get("/port", (req, res) => {
  const user = os.hostname(); // Récupère le nom d'utilisateur
  res.send(`MOTUS APP working on ${user} port ${port}`);
});
// PORT=3000 node index.js # Pour la première instance
// PORT=4000 node index.js # Pour la deuxième instance

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
