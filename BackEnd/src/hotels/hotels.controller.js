'use strict'

const Hotel = require('./hotels.model');
const User = require('../users/user.model')
const Event = require('../events/events.model');
const {validateData} = require('../utils/validate')
const mongoose = require('mongoose');
const {jsPDF} = require('jspdf');
require('jspdf-autotable');

exports.test = (req, res)=>{
    res.send({message: 'Test function is running'});
}

exports.add = async(req,res)=>{
    try {
        let data = req.body;
        let validate = validateData(data);
        let existUser = await User.findOne({ _id: data.manager });  
        if(validate) return res.status(400).send({validate})
    if (!existUser) {
      return res.send({ message: "User not found" });
    }
    let existUsers = await Hotel.findOne({manager:data.manager});
    if(existUsers){
        return res.send({message:'User already has an hotel'})
    }
        let existHotel = await Hotel.findOne({ name: data.name });  
    if (existHotel) {
      return res.send({ message: "Hotel already created" });
    }
      let hotel = new Hotel(data);
        await hotel.save();
        return res.send({message:'hotel created sucessfully', hotel});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error adding Hotel'})    
    }
};

exports.get = async(req,res)=>{
    try {
        let hotels = await Hotel.find({}).populate('manager');
        return res.send({hotels});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error getting Hotels'})
    }
}

exports.addEvent = async(req,res)=>{
    try {
        let hotelId = req.params.id;
        let event = await Event.findOne({_id:req.body.event});
        let hotel = await Hotel.findOne({_id:hotelId});
    for(let i=0;i<hotel.events.length;i++){
        const idEnString = hotel.events[i].toString();
        if(req.body.event===idEnString)
        return res.send({message:'This event is already registered at the hotel'})
    } 
        if(!event) return res.send({message:'Event not found'})
        let updateHotel = await Hotel.findOneAndUpdate(
            {_id:hotelId},
            {$push:{events:req.body.event}},
            {new:true});
        if(!updateHotel) return res.send({message:'hotel not found and not update'});
        return res.send({message:'Adding event sucessfully',updateHotel})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error add Event to Hotel'})
    }
};

exports.deleteEvent = async(req,res)=>{
    try {
        let hotelId = req.params.id;
        let event = await Event.findOne({_id:req.body.event});
        if(!event) return res.send({message:'Event not found'})
        let updateHotel = await Hotel.findOneAndUpdate(
            {_id:hotelId},
            {$pullAll:{events:[req.body.event]}},
            {new:true});
        if(!updateHotel) return res.send({message:'hotel not found and not update'});
        return res.send({message:'Deleting sucessfully',updateHotel})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error deleting event to hotel'})
    }
}

exports.getByName = async(req,res)=>{
    try {
        let data = req.body;
        if(data.name==='') return res.send({message:'You must enter a searching'});
        let hotels = await Hotel.find({
            $or: [
                { name: { $regex: data.name, $options: 'i' } },
                { locationH: { $regex: data.name, $options: 'i' } }
            ]
          }, { __v: 0 }).populate('events', ['name']);
        return res.send({hotels});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get hotels'})
    }
};

exports.getByLocation = async(req,res)=>{
    try {
        let data = req.body;
        if(data.location==='') return res.send({message:'You must enter a location'});
        let hotels = await Hotel.find({
            locationH:{
                $regex: data.location, 
                $options: 'i'
            }
        },{__v:0}).populate('events',['name']);
        return res.send(hotels);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get hotels'})
    }
};

exports.getById = async(req,res)=>{
    try {
        let hotelId = req.params.id;
        let data = req.body;
        if(data.location==='') return res.send({message:'You must enter a location'});
        let hotel = await Hotel.findOne({_id:hotelId},{__v:0}).populate('events');
        if(!hotel) return res.send({message:'Hotel not found'})
        return res.send(hotel);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error get hotels'})
    }
};
exports.topHotel = async(req,res)=>{
    try {
        let hotels = await Hotel.find({},{manager:0}).sort({counter:-1}).limit(5);
            return res.send({message:'Top Hotels',hotels});
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error searching'});
    }
}
  exports.update = async(req,res)=>{
    try{
        let hotelId = req.params.id;
        let data=req.body;
        if(data.name=='') return res.send({message:'You have to add a valid name'})
  
        let hotel = await Hotel.findOne({name: data.name});
        if(hotel && hotel._id.toString() !== hotelId) { 
          return res.send({message: 'This Hotel already exists'});
        }
        let updatedHotel = await Hotel.findOneAndUpdate({_id: hotelId}, data, {new: true});
        if(!updatedHotel) return res.status(404).send({message: 'Hotel not found and not updated'});
        return res.send({message: 'Hotel updated', updatedHotel, name: data.name});
    } catch (err){
        console.error(err);
        return res.status(500).send({message: 'Error updating hotel'})
    }
  }
exports.delete = async(req, res)=>{
    try{
        let hotelId = req.params.id;
        let deletedHotel = await Hotel.findOneAndDelete({_id: hotelId});
        if(!deletedHotel) return res.status(404).send({message: 'Hotel not found and not deleted'});
        return res.send({message: 'Hotel deleted', deletedHotel});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting Hotel'});
    }
}

exports.convertPDF = async(req, res)=>{
    try {
        let doc = new jsPDF('portrait', 'px', 'letter');
        let col = ["Index","name", "Location", "Qualification"];
        let col2 = ["Index", "Name","Manager"];
        let rows = []; let rows2 = [];

        let hotels = await Hotel.find({}).sort({counter:-1});
        let rowItem = [];
        let rowItem2 = [];
        for(let i = 0; i < hotels.length; i++) {
            let id = (hotels[i].manager);
            let managers =await User.findOne({_id: id});
            rowItem.push({index: i, name: hotels[i].name, location: hotels[i].locationH, qualification: hotels[i].qualification, manager: managers.name + " " + managers.surname});
        }
        doc.setFont('Helvetica', 'bold');
        doc.text("Report - Hotels", 185, 35)
        rowItem.forEach(element =>{
            let temp = [element.index,element.name,element.location, element.qualification];
            let temp2 = [element.index,element.name,element.manager]
            rows.push(temp)
            rows2.push(temp2);
            doc.setFont('Helvetica', 'normal');
            doc.autoTable(col, rows, {startY: 60});
            doc.autoTable(col2, rows2, {startY: 130});
            doc.addPage('letter', 'portrait')
            rows = [];
            rows2 = [];
        })
        let date = new Date().toDateString()
        doc.save(`Report Hotel-${date}.pdf`);
        return res.send({message:'Report Created'})
    } catch (error) {
        console.error(error);
        return res.status(500).send({message: 'Error creating report'});
    }
}