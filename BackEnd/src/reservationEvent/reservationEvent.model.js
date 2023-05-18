'use strict'
const mongoose = require('mongoose');

const reservationEventSchema = mongoose.Schema({
    dateEvent: {
        type: Date,
        required: true
    },
    hoursEvent:{
        type: Number,
        required: true
    },
    cost: {
        type: Number,
        required: true,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hotel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotels',
        required: true
    },
    event:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Events',
        required: true
    },
    additionalServices: [{
        service: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Services'}
    }],
    state: {
        type: String,
        required: true,
        uppercase: true,
        default: 'RESERVED'
    }
},{
    versionKey: false,
    timeStamps: true
});

module.exports = mongoose.model('ReservationEvent', reservationEventSchema);