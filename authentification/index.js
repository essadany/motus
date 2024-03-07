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
const redis = require('redis');
const client = redis.createClient({
  host: 'localhost',
  port: 6379
});
client.on('error', (err) => {
  console.log('Error ' + err);
}
);
client.on('connect', () => {
  console.log('Connected to Redis');
}
);

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

app.get("/test_session", (req, res) => {
  req.session.username = "test";
  req.session.save();
  res.send("session set");
});

app.get('/', (req, res) => {
  res.send('Hello World!')
  //show the login page
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
})
//authorize
app.post('/login', (req, res) => {
  //search for the username in the database
  client.exists(req.query.username, (err, exists) => {
    if (err) {
      console.log(err);
    } else {
      if (exists) {
        //get the password of the username
        client.hget(req.query.username, 'password', (err, password) => {
          if (err) {
            console.log(err);
          } else {
            if (password === req.query.password) {
              // create a session
              req.session.username = req.query.username;
              req.session.save();
              //redirect to the motus game
              res.redirect('http://localhost:3000');
            } else {
              //display an alert
              console.log('Incorrect password');
              alert('Incorrect password');
            }
          }
        });
      } else {
        //display an alert
        console.log('Username does not exist');
        alert('Username does not exist');
      }
    }
  });
});

app.get('/register', (req, res) => {
  //res.json(req.session);
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
}
);
app.post('/register', (req, res) => {
  //get the data from the form
  console.log(req.query);
  res.redirect('http:localhost:5001');
  //store the data in redis:
  client.exists(req.query.username, (err, exists) => {
    if (err) {
      console.log(err);
    } else {
      if (exists) {
        console.log('Username already exists');
        alert('Username already exists');
      } else {
        client.hmset(req.query.username, ['password', req.query.password, 'firstname', req.query.firstname, 'lastname', req.query.lastname], (err, reply) => {
          if (err) {
            console.log(err);
          }
          console.log(reply);
        });
      }
    }
  });
  

}
);
 


app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});
