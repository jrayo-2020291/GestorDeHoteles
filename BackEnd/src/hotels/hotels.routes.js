'use strict'

const express = require('express');
const api = express.Router();
const hotelsController = require('./hotels.controller');
const {ensureAuth, isAdmin}=require('../services/authenticated')


api.get('/', hotelsController.test);
api.post('/addHotel', [ensureAuth,isAdmin], hotelsController.add)
api.get('/get', hotelsController.get)

module.exports = api;