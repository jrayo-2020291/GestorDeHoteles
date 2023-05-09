'use strict'

const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    duration: {
        type: Number,
        required: true
    },
    ability: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    hotel:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotels' 
    }
});

module.exports = mongoose.model('Activities', userSchema);