'use strict'

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet'); 
const cors = require ('cors');
const app = express();
//constante del puerto
const port = process.env.PORT || 3200;  
const userRoutes = require('../src/users/user.routes');
const servicesRoutes = require('../src/additionalServices/additionalService.routes')


//configurar el servidor de http en express
app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

//rutas de cada coleccion
app.use('/user', userRoutes)
app.use('/services', servicesRoutes);


//fucion para levantar el servidor
exports.initServer = ()=>{
    app.listen(port);
    console.log(`Server http running in port ${port}`);
}