/* Step 1 : session management
set up a session management using the express-session middleware

add the express-session to your application
findout how the session is kept between request
create an api /session that will display the content of the session
TIPS :

you can use JSON.stringify to display information
session is available on the server side : req.session
it could be a good idea to follow the express good practice regarding the session : http://expressjs.com/en/advanced/best-practice-security.html#dont-use-the-default-session-cookie-name */

const express = require('express');
const session = require('express-session');
const app = express();
const path = require('path');
const port = process.env.PORT || 5001; 

app.use(session({
  secret: '42',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/session', (req, res) => {
  res.json(req.session);
}
);

app.get('/', (req, res) => {
  //res.send('Hello World!')
  console.log(req.session.username);
  username = req.session.username;
  //show the login page
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
})
//authorize


app.get('/register', (req, res) => {
  //res.json(req.session);
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
}
);
app.post('/register')


app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
