'use strict'

require('dotenv').config();
const mongoConfig = require('./configs/mongo');
const app = require('./configs/app')
const userController = require('./src/users/user.controller')
const reservationController = require('./src/reservationRoom/reservationRoom.controller')
const reservationEventController = require('./src/reservationEvent/reservationEvent.controller');

mongoConfig.connect();
app.initServer();
userController.addAdminInitial();
reservationController.setState();
reservationController.changeRooms();
reservationEventController.setState();
