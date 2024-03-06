const express = require('express');
const redis = require('redis');
const app = express();
const path = require('path');

app.use(express.json()); // Middleware to parse JSON bodies

// Create Redis client

const client = redis.createClient(
  { host: 'localhost', port: 6379 }
);

client.on('error', err => console.log('Redis Client Error', err));
client.connect().then(() => {
  console.log('Connected to Redis');
 })
client.hSet('user-session:123', {
  username : 'YASSINE',
  age: 22,
  score: 0,
  tries: 0
})

app.use(express.static(path.join(__dirname, 'public')));



// API to get score from the other service

//const axios = require('axios');
app.post('/setscore', async (req, res) => {
  const received_data = req.body;
  const { username, score, tries } = received_data;
  await client.hSet(`user-session:${username}`, {
    username: username,
    score: score,
    tries: tries
  });
  console.log('received_data : ',received_data);
  //send this data to frontend js
  res.json({ score, tries });
});
// Endpoint to get scores
app.get('/', async (req, res) => {
  const user = await client.get('user-session:123');
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
}
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

