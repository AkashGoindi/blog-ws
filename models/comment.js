const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    comment: String,
    userName: String,
    postId: String,
}, {timestamps: true});

module.exports = mongoose.model('Comment', commentSchema);