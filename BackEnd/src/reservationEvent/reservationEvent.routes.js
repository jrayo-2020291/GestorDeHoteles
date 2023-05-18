'use strict';

const express = require('express');
const api = express.Router();
const reservationEventController = require('./reservationEvent.controller')
const {ensureAuth, isAdmin} = require('../services/authenticated')

api.get('/test', reservationEventController.test)
api.post('/addReservation', [ensureAuth], reservationEventController.add);
api.put('/addService/:id', ensureAuth, reservationEventController.addService);
api.put('/removeService/:id', ensureAuth, reservationEventController.removeService);
api.get('/get', [ensureAuth, isAdmin],reservationEventController.getReservations);
api.get('/getReservation/:id', ensureAuth,reservationEventController.getReservation);
api.get('/getReservationByUser/:id', [ensureAuth, isAdmin], reservationEventController.getReservationsByUser);
api.get('/getOwnReservation', ensureAuth,reservationEventController.getOwnReservations);
api.get('/getReservationsByHotel/:id',[ensureAuth, isAdmin], reservationEventController.getReservationsByHotel);
api.get('/getReservationsGeneral', ensureAuth, reservationEventController.getReservationsGeneral);
api.get('/getReservationsGeneral2', ensureAuth, reservationEventController.getReservationsGeneral2);
api.put('/updateReservation/:id', ensureAuth,reservationEventController.updatedReservation);
api.delete('/deleteReservation/:id', [ensureAuth, isAdmin], reservationEventController.deleteReservation);
api.get('/createReport', reservationEventController.createReport);
api.put('/setState/:id', reservationEventController.setState);
module.exports = api;