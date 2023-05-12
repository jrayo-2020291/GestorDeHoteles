'use strict'

const express = require('express');
const api = express.Router();
const roomsController = require('./rooms.controller');
const {ensureAuth, isAdmin}=require('../services/authenticated')

api.get('/', roomsController.test);
api.post('/add',[ensureAuth,isAdmin],roomsController.add);
api.delete('/delete/:id',  [ensureAuth, isAdmin] ,  roomsController.delete);
api.get('/get',[ensureAuth,isAdmin],roomsController.get);
api.put('/update/:id',[ensureAuth,isAdmin],roomsController.update)
api.get('/getA',[ensureAuth,isAdmin],roomsController.getAvailability);


module.exports = api;