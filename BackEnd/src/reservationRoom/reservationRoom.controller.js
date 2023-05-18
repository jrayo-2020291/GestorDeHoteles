'use strict'
const Reservation = require('./reservationRoom.model');
const User = require('../users/user.model');
const Room = require('../rooms/rooms.model');
const Hotel = require('../hotels/hotels.model');
const Service = require('../additionalServices/additionalService.model')
const { jsPDF } = require('jspdf');
require('jspdf-autotable');

exports.test = (req, res) => res.send({ message: 'Test function for reservation is running' });

exports.addReservation = async (req, res) => {
    try {
        let data = req.body;
        let userId = req.user.sub;
        let userExist = await User.findOne({ _id: userId });
        // if(userExist.role !== 'CLIENT') return res.send({message: 'Only clients can have a reservation'});
        let hotelExist = await Hotel.findOne({ _id: data.hotel });
        if (!hotelExist) return res.status(404).send({ message: 'This hotel does not exist' });
        let params = {
            dateStart: data.dateStart,
            dateEnd: data.dateEnd,
            user: userId,
            hotel: data.hotel,
            state: 'RESERVED'
        };
        let newCounter = hotelExist.counter + 1;
        let updatedHotel = await Hotel.findOneAndUpdate({ _id: data.hotel }, { counter: newCounter }, { new: true })
        let reservationExist = await Reservation.findOne({ user: params.user, dateStart: params.dateStart, dateEnd: params.dateEnd });
        if (reservationExist) return res.send({ message: 'You cannot create another reservation with this user in this date' });
        let newReservation = new Reservation(params);
        await newReservation.save();
        return res.send({ message: 'New Resevation created', newReservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating reservation' });
    }
}

exports.addRoom = async (req, res) => {
    try {
        let data = req.body;
        let reservationId = req.params.id;
        let reservationExist = await Reservation.findOne({ _id: reservationId });
        if (!reservationExist) return res.status(404).send({ message: 'Reservation not found' });
        let roomExist = await Room.findOne({ _id: data.room });
        if (!roomExist) return res.status(404).send({ message: 'Room not found' });
        if (roomExist.availability == 'NOTAVAILABLE') return res.send({ message: 'This room already reservarted' });
        if ((reservationExist.hotel).toString() !== (roomExist.hotel).toString()) return res.send({ message: 'This room is in another hotel' });
        let days = ((reservationExist.dateEnd).getTime() - (reservationExist.dateStart).getTime()) / 86400000;
        let roomOcuped = await Reservation.findOne({
            $and: [
                { dateStart: { $gte: reservationExist.dateStart } },
                { dateEnd: { $lte: reservationExist.dateEnd } },
                { 'rooms.room': roomExist._id }
            ]
        })
        if (roomOcuped) return res.send({ message: 'This room is already reserved for this date' });
        let roomAlready = await Reservation.findOne({
            $and: [
                {
                    _id: reservationId,
                    'rooms.room': roomExist._id
                }
            ]
        })
        let params = { room: roomExist._id };
        let newCost = (reservationExist.cost + roomExist.price) * days;
        if (roomAlready) return res.send({ message: 'You have already reserved this room' });
        let updatedReservation = await Reservation.findOneAndUpdate({ _id: reservationId }, { $push: { 'rooms': params }, cost: newCost }, { new: true });
        console.log(params)
        let updatedRoom = await Room.findOneAndUpdate({ _id: params.room }, { availability: 'NOT AVAILABLE' }, { new: true });
        return res.send({ message: 'New room agregated', updatedReservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error addingRoom' });
    }
}

exports.substractRoom = async (req, res) => {
    try {
        let reservationId = req.params.id;
        let data = req.body;
        let roomExist = await Room.findOne({ _id: data.roomId })
        if (!roomExist) return res.status(404).send({ message: 'Room not found' });
        let roomAlready = await Reservation.findOne({
            $and: [
                {
                    _id: reservationId,
                    'rooms.room': roomExist._id
                }
            ]
        })
        if (!roomAlready) return res.status(404).send({ message: 'You have not hired this room' });
        let reservation = await Reservation.findOne({ _id: reservationId });
        let days = ((reservation.dateEnd).getTime() - (reservation.dateStart).getTime()) / 86400000;
        let newCost = reservation.cost - (roomExist.price * days);
        let updatedReservation = await Reservation.findOneAndUpdate({ _id: reservationId }, { $pull: { 'rooms': { 'room': roomExist._id } }, cost: newCost }, { new: true });
        let updatedRoom = await Room.findByIdAndUpdate({ _id: roomExist._id }, { availability: 'AVAILABLE' }, { new: true });
        return res.send({ message: 'Room substracted', updatedReservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error substracting room from your reservation' });
    }
}

exports.addService = async (req, res) => {
    try {
        let reservationId = req.params.id;
        let data = req.body
        let reservationExist = await Reservation.findOne({ _id: reservationId });
        if (!reservationExist) return res.status(404).send({ message: 'Reservation not found' });
        let service = await Service.findOne({ _id: data.service });
        if (!service) return res.status(404).send({ message: 'Service not found' });
        if (service.category !== 'ROOM') return res.send({ message: 'This service only for events' });
        let serviceAlready = await Reservation.findOne({
            $and: [{ _id: reservationId, 'additionalServices.service': service._id }]
        })
        if (serviceAlready) return res.status(200).send({ message: 'Service already contrated' });
        let params = { service: service._id };
        let newCost = reservationExist.cost + service.cost;
        let updatedReservation = await Reservation.findOneAndUpdate({ _id: reservationId }, { $push: { 'additionalServices': params }, cost: newCost }, { new: true });
        return res.status(200).send({ message: 'New Service contrated', updatedReservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error adding service in your reservation' });
    }
}

exports.removeService = async (req, res) => {
    try {
        let reservationId = req.params.id;
        let data = req.body;
        let reservationExist = await Reservation.findOne({ _id: reservationId });
        if (!reservationExist) return res.status(404).send({ message: 'Reservation not found' });
        let service = await Service.findOne({ _id: data.service });
        if (!service) return res.status(404).send({ message: 'Service not found' });
        let serviceExistInReservation = await Reservation.findOne({
            $and: [{ _id: reservationId, 'additionalServices.service': service._id }]
        })
        if (!serviceExistInReservation) return res.status(200).send({ message: 'You do not have contrated this service' });
        let newCost = reservationExist.cost - service.cost;
        let updatedReservation = await Reservation.findOneAndUpdate({ _id: reservationId }, { $pull: { 'additionalServices': { 'service': service._id } }, cost: newCost }, { new: true });
        return res.send({ message: 'Removed service', updatedReservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error removing service' });
    }
}

exports.getReservations = async (req, res) => {
    try {
        let reservations = await Reservation.find().populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
        if (!reservations) return res.status(404).send({ message: 'Reservations not found' });
        return res.send({ reservations });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting reservations' });
    }
}

exports.getReservation = async (req, res) => {
    try {
        let reservationId = req.params.id;
        let reservation = await Reservation.findOne({ _id: reservationId }).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
        if (!reservation) return res.status(404).send({ message: 'Reservation not found' });
        return res.send({ reservation });
    } catch (err) {
        console.error(err);
        return res.send({ message: 'Error getting reservation' });
    }
}

exports.getReservationByUser = async (req, res) => {
    try {
        let userId = req.params.id;
        let reservations = await Reservation.find({ user: userId }).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
        if (!reservations) return res.send({ message: 'This user not have reservations o not exist' });
        return res.send({ reservations });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting reservations' });
    }
}

exports.getOwnReservations = async (req, res) => {
    try {
        let userId = req.user.sub;
        let reservations = await Reservation.find({ user: userId }).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
        if (!reservations) return res.send({ message: 'This user not have reservations o not exist' });
        return res.send({ reservations });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Reservations not found' });
    }
}

exports.getReservationsByHotel = async (req, res) => {
    try {
        let hotelId = req.body;
        let hotelExist = await Hotel.findOne({ _id: hotelId.id });
        if (!hotelExist) return res.status(404).send({ message: 'This hotel does not exist' });
        let reservations = await Reservation.find({ hotel: hotelId.id }).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
        if (!reservations) return res.status(404).send({ message: 'This hotel has no reservations' });
        return res.send({ reservations });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting reservations' });
    }
}

exports.getReservationsGeneral = async (req, res) => {
    try {
        let userId = req.user.sub;
        let findUser = await User.findOne({ _id: userId });
        if (findUser.role == 'ADMIN' || findUser.role == 'MANAGER') {
            let reservations = await Reservation.find({state: 'RESERVED'}).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
            if (!reservations) return res.status(404).send({ message: 'Reservations not found' });
            return res.send({ reservations });
        }
        if (findUser.role == 'CLIENT') {
            let reservations = await Reservation.find({ user: userId, state: 'RESERVED' }).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
            if (!reservations) return res.status(404).send({ message: 'Reservations not found' });
            return res.send({ reservations });
        }
        return res.status(404).send({ message: 'User not found' });
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting reservations' });
    }
}

exports.getReservationsGeneral2 = async (req, res) => {
    try {
        let userId = req.user.sub;
        let findUser = await User.findOne({ _id: userId });
        if (findUser.role == 'ADMIN' || findUser.role == 'MANAGER') {
            let reservations = await Reservation.find({state: 'INVOICED'}).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
            if (!reservations) return res.status(404).send({ message: 'Reservations not found' });
            return res.send({ reservations });
        }
        if (findUser.role == 'CLIENT') {
            let reservations = await Reservation.find({ user: userId, state: 'INVOICED' }).populate('user').populate('hotel').populate('additionalServices.service').populate('rooms.room');
            if (!reservations) return res.status(404).send({ message: 'Reservations not found' });
            return res.send({ reservations });
        }
        return res.status(404).send({ message: 'User not found' });
    } catch (error) {
        console.error(error)
        return res.status(500).send({ message: 'Error getting reservations' });
    }
}

exports.updateReservation = async (req, res) => {
    try {
        let reservationId = req.params.id;
        console.log(reservationId)
        let data = req.body;
        let userId = req.user.sub;
        let reservationExist = await Reservation.findOne({ _id: reservationId });
        console.log(reservationExist)
        if (!reservationExist) return res.status(404).send({ message: 'Reservation not found' });
        if ((reservationExist.user).toString() !== (userId).toString()) return res.send({ message: 'You can not update someone else reservation' });
        let newDateStart = new Date(data.dateStart);
        let newDateEnd = new Date(data.dateEnd);
        let newDays = ((newDateEnd).getTime() - (newDateStart).getTime()) / 86400000;
        let days = ((reservationExist.dateEnd).getTime() - (reservationExist.dateStart).getTime()) / 86400000;
        for (let i = 0; i < reservationExist.rooms.length; i++) {
            let room = reservationExist.rooms[i].room;
            let roomE = await Room.findOne({ _id: room });
            let roomOcuped = await Reservation.find({
                $and: [
                    { dateStart: { $gte: data.dateStart } },
                    { dateEnd: { $lte: data.dateEnd } },
                    { 'rooms.room': roomE._id }
                ]
            })
            if (roomOcuped._id) return res.send({ message: 'This room is already reserved for this date' });
            let newCost = reservationExist.cost - (roomE.price * days) + (roomE.price * newDays)
            let updatedReservation1 = await Reservation.findOneAndUpdate({ _id: reservationExist._id }, { cost: newCost }, { new: true });
        }
        let params = {
            dateStart: data.dateStart,
            dateEnd: data.dateEnd
        }
        let updatedReservation = await Reservation.findOneAndUpdate({ _id: reservationExist._id }, params, { new: true });
        return res.send({ message: 'Updated Date', updatedReservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating reservation' });
    }
}

// exports.setState = async()=>{
//     try{
//         let reservation = await Reservation.find()
//         let date = new Date()
//         for(let i = 0; i < reservation.length; i++){
//             let time = (reservation[i].dateStart) - (date);
//             let time1 = (reservation[i].dateEnd) - (date);
//             if(time < 0 && time1 > 0){
//                 let updatedReservation = await Reservation.findOneAndUpdate({_id: reservation[i]._id}, {state: "ACTIVE"}, {new: true});
//             }
//             if(time1 <0 && time>0){
//                 let updatedReservation1  = await Reservation.findOneAndUpdate({_id: reservation[i]._id}, {state: "DISABLED"}, {new:true});
//             }
//         }
//     }catch(err){
//         return console.error(err);
//     }
// }

exports.setState = async (req, res) => {
    try {
        let reservationId = req.params.id 
        let reservation = await Reservation.findOne({_id: reservationId}).populate('user').populate('rooms')
        if (reservation.rooms.length === 0) return res.send({message: 'No se ha agregado ninguna habitación a la reservación'})
        let updatedReservation = await Reservation.findOneAndUpdate({ _id: reservationId}, { state: "INVOICED" }, { new: true });
        res.send({message: `Pago de Reservación a nombre de ${reservation.user.surname} correctamente efectuado`})
    } catch (err) {
    return console.error(err);
}
}

exports.changeRooms = async (req, res) => {
    try {
        let reservation = await Reservation.find();
        if (!reservation) return console.log('Reservations not found');
        for (let i = 0; i < reservation.length; i++) {
            if ((reservation[i].state).toString() == 'ACTIVE') {
                for (let a = 0; a < reservation[i].rooms.length; a++) {
                    let reservation1 = await Reservation.findOne({ _id: reservation[i]._id })
                    let idRoom = reservation1.rooms[a].room;
                    let roomDisabled = await Room.findOneAndUpdate({ _id: idRoom }, { availability: 'NOTAVAILABLE' }, { new: true })
                }
            }
            if ((reservation[i].state).toString() == 'DISABLED') {
                for (let a = 0; a < reservation[i].rooms.length; a++) {
                    let reservation1 = await Reservation.findOne({ _id: reservation[i]._id })
                    let idRoom = reservation1.rooms[a].room;
                    let roomAvailable = await Room.findOneAndUpdate({ _id: idRoom }, { availability: 'AVAILABLE' }, { new: true });
                }
            }
        }
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error changing the availability of a room' })
    }
}

exports.deleteReservation = async (req, res) => {
    try {
        let reservationId = req.params.id;
        let reservation = await Reservation.findOne({ _id: reservationId });
        if (!reservation) return res.status.send({ message: 'Reservation not found' });
        for (let i = 0; i < reservation.rooms.length; i++) {
            let roomId = reservation.rooms[i].room;
            let roomAvailable = await Room.findOneAndUpdate({ _id: roomId }, { availability: 'AVAILABLE' }, { new: true });
            if (!roomAvailable) return res.status(404).send({ message: 'Room not found' });
        }
        let deletedReservation = await Reservation.findOneAndDelete({ _id: reservationId });
        return res.send({ message: 'Reservation deleted', deletedReservation });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting reservation' });
    }
}

exports.createReport = async (req, res) => {
    try {
        let doc = new jsPDF('portrait', 'px', 'letter');
        let col = ["Index", "Date", "Date-End", "Cost", "User"];
        let col2 = ["Index", "Hotel", "Location"];
        let col3 = ["Index", "Room", "Cost x Night"]
        let col4 = ["Index", "Service", "Cost"];
        let rows = []; let rows2 = []; let rows3 = []; let rows4 = [];
        let rowItem = []; let rowItem2 = []; let rowItem3 = [];

        let reservations = await Reservation.find();
        for (let i = 0; i < reservations.length; i++) {
            let userId = reservations[i].user;
            let hotel = reservations[i].hotel;
            let findUser = await User.findOne({ _id: userId });
            let findHotel = await Hotel.findOne({ _id: hotel });

            for (let a = 0; a < reservations[i].rooms.length; a++) {
                let idRoom = reservations[i].rooms[a].room;
                let room = await Room.findOne({ _id: idRoom });
                rowItem2.push({ index: i, room: room.noRoom, cost: room.price });
            }
            for (let e = 0; e < reservations[i].additionalServices.length; e++) {
                let idService = reservations[i].additionalServices[e].service;
                let service = await Service.findOne({ _id: idService });
                rowItem3.push({ index: i, service: service.name, cost: service.cost });
            }
            let dateReservationI = new Date(reservations[i].dateStart).toLocaleDateString();
            let dateReservationE = new Date(reservations[i].dateEnd).toLocaleDateString();
            rowItem.push({
                index: i, date: dateReservationI, dateE: dateReservationE, cost: reservations[i].cost,
                user: findUser.name + " " + findUser.surname, hotel: findHotel.name, location: findHotel.locationH
            });
        }
        doc.setFont('Helvetica', 'bold');
        doc.text("Report - Reservations Rooms", 147, 35)

        rowItem2.forEach(element => {
            let temp3 = [element.index, element.room, element.cost]
            rows3.push(temp3);
        });
        rowItem3.forEach(element => {
            let temp4 = [element.index, element.service, element.cost];
            rows4.push(temp4);
        });
        rowItem.forEach(element => {
            let temp = [element.index, element.date, element.dateE, element.cost, element.user];
            let temp2 = [element.index, element.hotel, element.location];
            rows.push(temp);
            rows2.push(temp2);
            doc.setFont('Helvetica', 'normal');
            doc.autoTable(col, rows, { startY: 60 });
            doc.autoTable(col2, rows2, { startY: 100 });
            doc.autoTable(col3, rows3, { startY: 140 });
            doc.autoTable(col4, rows4, { startY: 240 });
            doc.addPage('letter', 'portrait')
            rows = [];
            rows2 = [];
            rows3 = [];
            rows4 = [];
        });
        let date = new Date().toDateString();
        doc.save(`Report Reservations Rooms-${date}.pdf`);
        return res.send({ message: 'Report Created' })
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error creating report' });
    }
}