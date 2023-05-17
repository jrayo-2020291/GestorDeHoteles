'use strict'

const mongoose = require('mongoose');

const hotelsSchema = mongoose.Schema({
    name:{ 
        type: String, 
        require:true
    },
    locationH:{
        type: String,
        required: true
    },
    qualification:{
        type: Number,
        default:0
    },
    numberRooms:{
        type:Number,
        require:true
    },
    counter:{
        type:Number,
        default:0
    },
    manager:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    events:{
        type:[mongoose.Schema.Types.ObjectId,mongoose.Schema.Types.Array],
        ref:'Events',
        default:[]
    }
});

module.exports = mongoose.model('Hotels', hotelsSchema);