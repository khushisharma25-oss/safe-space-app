const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);