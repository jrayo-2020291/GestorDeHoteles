'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/', userController.test);
api.post('/registerUser', userController.registerUser);
api.post('/login',userController.login);
api.put('/updateOwnUser', ensureAuth,userController.updateOwnUser);
api.delete('/deleteOwnUser', ensureAuth, userController.deleteOwnUser);
api.get('/get',[ensureAuth,isAdmin], userController.get)

module.exports = api;