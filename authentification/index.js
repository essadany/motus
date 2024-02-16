const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = 7000;

app.use(express.static('public')); // Serve static files from the public directory
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  name: 'sessionId'
}));

// Middleware to check session
app.use((req, res, next) => {
  if (req.session.user || req.path === '/login.html') {
    next();
  } else {
    res.redirect('/login.html');
  }
});

// Dummy user for demonstration purposes
const user = {
  username: 'simon.gomez',
  password: 'password123' // Use hashed passwords in production
};

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === user.username && password === user.password) {
    req.session.user = username; // Save user in session
    res.redirect('/main.html'); // Redirect to the main game page
  } else {
    res.send('Login failed: Incorrect username or password');
  }
});
// Registration endpoint
app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (!user[username]) { // Check if user does not already exist
      user[username] = { username, password }; // Add user
      res.send('Registration successful');
    } else {
      res.send('Registration failed: User already exists');
    }
  });
  
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
