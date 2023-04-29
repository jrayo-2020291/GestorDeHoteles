'use strict'

const express = require('express');
const api = express.Router();
const servicesController = require('./additionalServices.controller')
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/test', servicesController.test);
api.post('/addService', [ensureAuth, isAdmin],servicesController.addService);
api.get('/getServices',  ensureAuth,  servicesController.getServices);
api.get('/get/:id',  ensureAuth,  servicesController.getServiceById);
api.post('/search',  ensureAuth,   servicesController.getByName);
api.put('/update/:id',  [ensureAuth, isAdmin],  servicesController.update);
api.delete('/delete/:id',  [ensureAuth, isAdmin] ,  servicesController.delete);

module.exports = api;