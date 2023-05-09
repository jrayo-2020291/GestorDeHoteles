'use strict'

const Activity = require('./activities.model')

exports.test = (req, res) =>{
    res.send({message: 'Test function for Activities is running'});
}

exports.add = async(req,res)=>{
    try {
        let data = req.body;
        let activity = new Activity(data);
        await activity.save();
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error adding Activities'})
    }
}