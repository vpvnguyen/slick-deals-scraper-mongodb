const mongoose = require('mongoose');

// use mongoose to generate schema
const Schema = mongoose.Schema;

// create schema for Note model
const NoteSchema = new Schema({
    price: String,
    comment: String
}, { timestamps: { createdAt: 'created_at' } });

// create model from schema
const Note = mongoose.model('Note', NoteSchema);

// export Note model
module.exports = Note;