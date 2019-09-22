const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const axios = require('axios');
const cheerio = require('cheerio');

const PORT = process.env.PORT || 3000;


const app = express();

mongoose.connect("mongodb://localhost/easterDealsDB", { useNewUrlParser: true });

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

app.post('/search', (req, res) => {
    const searchQuery = req.body.searchQuery;
    const slickDealsSearchQuery = `https://slickdeals.net/newsearch.php?src=SearchBarV2&q=${searchQuery}&searcharea=deals&searchin=first`;
    console.log('====== controller | /search =======');
    console.log(slickDealsSearchQuery);

    // First, we grab the body of the html with axios
    axios.get(slickDealsSearchQuery).then(function (response) {

        // Then, we load that into cheerio and save it to $ for a shorthand selector
        const $ = cheerio.load(response.data);

        let list = [];

        $('div.resultRow').each(function (i, element) {
            list.push(element)
            console.log(list)
        });
    });
});

// start server and listen for client requests
app.listen(PORT, function () {
    // log (server-side) when server has started
    console.log(`Server listening on: http://localhost:${PORT}`);
});