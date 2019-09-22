const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const slickDealsController = require('./controllers/slick.deals.scraper.js')
const PORT = process.env.PORT || 3000;

const app = express();

// npm morgan; create log directory
const logDirectory = path.join(__dirname, 'log');
// ensure log directory exists
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

// create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));

// MIDDLEWARE
// handle url encoded data; parse json
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// make public static
app.use(express.static('public'));

app.use(slickDealsController)
// start server and listen for client requests
app.listen(PORT, function () {
    // log (server-side) when server has started
    console.log(`Server listening on: http://localhost:${PORT}`);
});