'use strict'

const Room = require('./rooms.model');
const Hotel = require('../hotels/hotels.model');
const Reservation = require('../reservationRoom/reservationRoom.model')
const {validateData} = require('../utils/validate')
const mongoose = require('mongoose');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
};
exports.getRooms = async(req,res)=>{
    try {
        let userId = req.user.sub;
        let hotels= await Hotel.findOne({manager:userId})
            console.log(hotels.id)
        
        let rooms = await Room.find({hotel:hotels.id});
        console.log(rooms)
        return res.send({rooms})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error geting rooms'})
    }
}

exports.getByHotel = async(req,res)=>{
    try {
        let data = req.body;
        if(data.hotel==='') return res.send({message:'Does not exist Rooms'})
        let rooms = await Room.find({hotel: data.hotel}).populate('hotel')
        return res.send({rooms})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error search Rooms'})
    }
}

exports.get =async(req,res)=>{ try{
    let rooms=await Room.find({}).populate('hotel')
    return res.send({rooms})
}catch(err){
    console.error(err);
    return res.status(500).send({message:'Error getting rooms'})
}}

exports.getById =async(req,res)=>{ try{
    let roomId = req.params.id
    let room=await Room.findOne({_id: roomId}).populate('hotel')
    return res.send({room})
}catch(err){
    console.error(err);
    return res.status(500).send({message:'Error getting room'})
}}

exports.getAvailability=async(req,res)=>{
    try{
        let reservationId = req.params.id
        let reservation = await Reservation.findOne({_id: reservationId})
        let state = 'AVAILABLE'
        let rooms=await Room.find({availability:state, hotel: reservation.hotel})
        return res.send({rooms})
    }catch(err){
        console.error(err);
        return res.status(500).send({message:'Error getting availability'})
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
        let findReservation = await Reservation.findOne({'rooms.room': roomId});
        if(findReservation) return res.send({message: 'This room is being used and cannot be deleted'})
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
            category: data.category,
            peopleCapacity: data.capacity,
            price: data.price,
            availability:data.availability,
            hotel: data.hotel
        }
        if(data.name=='')return res.send({message:'You have to add a valid name'})
        let existRoom = await Room.findOne({_id: roomId})
        console.log(existRoom.noRoom)
        if(data.room !== existRoom.noRoom){
            let room = await Room.findOne({noRoom: data.room});
            if(room) return res.send({message:'Room name is already in use'})
        }
        let updatedRoom = await Room.findOneAndUpdate({_id: roomId}, params, {new: true});
        if(!updatedRoom) return res.status(404).send({message: 'Room not found and not updated'});
        return res.send({message: 'Room updated', updatedRoom});
    }catch (err){
        console.error(err);
        return res.status(500).send({message: 'Error updating room'})
    }
}