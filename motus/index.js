const express = require('express')
const app = express()
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const bodyParser = require('body-parser');
const os = require('os');
const port = process.env.PORT || 3000; // Utilise la variable d'environnement PORT, ou 3000 par défaut
let score = 0;
let tries = 0;
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
  res.send('Hello World!')
})
const filePath = path.join(__dirname, 'liste_francais_utf8.txt');
var getWordOfTheDay = (filteredWords) => {
    const date = new Date();
    const day = date.getDate(); 
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return filteredWords[(day + month + year) % filteredWords.length];
}

app.get('/readfile', (req, res) => {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erreur lors de la lecture du fichier');
    }

    const words = data.split(/\r?\n|\s/);

    const filteredWords = words.filter(word => word.length > 0);

    res.json(filteredWords);
  });
});

app.post('/checkword', (req, res) => {
    const userWord = req.body.word.toLowerCase(); // Get the word submitted by the user
    console.log('USERWORD : ',userWord)
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Erreur lors de la lecture du fichier');
        }

        const words = data.split(/\r?\n|\s/);
        const filteredWords = words.filter(word => word.length > 0);
        const wordOfTheDay = getWordOfTheDay(filteredWords).toLowerCase();
        console.log(wordOfTheDay);
        // Compare userWord and wordOfTheDay and construct the result
        let result = [];
        for (let i = 0; i < userWord.length; i++) {
            if (userWord[i] === wordOfTheDay[i]) {
                result.push({ letter: userWord[i], class: 'correct' });
            } else if (wordOfTheDay.includes(userWord[i])) {
                result.push({ letter: userWord[i], class: 'present' });
            } else {
                result.push({ letter: userWord[i], class: 'absent' });
            }
        }
        if (userWord===wordOfTheDay){
            score++;
        }
        console.log('SCORE : ',score);
        res.json(result); // Send the result back to the client
    });
    //set tries
    tries++;
    console.log('TRIES : ',tries);
    //post score and tries to the score service
    axios.post('http://localhost:5000/setscore', {
      username: os.hostname(),
      score: score,
      tries: tries
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error);
    });

});




app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
app.get('/port', (req, res) => {
    const user = os.hostname(); // Récupère le nom d'utilisateur
    res.send(`MOTUS APP working on ${user} port ${port}`);
});
// PORT=3000 node index.js # Pour la première instance
// PORT=4000 node index.js # Pour la deuxième instance

app.get('/health', (req, res) => {
    res.status(200).send('OK');
});

