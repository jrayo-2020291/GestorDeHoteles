'use strict'

const User = require('./user.model')
const { validateData, encrypt, checkPassword, checkUpdate } = require('../utils/validate');
const { createToken } = require('../services/jwt');

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

exports.login = async(req, res)=>{
    try{
        let data = req.body;
        let credentials = {
            username: data.username,
            password: data.password
        }
        let msg = validateData(credentials);
        if(msg) return res.status(400).send({message: msg});
        let user = await User.findOne({username: data.username});
        if(user && await checkPassword(data.password, user.password)) {
            let token = await createToken(user)
            return res.send({message: 'User logged successfully', token});
        }
        return res.status(404).send({message: 'Invalid credentials'});
    }catch(err){
        console.error(err);
        return res.status(500).send({message: 'Error not logged'});
    }
}

exports.updateOwnUser = async(req,res)=>{
    try {
        let userId = req.user.sub
        let data = req.body;
        if(data.name===''||data.surname===''||data.username===''||data.password===''||data.phone==='') return res.send({message:'cannot send blank spaces'})
        data.password = await encrypt(data.password);
        //
        let userExist = await User.findOne({_id:userId})
        if(data.username !== userExist.username){
            let user= await User.findOne({username:data.username});
            if(user) return res.send({message:'Username is in use and can not be updated'})
        }
        //
        if(userExist && await checkPassword(data.passwordCurrent, userExist.password)) {
            let updateOwnUser = await User.findOneAndUpdate(
                {_id:userId},
                {
                name:data.name,
                surname: data.surname,
                username:data.username,
                phone:data.phone,
                password: data.password
                },
                {new:true});
            return res.send({message:'User updated sucessfully', updateOwnUser});
            
        }
        return res.send({message:'wrong current password'})
        
    } catch (err) {
        console.error(err);
        return res.status(500).send({mesage:'Error updating User'})
    }
}

exports.deleteOwnUser = async(req,res)=>{
    try {
        let userId = req.user.sub;
        let deleteUser = await User.findOneAndDelete({_id:userId});
        if(!deleteUser) return res.send({message:'User not found'})
        return res.send({message:`Account with username ${deleteUser.username} delete sucessfully`})
    } catch (err) {
        console.error(err);
        return res.status(500).Usersend({message:'Error delete User'})
    }
}

exports.get = async(req,res)=>{
    try {
        let users = await User.find({},{__v:0});
        return res.send(users)
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error geting users'})
    }
}

exports.getById = async(req,res)=>{
    try {
        let userId = req.params.id;
        let existUser = await User.findOne({_id:userId})
        if(!existUser) return res.send({message:'Not found User'})
        return res.send(existUser)
    } catch (error) {
        console.error(err);
        return res.status(500).send({message:'Error get User'})
    }
}