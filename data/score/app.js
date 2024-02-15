const express = require('express');
const redis = require('redis');
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies

// Create Redis client
const client = redis.createClient({
  url: 'redis://default:@localhost:6379' // Update this with your Redis connection string
});
client.connect();

// API to set score
app.post('/setscore', async (req, res) => {
  const { username, score, tries } = req.body;
  // Store the score in Redis
  await client.hSet('scores', username, JSON.stringify({ score, tries }));
  res.send('Score updated successfully');
});

// API to get score
app.get('/getscore/:username', async (req, res) => {
  const { username } = req.params;
  const result = await client.hGet('scores', username);
  res.json(result ? JSON.parse(result) : {});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

