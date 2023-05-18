'use strict'
const mongoose = require('mongoose');

const reservationSchema = mongoose.Schema({
    dateStart: {
        type: Date,
        required: true
    },
    dateEnd: {
        type: Date,
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
    rooms:[{
        room: {type: mongoose.Schema.Types.ObjectId, ref: 'Room'}
    }],
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

module.exports = mongoose.model('ReservationRoom', reservationSchema);