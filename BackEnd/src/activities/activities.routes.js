'use strict'

const activitiesController = require('./activities.controller');
const express = require('express');
const api = express.Router();
const {ensureAuth, isAdmin} = require('../services/authenticated');

api.get('/', activitiesController.test);
api.post('/add',)

module.exports = api;