const mongoose = require('mongoose');


const locationSchema = new mongoose.Schema({

    onwerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    photos : {
        type: [String],
        required: true
    },
    rules: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },

}, { timestamps: true });

const LocationModel = mongoose.model('Location', locationSchema);

module.exports = LocationModel;