'use strict'

const express = require('express');
const api = express.Router();
const eventsController = require('./events.controller');
const { ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/test', eventsController.test);
api.post('/addEvent', [ensureAuth, isAdmin], eventsController.addEvent);
api.get('/getEvents',  ensureAuth,   eventsController.getEvents);
api.get('/get/:id',  ensureAuth,   eventsController.getById);
api.post('/search',  ensureAuth,   eventsController.getByName);
api.put('/update/:id',  [ensureAuth, isAdmin] ,  eventsController.update);
api.delete('/delete/:id',  [ensureAuth, isAdmin] ,  eventsController.delete);

module.exports = api