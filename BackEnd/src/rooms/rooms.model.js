'use strict'

const mongoose = require('mongoose');

const hotelsSchema = mongoose.Schema({
    noRoom:{ 
        type: String, 
        require:true
    },
    category:{
        type: String,
        required: true
    },
    peopleCapacity:{
        type: Number,
        required: true
    },
    price:{
        type:Number,
        require:true
    },
    availability:{
        type:String,
        require:true,
        default:'AVAILABLE',
        enum:['AVAILABLE','NOT AVAILABLE']
    },
    hotel:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Hotels',
        require:true
    }
});

module.exports = mongoose.model('Room', hotelsSchema);