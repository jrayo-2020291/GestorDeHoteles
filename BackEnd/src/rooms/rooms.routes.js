'use strict'

const express = require('express');
const api = express.Router();
const roomsController = require('./rooms.controller');
const {ensureAuth, isAdmin}=require('../services/authenticated')

api.get('/', roomsController.test);
api.post('/add',[ensureAuth,isAdmin],roomsController.add);
api.delete('/delete/:id',  [ensureAuth, isAdmin] ,  roomsController.delete);
api.get('/get',ensureAuth,roomsController.get);
api.get('/get/:id',ensureAuth,roomsController.getById);
api.put('/update/:id',[ensureAuth,isAdmin],roomsController.update)
api.get('/getA/:id', ensureAuth,roomsController.getAvailability);
api.post('/getByHotel', ensureAuth, roomsController.getByHotel)


module.exports = api;