'use strict'

const Hotel = require('./hotels.model');
const Category = require('../hotels/hotels.model');
const mongoose = require('mongoose');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.add = async(req,res)=>{
    try {
        let data = req.body;
        let hotel = new Hotel(data);
        await hotel.save()
        return res.send({message:'hotel created sucessfully', hotel});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error adding Hotel'})    
    }
}

exports.get = async(req,res)=>{
    try {
        let hotels = await Hotel.find({});
        return res.send(hotels);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get Hotels'})
    }
}
