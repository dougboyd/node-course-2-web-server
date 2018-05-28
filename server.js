const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;

var app = express();

const siteUp = false;

// Partials
hbs.registerPartials(__dirname + '/views/partials');
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getTimezoneOffset();
})
hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});

app.set('view engine', 'hbs');

/**
 * Middleware for logging
 */
app.use((req, res, next) => {
    var now = new Date().toString();
    var log = `The page ${req.url}, with method ${req.method} was hit at ${now}`;
    console.log(log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if(err) {
            console.log('Unable to append to server.log.' + '\n');
        }
    });
    next();
});

/**
 * Middleware for maintenance
 */
app.use((req, res, next) => {
    if(!siteUp){
        res.render('maintenance.hbs');
    } else {
        next();
    }
});

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    var incomingVars = {
        pageTitle: 'Home',
        websiteName: 'Doug\'s Great New Structure',
        __dirname
    }
    res.render('home.hbs', incomingVars);
});

app.get('/json', (req, res) => {
    const returnObject = {
        name: 'Doug',
        likes: [
            'sex',
            'flying',
            'music',
            'running'
        ]
    }
    res.send(returnObject);
});

app.get('/about', (req, res) => {
    var incomingVars = {
        pageTitle: 'About Page'
    }
    res.render('about.hbs', incomingVars);
});

app.get('/bad', (req, res) => {
    const error = {
        errorMessage: 'Bad Request'
    }
    res.send(error);
});

app.listen(port, () => {
    console.log(`Server is up on ${port}`);
});