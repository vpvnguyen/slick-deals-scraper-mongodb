const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const db = require('../models');

// get all items in db and render to index hbs
router.get('/', (req, res) => {
    db.Deals.find({})
        .then(dbDeals => {

            let hbsObject;
            hbsObject = {
                dbDeals
            };

            res.render('index', hbsObject);
        }).catch(err => {
            if (err) throw err;
            res.statusCode(500);
        });
});

// search for item and webscrape slickdeals
router.post('/search', (req, res) => {

    const searchQuery = req.body.searchQuery;
    const slickDealsSearchQuery = `https://slickdeals.net/newsearch.php?src=SearchBarV2&q=${searchQuery}&searcharea=deals&searchin=first`;

    // grab the body of the html with axios
    axios
        .get(slickDealsSearchQuery)
        .then(webscrapeResponse => {
            const $ = cheerio.load(webscrapeResponse.data);

            // loop through results and pull deal info
            $('.resultRow').each(function (i, element) {
                const result = {};
                let slickDealsUrl = 'https://slickdeals.net';
                result.title = $(this).children('div.mainDealInfo').children('div.dealWrapper').children('a.dealTitle').attr('title');
                result.link = slickDealsUrl + $(this).children('div.mainDealInfo').children('div.dealWrapper').children('a.dealTitle').attr('href');
                result.price = $(this).children('div.priceCol').children('span.price').text().trim();
                result.store = $(this).children('div.priceCol').children('span.store').text().trim();
                result.rating = $(this).children('div.ratingCol').children('div.ratingNum').text().trim();

                // store deals into mongodb
                db.Deals.create(result)
                    .then(dbDeals => {
                        console.log(dbDeals);
                    })
                    .catch(err => {
                        console.log(err);
                        res.statusCode(500);
                    });
            });

            // redirect to home to get updated query
            res.send({ redirect: '/' });
        }).catch(err => {
            if (err) throw err;
            res.statusCode(500);
        });
});

// save deal to favorites
router.put('/save/:id', (req, res) => {
    db.Deals.findOneAndUpdate({ _id: req.params.id }, { isSaved: true })
        .then(data => {
            res.send({ redirect: '/' });
        })
        .catch(err => {
            res.json(err);
        });;
});

// remove deal from favorite
router.put('/remove/:id', (req, res) => {
    db.Deals.findOneAndUpdate({ _id: req.params.id }, { isSaved: false })
        .then(data => {
            res.send({ redirect: '/' });
        })
        .catch(err => {
            res.json(err);
        });
});

// delete all unsaved deals from mongodb
router.delete('/delete', (req, res) => {
    db.Deals.deleteMany({ isSaved: false })
        .then(deleteDeals => {
            res.send({ redirect: '/' });
        }).catch(err => {
            if (err) throw err;
            res.statusCode(500);
        })
});

// catch all route
router.get('*', (req, res) => {
    res.redirect('/');
})

// export routes to server.js
module.exports = router;