'use strict'

const Hotel = require('./hotels.model');
const Event = require('../events/events.model');
const {validateData} = require('../utils/validate')
const mongoose = require('mongoose');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.add = async(req,res)=>{
    try {
        let data = req.body;
        let validate = validateData(data);
        if(validate) return res.status(400).send({validate})
        let hotel = new Hotel(data);
        await hotel.save();
        return res.send({message:'hotel created sucessfully', hotel});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error adding Hotel'})    
    }
};

exports.get = async(req,res)=>{
    try {
        let hotels = await Hotel.find({});
        return res.send(hotels);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get Hotels'})
    }
}

exports.addEvent = async(req,res)=>{
    try {
        let hotelId = req.params.id;
        let event = await Event.findOne({_id:req.body.event});
        let hotel = await Hotel.findOne({_id:hotelId});
    for(let i=0;i<hotel.events.length;i++){
        const idEnString = hotel.events[i].toString();
        if(req.body.event===idEnString)
        return res.send({message:'This event is already registered at the hotel'})
    } 
        if(!event) return res.send({message:'Event not found'})
        let updateHotel = await Hotel.findOneAndUpdate(
            {_id:hotelId},
            {$push:{events:req.body.event}},
            {new:true});
        if(!updateHotel) return res.send({message:'hotel not found and not update'});
        return res.send({message:'updating sucessfully',updateHotel})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error add Event to Hotel'})
    }
};

exports.deleteEvent = async(req,res)=>{
    try {
        let hotelId = req.params.id;
        let event = await Event.findOne({_id:req.body.event});
        if(!event) return res.send({message:'Event not found'})
        let updateHotel = await Hotel.findOneAndUpdate(
            {_id:hotelId},
            {$pullAll:{events:[req.body.event]}},
            {new:true});
        if(!updateHotel) return res.send({message:'hotel not found and not update'});
        return res.send({message:'updating sucessfully',updateHotel})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error deleting event to hotel'})
    }
}

exports.getByName = async(req,res)=>{
    try {
        let data = req.body;
        if(data.name==='') return res.send({message:'You must enter a name'});
        let hotels = await Hotel.find({
            name:{
                $regex: data.name, 
                $options: 'i'
            }
        },{__v:0}).populate('events',['name']);
        return res.send(hotels);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get hotels'})
    }
};

exports.getByLocation = async(req,res)=>{
    try {
        let data = req.body;
        if(data.location==='') return res.send({message:'You must enter a location'});
        let hotels = await Hotel.find({
            locationH:{
                $regex: data.location, 
                $options: 'i'
            }
        },{__v:0}).populate('events',['name']);
        return res.send(hotels);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get hotels'})
    }
};

exports.getById = async(req,res)=>{
    try {
        let hotelId = req.params.id;
        let data = req.body;
        if(data.location==='') return res.send({message:'You must enter a location'});
        let hotel = await Hotel.findOne({_id:hotelId},{__v:0}).populate('events',['name']);
        if(!hotel) return res.send({message:'Hotel not found'})
        return res.send(hotel);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get hotels'})
    }
};