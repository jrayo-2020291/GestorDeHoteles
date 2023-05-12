'use strict'

const express = require('express');
const api = express.Router();
const reservationController = require('./reservationRoom.controller');
const { ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/test/:id', reservationController.test);
api.get('/setState', reservationController.setState);
api.post('/add', ensureAuth, reservationController.addReservation);
api.put('/addRoom/:id', ensureAuth, reservationController.addRoom);
api.put('/removeRoom/:id', ensureAuth, reservationController.substractRoom);
api.put('/addService/:id', ensureAuth, reservationController.addService);
api.put('/removeService/:id', ensureAuth, reservationController.removeService);
api.get('/getReservation/:id', ensureAuth, reservationController.getReservation);
api.get('/getReservationByUser/:id', [ensureAuth, isAdmin], reservationController.getReservationByUser);
api.get('/getOwnReservation', [ensureAuth], reservationController.getOwnReservations);
api.get('/get', [ensureAuth, isAdmin], reservationController.getReservations);
api.put('/updateReservation/:id' , ensureAuth, reservationController.updateReservation);
api.delete('/deleteReservation/:id', [ensureAuth, isAdmin], reservationController.deleteReservation);
module.exports = api;