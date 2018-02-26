const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { Nuxt, Builder } = require('nuxt');
const jwt = require('jsonwebtoken');
const graphClient = require('../graphClient');
const secrets = require('../../secrets');

// setup up server variables
const app = express();
const host = process.env.HOST || 'localhost';
const port = process.env.PORT || 3000;

/*
** Express
 */
// set up server
app.set('port', port);

// set middleware
app.use(bodyParser.json());
app.use(session({
    secret: secrets.jwt,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }
}));


/*
** API
 */
app.post('/api/login', (req, res, next) => {
    console.log(req.session);
    // TODO: send session id in header
    const {username, password} = req.body;
    let user = {};
    // call login mutation and get token with user ID
    graphClient.mutation(`{
        login(username:"${username}", password:"${password}") {
            token
        }
    }`, {header: {authorization: `Bearer ${req.session.id}`}})
    // regenerate session and return new token with session id and user id
    .then(loginData => {
        return new Promise((resolve, reject) => {
            const token = jwt.verify(loginData.login.token, secrets.jwt);
            req.session.regenerate(err => {
                resolve(jwt.sign({userId: token.id, sessionId: req.session.id}, secrets.jwt));
            });
        });
    })
    // call setSessionId mutation to save session id to user db
    .then(newToken => {
        return graphClient.mutation(`{
            setSessionId(token:"${newToken}") {
                isSaved
                id
                name
                username
                email
            }
        }`, {header: {authorization: `Bearer ${req.session.id}`}});
    })
    // return user to client
    .then(setSessionIdData => {
        if (setSessionIdData.setSessionId.isSaved) {
            const {id, name, username, email} = setSessionIdData.setSessionId;
            res.json({id, name, username, email});
        } 
    })
    // catch errors
    .catch(err => {
        res.json({s: 'error', msg: 'No user found'});
    });
});


/*
** NUXT
 */
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js');
config.dev = !(process.env.NODE_ENV === 'production');

// Init Nuxt.js
const nuxt = new Nuxt(config);

// Build only in dev mode
if (config.dev) {
  const builder = new Builder(nuxt);
  builder.build()
}

// Give nuxt middleware to express
app.use(nuxt.render);

// Listen the server
app.listen(port, host);
console.log('Server listening on ' + host + ':' + port);
