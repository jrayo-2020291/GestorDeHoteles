'use strict';

const Events = require('./events.model');
const { validateData} = require('../utils/validate');
const Hotel = require('../hotels/hotels.model');
const ReservationEvent = require('../reservationEvent/reservationEvent.model')

exports.test = (req, res)=>{
    return res.send({message: 'Test function for Events is running'});
}

exports.addEvent = async(req, res)=>{
    try{
        let data = req.body;
        let params = {
            name: data.name,
            description: data.description,
            costPerHour: data.costPerHour
        };
        let msg = validateData(params);
        if(msg) return res.status(400).send({message: msg});
        let eventExist = await Events.findOne({name: params.name});
        if(eventExist)return res.send({message: 'This event already exist'});
        let newEvent = new Events(params);
        await newEvent.save();
        return res.send({message: 'New Event Created', newEvent});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating event'});
    }
}

exports.getEvents = async(req, res)=>{
    try{
        let events = await Events.find();
        return res.send({events});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting events'});
    }
}

exports.getById = async(req, res)=>{
    try{
        let eventId = req.params.id;
        let event = await Events.findOne({_id: eventId});
        if(!eventId)return res.status(404).send({message: 'Event not found'});
        return res.send({event})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting event'});
    }
}

exports.getByName = async(req, res)=>{
    try{
        let data = req.body;
        let eventName = data.name;
        if(data.name === '')return res.send({message: 'Events not found'});
        let events = await Events.find({
            name: {
                $regex: eventName,
                $options: 'i'
            }
        })
        return res.send({events})
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting events'})
    }
}

exports.update = async(req, res) =>{
    try{
        let eventId = req.params.id;
        let data = req.body;
        let params = {
            name: data.name,
            description: data.description,
            costPerHour: data.costPerHour
        }
        let msg = validateData(params);
        if(msg) return res.status(400).send({message: msg});
        let eventExist = await Events.findOne({_id: eventId});
        if(data.name!==eventExist.name){
            let nameEvent = await Events.findOne({name:data.name})
            if(nameEvent) return res.send({message:'The name of the event is already in use'})
        }
        if(!eventExist) return res.status(404).send({message: 'Event not found'});
        let updatedEvent = await Events.findOneAndUpdate({_id: eventId}, params, {new: true});
        return res.send({message: 'Event updated', updatedEvent});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating event'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let eventId = req.params.id;
        let findHotel = await Hotel.findOne({events: eventId});
        if(findHotel) return res.send({message: 'This event is being used and cannot be deleted'});
        let findReservation = await ReservationEvent.findOne({event: eventId});
        if(findReservation) return res.send({message: 'This event is being used and cannot be deleted'});
        let deletedEvent = await Events.findOneAndDelete({_id: eventId});
        if(!deletedEvent) return res.sta(404).send({message: 'Event not found and not deleted'});
        return res.send({message: 'Event deleted', deletedEvent});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting event'});
    }
}