'use strict';
const ReservationEvent = require('./reservationEvent.model');
const User = require('../users/user.model');
const Event = require('../events/events.model');
const Hotel = require('../hotels/hotels.model');
const Services = require('../additionalServices/additionalService.model');

exports.test = (req, res)=>{
    return res.send({message: 'Test funtion for reservation event is running'});
}

exports.add =async (req, res)=>{
    try {
        let data = req.body;
        let userId = req.user.sub;
        let findUser = await User.findOne({_id: userId});
        if(findUser.role !== 'CLIENT') return res.send({message: 'Only clients can have a reservation'});
        let findEvent = await Event.findOne({_id: data.event});
        if(!findEvent) return res.status(404).send({message: 'Event not found'});
        console.log(findEvent)
        let findHotel = await Hotel.findOne({_id: data.hotel});
        if(!findHotel) return res.status(404).send({message: 'Hotel not found'});
        let eventAllowed = await Hotel.findOne({_id: data.hotel, events: {$all: [data.event]}});
        if(!eventAllowed) return res.status(404).send({message: 'This event is not allowed in this hotel'});
        let reservationOnThisDate = await ReservationEvent.findOne({hotel: data.hotel, dateEvent: data.dateEvent});
        if(reservationOnThisDate) return res.send({message: 'There is already a reservation for this day'});
        let costEvent = findEvent.costPerHour * data.hoursEvent;
        let params = {
            dateEvent: data.dateEvent,
            hoursEvent: data.hoursEvent,
            cost: costEvent,
            user: userId,
            hotel: data.hotel,
            event: data.event,
            state: 'DISABLED'
        };
        let newReservation = new ReservationEvent(params);
        await newReservation.save();
        return res.send({message: 'New Reservation created successfully', newReservation});
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error adding reservation event'});
    }
}

exports.addService = async(req, res) =>{
    try {
        let reservationId = req.params.id;
        let data = req.body;
        let reservationExist = await ReservationEvent.findOne({_id: reservationId});
        if(!reservationExist) return res.status(404).send({message: 'Reservation not found'});
        let service = await Services.findOne({_id: data.service});
        if(!service) return res.status(404).send({message: 'Service not found'});
        if(service.category !== 'EVENT') return res.send({message: 'This service only for rooms'});
        let serviceAlready = await ReservationEvent.findOne({$and: [{_id: reservationId}, {'additionalServices.service': service._id}]});
        if(serviceAlready) return res.status(200).send({message: 'Service already contrated'});
        let params = {service: service._id};
        let newCost = reservationExist.cost + service.cost;
        let updatedReservation = await ReservationEvent.findOneAndUpdate({_id: reservationId}, {$push:{'additionalServices': params}, cost: newCost}, {new: true});
        return res.status(200).send({message: 'New Service contrated', updatedReservation});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error adding service'});
    }
}

exports.removeService = async(req, res)=>{
    try {
        let reservationId = req.params.id;
        let data = req.body;
        let reservationExist = await ReservationEvent.findOne({_id: reservationId});
        if(!reservationExist) return res.status(404).send({message: 'Reservation not found'});
        let service = await Services.findOne({_id: data.service});
        if(!service) return res.status(404).send({message: 'Service not found'});
        let serviceAlready = await ReservationEvent.findOne({$and: [{_id: reservationId}, {'additionalServices.service': service._id}]});
        if(!serviceAlready) return res.status(200).send({message: 'You do not have contrated this service'});
        let newCost = reservationExist.cost - service.cost;
        let updatedReservation = await ReservationEvent.findOneAndUpdate({_id: reservationId}, {$pull:{'additionalServices': {'service': service._id}}, cost: newCost}, {new: true});
        return res.send({message: 'Removed service', updatedReservation});
    } catch (err) {
        console.log(err);
        return res.status(500).send({message: 'Error removing service'});
    }
}

exports.getReservations = async(req, res) =>{
    try {
        let reservations = await ReservationEvent.find().populate('user').populate('hotel').populate('event').populate('additionalServices.service');
        if(!reservations) return res.status(404).send({message: 'Reservations not found'});
        return res.send({reservations});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error getting reservation'});
    }
}

exports.getReservation = async(req, res)=>{
    try {
        let reservationId = req.params.id;
        let reservation = await ReservationEvent.findOne({_id: reservationId}).populate('user').populate('hotel').populate('event').populate('additionalServices.service');
        if(!reservation) return res.status(404).send({message: 'Reservation not found'});
        return res.send({reservation});
    } catch (err) {
        console.error(err);
        return req.status(500).send({message: 'Error getting reservation'});
    }
}

exports.getReservationsByUser = async(req, res)=> {
    try {
        let userId = req.params.id;
        let reservations = await ReservationEvent.find({user: userId}).populate('user').populate('hotel').populate('additionalServices.service').populate('event');
        if(!reservations) return res.send({message: 'This user not have reservations o not exist'});
        return res.send({reservations});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error getting reservations'});
    }
}

exports.getOwnReservations = async(req, res)=>{
    try{
        let userId = req.user.sub;
        let reservations = await ReservationEvent.find({user: userId}).populate('user').populate('hotel').populate('additionalServices.service').populate('event');
        if(!reservations) return res.send({message: 'This user not have reservations o not exist'});
        return res.send({reservations});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Reservations not found'});
    }
}

exports.getReservationsByHotel = async(req, res)=>{
    try{
        let hotelId = req.params.id;
        let hotelExist = await Hotel.findOne({_id: hotelId});
        if(!hotelExist) return res.status(404).send({message: 'This hotel does not exist'});
        let reservations = await ReservationEvent.find({hotel: hotelId}).populate('user').populate('hotel').populate('additionalServices.service').populate('event');
        if(!reservations) return res.status(404).send({message: 'This hotel has no reservations'});
        return res.send({reservations});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting reservations'});
    }
}

exports.updatedReservation = async(req, res) =>{
    try {
        let reservationId = req.params.id;
        let data = req.body;
        let userId = req.user.sub;
        let reservationExist = await ReservationEvent.findOne({_id: reservationId});
        if(!reservationExist) return res.status(404).send({message: 'Reservation not found'});
        if((reservationExist.user).toString() !== userId) return res.status(401).send({message: 'You can not update a reservation from another user'})
        let reservationOnThisDate = await ReservationEvent.findOne({hotel: reservationExist.hotel, dateEvent: data.dateEvent});
        if(reservationOnThisDate) return res.send({message: 'There is already a reservation for this day'});
        let event = await Event.findOne({_id: reservationExist.event});
        let newCost =reservationExist.cost - (event.costPerHour * reservationExist.hoursEvent) + (event.costPerHour * data.hoursEvent);
        let params = {
            dateEvent: data.dateEvent,
            hoursEvent: data.hoursEvent,
            cost: newCost
        };
        let updatedReservation = await ReservationEvent.findOneAndUpdate({_id: reservationExist._id}, params, {new:true});
        return res.send({message: 'Updated Reservation', updatedReservation});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: 'Error updating reservation'});
    }
}

exports.deleteReservation = async(req, res) => {
    try{
        let reservationId = req.params.id;
        let reservation = await ReservationEvent.findOne({_id: reservationId});
        if(!reservation) return res.status.send({message: 'Reservation not found'});
        let deletedReservation = await ReservationEvent.findOneAndDelete({_id: reservationId});
        return res.send({message: 'Reservation deleted', deletedReservation});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting reservation'});
    }
}

exports.setState = async (req, res)=>{
    try {
        let reservations = await ReservationEvent.find();
        let date = new Date();
        for(let i = 0; i<reservations.length; i++) {
            console.log( (reservations[i].dateEvent).getDate() , (date).getDate() );
            if((reservations[i].dateEvent).getDate() == (date).getDate() && (reservations[i].dateEvent).getMonth() == (date).getMonth()){
                let updatedReservation = await ReservationEvent.findOneAndUpdate({_id: reservations[i]._id}, {state: 'ACTIVE'}, {new: true});
            }
            if((reservations[i].dateEvent).getDate() !== (date).getDate()){
                let updatedReservation = await ReservationEvent.findOneAndUpdate({_id: reservations[i]._id}, {state: 'DISABLED'}, {new: true});
            }    
        }
    } catch (error) {
        return console.error(error);
    }
}