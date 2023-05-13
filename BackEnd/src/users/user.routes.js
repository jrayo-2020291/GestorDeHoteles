'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/', userController.test);
api.post('/registerUser', userController.registerUser);
api.post('/login',userController.login);
api.post('/addAccount',[ensureAuth,isAdmin],userController.addAccount);
api.put('/updateOwnUser', ensureAuth,userController.updateOwnUser);
api.put('/updateAccount/:id',[ensureAuth,isAdmin],userController.updateAccount);
api.delete('/deleteOwnUser', ensureAuth, userController.deleteOwnUser);
api.delete('/delete/:id', [ensureAuth,isAdmin], userController.delete);
api.get('/get',ensureAuth, userController.get);
api.get('/getById/:id', [ensureAuth,isAdmin], userController.getById);
api.post('/getByName',[ensureAuth, isAdmin],userController.getByName);

module.exports = api;