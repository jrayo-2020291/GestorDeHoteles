'use strict'

const User = require('./user.model')
const {encrypt} = require('../utils/validate')

exports.test = (req, res) =>{
    res.send({message: 'Test function for User is running'});
}

exports.addAdminInitial = async(req, res)=>{
    try{
        let passwordEncrypt = await encrypt("123");
        let adminInitial = {
            name: 'Josue',
            surname: 'Noj',
            username: 'jnoj',
            password: passwordEncrypt,
            email: 'jnoj@kinal.edu.gt',
            phone:'12345678',
            role:'admin'
        }
        let existAdmin = await User.findOne({username: 'jnoj'});
        if(existAdmin) return console.log('Admin initial already created');
        let createAdminInitial = new User(adminInitial);
        await createAdminInitial.save();
        return console.log('Admin initial created');
    }catch(err){
        return console.error(err);
    }
}

exports.registerUser = async(req, res)=>{
    try{
        let data = req.body;
        if(data ===''||data.name===''||data.surname===''||data.username===''||data.password===''||data.email===''||data.phone==='') return res.send({message:'you cannot leave empty data'})
        data.password = await encrypt(data.password);
        data.role = 'CLIENT';
        let existUsername =await User.findOne({username: data.username})
        if(existUsername) return res.send({message:'username is already taken'})
        let existEmail = await User.findOne({email: data.email})
        if(existEmail) return res.send({message:'Email is already taken'});
        let account = new User(data);
        await account.save();
        return res.send({message: 'Account created sucessfully'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error creating account'});
    }
};