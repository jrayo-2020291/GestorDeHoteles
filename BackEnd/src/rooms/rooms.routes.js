'use strict'

const express = require('express');
const api = express.Router();
const roomsController = require('./rooms.controller');
const {ensureAuth, isAdmin}=require('../services/authenticated')

api.get('/', roomsController.test);
api.post('/add',[ensureAuth,isAdmin],roomsController.add);

module.exports = api;