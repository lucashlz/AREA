const mongoose = require('mongoose');

const OAuthSessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    service: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600
    }
});

const OAuthSession = mongoose.model('OAuthSession', OAuthSessionSchema);

module.exports = OAuthSession;
