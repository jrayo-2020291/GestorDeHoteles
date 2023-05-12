'use strict'
const mongoose = require('mongoose');

const servicesSchema = mongoose.Schema(
    {
        name:{
            type: String,
            required: true
        },
        description:{
            type: String,
            required: true
        },
        cost:{
            type: Number,
            required: true
        },
        category:{
            type: String,
            required:true,
            uppercase: true
        }
    },
    {
        versionKey: false,
        timeStamps: true
    }
);
module.exports = mongoose.model('Services', servicesSchema);