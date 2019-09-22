const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const ryzen = 'ryzen';
const slickDealsSearchQuery = `https://slickdeals.net/newsearch.php?src=SearchBarV2&q=${ryzen}&searcharea=deals&searchin=first`;

router.post('/search/:id', (req, res) => {
    console.log(`req.body: ${req.params.id}`);
});

router.post('/search', (req, res) => {
    var searchQuery = req.body.searchQuery;
    console.log(searchQuery)

    // search slickdeals for search query
    // fetch('https://slickdeals.net/')
    //     .then(res => res.text())
    //     .then(body => {
    //         // console.log(body)
    //         const $ = cheerio.load(body);

    //         $('h2.title').text('Hello there!')
    //         $('h2').addClass('welcome')

    //         $.html()
    //     });


    res.json(req.body);
});

module.exports = router;


