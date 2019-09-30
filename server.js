const express = require('express');
const handlebars = require('express-handlebars');
const router = express.Router();
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('./models');

const PORT = process.env.PORT || 3000;

const app = express();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/webscrapeDeals";
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

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

// handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    db.Deals.find({}).then(function (dbDeals) {
        console.log('FIND ALL DEALS ======')
        console.log(dbDeals)
        let hbsObject;
        hbsObject = {
            dbDeals
        };
        res.render('index', hbsObject);
    }).catch(function (err) {
        if (err) throw err;
    })
});

app.post('/search', (req, res) => {

    const searchQuery = req.body.searchQuery;
    const slickDealsSearchQuery = `https://slickdeals.net/newsearch.php?src=SearchBarV2&q=${searchQuery}&searcharea=deals&searchin=first`;

    // grab the body of the html with axios
    axios
        .get(slickDealsSearchQuery)
        .then(function (webscrapeResponse) {
            const $ = cheerio.load(webscrapeResponse.data);

            $('.resultRow').each(function (i, element) {
                const result = {};
                let slickDealsUrl = 'https://slickdeals.net';
                result.title = $(this).children('div.mainDealInfo').children('div.dealWrapper').children('a.dealTitle').attr('title');
                result.link = slickDealsUrl + $(this).children('div.mainDealInfo').children('div.dealWrapper').children('a.dealTitle').attr('href');
                result.price = $(this).children('div.priceCol').children('span.price').text().trim();
                result.store = $(this).children('div.priceCol').children('span.store').text().trim();
                result.rating = $(this).children('div.ratingCol').children('div.ratingNum').text().trim();

                db.Deals.create(result)
                    .then(function (dbDeals) {
                        console.log(dbDeals);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            });

            res.send({ redirect: '/' });
        }).catch(err => { throw err });
});

app.put('/save/:id', (req, res) => {
    db.Deals.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(data => {
            res.send({ redirect: '/' });
        })
        .catch(err => {
            res.json(err);
        });;
});

app.put('/remove/:id', (req, res) => {
    console.log(req.params.id)
    db.Deals.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(data => {
            res.send({ redirect: '/' });
        })
        .catch(err => {
            res.json(err);
        });
});

app.delete('/delete', (req, res) => {
    console.log(req.params.id)

    db.Deals.deleteMany({ isSaved: false })
        .then(function (deleteDeals) {
            res.send({ redirect: '/' });
        }).catch(function (err) {
            if (err) throw err;
        })
});

// start server and listen for client requests
app.listen(PORT, () => console.log(`Server listening on: http://localhost:${PORT}`));