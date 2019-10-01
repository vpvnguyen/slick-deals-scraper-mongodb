const express = require('express');
const router = express.Router();
const db = require('../models');

// get all notes from a deal id
router.get('/getNotes/:id', (req, res) => {

    db.Deals.findOne({ _id: req.params.id })
        .populate('note')
        .then(notesByDeal => {
            res.json(notesByDeal);
        })
        .catch(err => {
            res.json(err);
        });
});

// update deals' notes by id
router.post('/addNote/:id', (req, res) => {

    // create new note in mongodb
    db.Note.create(req.body)
        .then(dbNote => db.Deals.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true }))
        .then(dbDeals => {
            res.json(dbDeals);
        })
        .catch(err => {
            res.json(err);
        });
});

module.exports = router;