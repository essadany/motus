const express = require('express');
const redis = require('redis');
const app = express();
const path = require('path');
const { get } = require('http');

app.use(express.json()); // Middleware to parse JSON bodies
let username = 'sutdent-laptop';
// Create Redis client

const client = redis.createClient(
  { host: 'localhost', port: 6379 }
);

client.on('error', err => console.log('Redis Client Error', err));
client.connect().then(() => {
  console.log('Connected to Redis');
 })


app.use(express.static(path.join(__dirname, 'public')));
// get the data form redis
app.get('/getscore',  (req, res) => {
  client.hGetAll(`user-session:${username}`).then((user) => {
    console.log('user : ',user);
    res.json(user);
  })
}
);

// API to get score from the other service

app.post('/setscore', async (req, res) => {
  const received_data = req.body;
  const { username, score, tries } = received_data;
  //store the data in redis
  await client.hIncrBy(`user-session:${username}`, 'score', score);
  await client.hIncrBy(`user-session:${username}`, 'tries', tries);
  console.log('received_data : ',received_data);  
  });

// Endpoint to get scores
app.get('/', async (req, res) => {
  //get the username from local storage
  username = localStorage.getItem('username');
  

  /* const user = await client.get('user-session:123');
  console.log('user : ',user);
  try {
    const scoreResponse = await axios.post('http://localhost:3000/getscore', {
        username: user.username,
        score: user.score,
        tries: user.tries
    });
    console.log(scoreResponse.data);
    res.json(scoreResponse.data);
} catch (error) {
    console.error('Error posting to score service:', error);
    res.status(500).json({ error: "Erreur lors de la communication avec le service de score" });
} */
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

