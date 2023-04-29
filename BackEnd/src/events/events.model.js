'use strict'
const mongoose = require('mongoose');

const eventsSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    costPerHour: {
        type: Number,
        required: true
    }
},{
    versionKey: false,
    timeStamps: true
});

module.exports = mongoose.model('Events', eventsSchema);