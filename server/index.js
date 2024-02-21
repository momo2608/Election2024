'use strict';
// main express related import
const express = require('express');
const dayjs = require('dayjs');
const router = require('./routes/router.js');
const session = require('express-session');

// init express
const app = new express();
const port = 3001;

// middlewares
const morgan = require('morgan');
const cors = require('cors');
const dao = require('./daoUsers.js');

const { check, validationResult, } = require('express-validator'); // validation middleware

// TODO Passport-related imports + new idp import module

// auth imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const SamlStrategy = require('passport-saml').Strategy;
const fs = require('fs'); // to read the pem file
const path = require('path');

// utility imports middleware and setup
const certPath = path.join(__dirname, './elections-2024.pem');
const cert = fs.readFileSync(certPath, 'utf-8'); // read the certificate
const bodyParser = require("body-parser"); //needed to read the token from saml

//-------------------------------AUTH0 stuff for SAML2--------------------------------//

passport.use(new SamlStrategy({
    entryPoint: 'https://elections-2024.eu.auth0.com/samlp/r8fucZlejI9dxVLESMe9bPZKVZZrn8xg',
    path: '/login/callback',
    issuer: 'passport-saml',
    cert: cert,
    acceptedClockSkewMs: -1 // avoid syncerror Error: SAML assertion not yet valid
}, function (profile, done) {
    return done(null, {//take from the Saml token the parameters so that will be available in req.user ffs
        id: profile['nameID'],
        email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
    });
}));

// set up middlewares
app.use(express.json());
app.use(morgan('dev'));
const corsOptions = {
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
    credentials: true
}
app.use(cors(corsOptions));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});

passport.deserializeUser(function (user, cb) {
    return cb(null, user);
});

app.use(session({
    secret: "shhhhh...boulko wakh keneu!",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 600000,
        _expires: 600000
    }
}));

app.use(passport.authenticate('session'));


app.get('/login', (req, res, next) => {
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true })(req, res, next)
});

app.post(
    '/login/callback',
    bodyParser.urlencoded({ extended: false }),
    passport.authenticate('saml', { failureRedirect: '/login', failureFlash: true }),
    async function (req, res, next) {
        // Get the email
        const email = req.user.email;

        try {
            //let userData;
            const userData = await dao.getUserByEmail(email);

            if (!userData || !userData.id) {
                return res.status(401).json({ message: 'Error fetching data from the database.' });
            }

            const user = {
                id: userData.id,
                role: userData.role,
                email: userData.email,
            };

            // Log in the user and store the additional user data in the session
            req.logIn(user, async function (err) {
                if (err) { return next(err); }

                const redirectURL = "http://localhost:5173";
                return res.redirect(redirectURL);
            });
        } catch (error) {
            return next(error);
        }
    }
);

app.get('/logout', (req, res) => {
    req.isAuthenticated() ?
        req.logOut(function (err) {
            if (err) { return next(err); }

            const redirectURL = "http://localhost:5173";
            return res.redirect(redirectURL);
        }) :
        res.status(401).json({ message: 'Unauthorized' });
});

/* ROUTERS */
app.use('/api', router);

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});

module.exports = { app };