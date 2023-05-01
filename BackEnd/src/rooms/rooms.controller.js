'use strict'

const Room = require('./rooms.model');
const Hotel = require('../hotels/hotels.model');
const {validateData} = require('../utils/validate')
const mongoose = require('mongoose');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
};

exports.add = async(req,res)=>{
    try {
        let data = req.body;
        let validate = validateData(data);
        if(validate) return res.status(400).send({validate});
        let existHotel = await Hotel.findOne({_id:data.hotel});
        if(!existHotel) return res.send({message:'Hotel not found'});
        let existRoom = await Room.findOne({noRoom:data.noRoom});
        if(existRoom) return res.send({message:'This room already exists in this hotel'});
        let room = new Room(data);
        await room.save();
        return res.send({message:'Room adding to hotel sucessfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({messgae:'Error add Room to Hotel'})
    }
}