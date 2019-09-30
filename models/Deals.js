const mongoose = require('mongoose');

// create schema to store all webscrape deals
const Schema = mongoose.Schema;
const DealsSchema = new Schema({

    title: {
        type: String,
        required: true,
        unique: true
    },
    link: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: String,
        required: false,
        unique: false
    },
    store: {
        type: String,
        required: false,
        unique: false
    },
    rating: {
        type: String,
        required: false,
        unique: false
    },
    isSaved: {
        type: Boolean,
        default: false,
        required: false,
        unique: false
    },
    note: {
        type: [{ type: Schema.Types.ObjectId, ref: 'Note' }],
    }
});

// set Deals collection and export model
const Deals = mongoose.model('Deals', DealsSchema);

module.exports = Deals;