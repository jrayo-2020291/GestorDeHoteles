'use strict'

const userController = require('./user.controller');
const express = require('express');
const api = express.Router();
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/', userController.test);

module.exports = api;