'use strict'
const Services = require('./additionalService.model');

exports.test = (req, res)=>{
    return res.send({message: 'Test function for Additional Services is running'});
}

exports.addService = async(req, res)=>{
    try{
        let data = req.body;
        let params = {
            name: data.name,
            description: data.description,
            cost: data.cost
        }
        let existService = await Services.findOne({name: params.name});
        if(existService) return res.send({message: 'This service already exist'});
        let newService = new Services(params);
        await newService.save();
        return res.status(201).send({message: 'New service created;', newService});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating service'});
    }
}

exports.getServices = async(req, res)=>{
    try{
        let services = await Services.find();
        return res.send({services})
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error getting services'});
    }
}

exports.getServiceById = async(req, res)=>{
    try{
        let serviceId = req.params.id;
        let service = await Services.findOne({_id: serviceId});
        if(!service) return res.status(404).send({message: 'Service not found'});
        return res.send({service});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error getting service'});
    }
}

exports.getByName = async(req, res)=>{
    try{
        let data = req.body;
        let name = {
            name: data.name
        };
        if(name.name === '') return res.send({message: 'Service not found'});
        let services = await Services.find({
            name: {
                $regex:name.name,
                $options: 'i'
            }
        });
        return res.send({services});
    }catch(err){
        console.log(err);
        return res.status(500).send({message: 'Error searching service'});
    }
}

exports.update = async(req, res) =>{
    try{
        let serviceId = req.params.id;
        let data = req.body;
        let params = {
            name: data.name,
            description: data.description,
            cost: data.cost
        }
        let serviceExist = await Services.findOne({_id: serviceId});
        if(!serviceExist) return res.status(404).send({message: 'Service not found'});
        let updatedService = await Services.findOneAndUpdate({_id: serviceId}, params, {new: true});
        if(!updatedService) return res.status(404).send({message: 'Service not found and not updated'});
        return res.send({message: 'Service updated:', updatedService});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error updating service'});
    }
}

exports.delete = async(req, res)=>{
    try{
        let serviceId = req.params.id;
        let deletedService = await Services.findOneAndDelete({_id: serviceId});
        if(!deletedService) return res.status(404).send({message: 'Service not found and not deleted'});
        return res.send({message: 'Service deleted', deletedService});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error deleting service'});
    }
}