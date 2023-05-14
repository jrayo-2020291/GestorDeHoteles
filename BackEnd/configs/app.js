'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet'); 
const cors = require ('cors');
const app = express();
//constante del puerto
const port = process.env.PORT || 3200;  
const userRoutes = require('../src/users/user.routes');
const servicesRoutes = require('../src/additionalServices/additionalService.routes');
const eventsRoutes = require('../src/events/events.routes');
const hotelsRoutes = require('../src/hotels/hotels.routes')
const roomRoutes = require('../src/rooms/rooms.routes')
const activitiesRoutes = require('../src/activities/activities.routes')
const reservationRoomRoutes = require('../src/reservationRoom/reservationRoom.routes')
const reservationEventRoutes = require('../src/reservationEvent/reservationEvent.routes')

//configurar el servidor de http en express
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

//rutas de cada coleccion
app.use('/user', userRoutes)
app.use('/services', servicesRoutes);
app.use('/events', eventsRoutes);
app.use('/hotel', hotelsRoutes)
app.use('/room',roomRoutes)
app.use('/activities',activitiesRoutes)
app.use('/reservationRoom', reservationRoomRoutes);
app.use('/reservationEvent', reservationEventRoutes);

//fucion para levantar el servidor
exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}