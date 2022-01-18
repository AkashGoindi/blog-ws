const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: String,
    breif: String,
    description: String,
    imageUrl: String,
    userId: String
}, {timestamps: true});

module.exports = mongoose.model('Blog', blogSchema);