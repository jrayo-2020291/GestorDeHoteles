'use strict'

const Room = require('./rooms.model');
const Hotel = require('../hotels/hotels.model');
const {validateData} = require('../utils/validate')
const mongoose = require('mongoose');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
};
exports.get = async(req,res)=>{
    try {
        let rooms = await Room.find({},{__v:0});
        return res.send(rooms)
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error geting rooms'})
    }
}
exports.add = async(req,res)=>{
    try {
        let data = req.body;
        let validate = validateData(data);
        if(validate) return res.status(400).send({validate});
        let existHotel = await Hotel.findOne({_id:data.hotel});
        if(!existHotel) return res.send({message:'Hotel not found'});
        let existRoom = await Room.findOne({noRoom:data.noRoom,hotel:data.hotel});
        if (existRoom)
            console.log('haha')
        
        if(existRoom) return res.send({message:'This room already exists in this hotel'});
        let room = new Room(data);
        await room.save();
        return res.send({message:'Room adding to hotel sucessfully'})
    } catch (err) {
        console.error(err)
        return res.status(500).send({messgae:'Error add Room to Hotel'})
    }
}

exports.delete = async(req, res)=>{
    try{
        let roomId = req.params.id;
        let deletedRoom = await Room.findOneAndDelete({_id: roomId});
        if(!deletedRoom) return res.status(404).send({message: 'Room not found and not deleted'});
        return res.send({message: 'Room deleted: ', deletedRoom});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting Room'});
    }
}
exports.update = async(req,res)=>{
    try{
        let roomId = req.params.id;
        let data=req.body;
        let params = {
            noRoom: data.room,
            peopleCapacity: data.capacity,
            price: data.price,
            availability:data.availability
        }
        let roomExist = Room.findOne({_id: roomId});
        let alreadyName= roomExist.name;
        if(data.room == alreadyName){'succsess'}
        let room = await Room.findOne({noRoom: data.room});
        if(room)return res.send({message: 'This Room already exists'});
        let updatedRoom = await Room.findOneAndUpdate({_id: roomId}, params, {new: true});
        if(!updatedRoom) return res.status(404).send({message: 'Room not found and not updated'});
        return res.send({message: 'Room updated', updatedRoom});
    }catch (err){
        console.error(err);
        return res.status(500).send({message: 'Error updating room'})
    }
}