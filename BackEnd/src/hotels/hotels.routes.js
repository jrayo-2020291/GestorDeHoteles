'use strict'

const express = require('express');
const api = express.Router();
const hotelsController = require('./hotels.controller');
const {ensureAuth, isAdmin}=require('../services/authenticated')


api.get('/', hotelsController.test);
api.post('/addHotel', [ensureAuth,isAdmin], hotelsController.add)
api.get('/get',ensureAuth, hotelsController.get)
api.get('/getById/:id',[ensureAuth,isAdmin],hotelsController.getById)
api.post('/getByName', ensureAuth, hotelsController.getByName)
api.post('/getbyLocation',ensureAuth,hotelsController.getByLocation)
api.put('/addEvent/:id',[ensureAuth,isAdmin], hotelsController.addEvent)
api.put('/deleteEvent/:id',[ensureAuth,isAdmin], hotelsController.deleteEvent)
api.put('/update/:id',[ensureAuth,isAdmin],hotelsController.update)

module.exports = api;