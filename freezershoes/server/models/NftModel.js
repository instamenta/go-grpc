const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    pic: {
        type:String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
});

const nftSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 14,
    },
    info: {
        type: String,

        minlength: 3,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    pic: {
        type: String,
        required: true,
        unique: true
    },
    creator: {
        type: String,
        required: true,
    },
    owners: [
        {
            type: String

        }
    ],
    likes: [
        String
    ],
    comments: [
        commentSchema
    ]
})


const Nft = mongoose.model('Nft', nftSchema);

module.exports = Nft;