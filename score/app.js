const express = require('express');
const redis = require('redis');
const app = express();
const path = require('path');

app.use(express.json()); // Middleware to parse JSON bodies

// Create Redis client

const client = redis.createClient();

client.on('error', err => console.log('Redis Client Error', err));
 client.connect().then(() => {
  console.log('Connected to Redis');
 })
/* await client.hSet('user-session:123', {
  username : 'YASSINE',
  age: 22,
  score: 0,
  tries: 0
})
 */
app.use(express.static(path.join(__dirname, 'public')));


// API to get score from the other service

const axios = require('axios');
app.get('/getscore', async (req, res) => {
  //const response = await axios.get('http://localhost:5000/setscore');
  //res.json(response.data); 
  res.json("coucou")
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));

