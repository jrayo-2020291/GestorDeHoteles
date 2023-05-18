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
            name: 'ADMIN',
            surname: 'admin',
            username: 'admin',
            password: passwordEncrypt,
            email: 'admin@kinal.edu.gt',
            phone:'12345678',
            role:'admin'
        }
        let existAdmin = await User.findOne({username: 'admin'});
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
            return res.send({message: 'User logged successfully', token, user});
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
        return res.status(500).send({message:'Error delete User'})
    }
}

exports.delete = async(req,res)=>{
    try {
        let userId = req.params.id;
        let user = await User.findOne({_id:userId})
        if(user.role==='ADMIN') return res.send({message:'Cannot delete admin'})
        let deleteUser = await User.findOneAndDelete({_id:userId});
        if(!deleteUser) return res.send({message:'User not found'})
        return res.send({message:`Account with username ${deleteUser.username} delete sucessfully`})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error delete User'})
    }
}

exports.get = async(req,res)=>{
    try {
        let userId = req.user.sub;
        let findUser = await User.find({_id: userId});
        let user2 = await User.find({_id: userId})
        let user = findUser.pop()
        if(user.role === 'ADMIN' || user.role === 'MANAGER'){
        let users = await User.find({},{__v:0});
        return res.send({users})
        } 
        return res.send({user2})
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error getting users'})
    }
}

exports.getManager = async(req,res)=>{
    try {
        let users = await User.find({role:'MANAGER'},{__v:0});
        return res.send(users)
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error geting users'})
    }
}

exports.getById = async(req,res)=>{
    try {
        let userId = req.params.id;
        let existUser = await User.findOne({_id:userId},{__v:0})
        if(!existUser) return res.send({message:'Not found User'})
        return res.send({existUser})
    } catch (error) {
        console.error(err);
        return res.status(500).send({message:'Error get User'})
    }
}

exports.getByName = async(req,res)=>{
    try {
        let users = await User.find({
            username: {
                $regex: req.body.username, 
                $options: 'i'
            }
        },{__v:0})
        return res.send(users)
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error geting User'})
    }
}

exports.addAccount = async(req,res)=>{
    try {
        let data = req.body;
        let params = {
            name:data.name,
            surname:data.surname,
            username:data.username,
            password:data.password,
            email:data.email,
            phone:data.phone,
            role:data.role
        }
        let msg = validateData(params);
        if(msg) return res.status(400).send({message: msg});
        data.password = await encrypt(data.password);
        let existUsername =await User.findOne({username: data.username});
        if(existUsername) return res.send({message:'username is already taken'});
        let existEmail = await User.findOne({email: data.email});
        if(existEmail) return res.send({message:'Email is already taken'});
        let account = new User(data);
        await account.save();
        return res.send({message: `Account created sucessfully`});
    } catch (err) {
        console.error(err)
        return res.status(500).send({message:'Error adding manager'})
    }
}

exports.updateAccount = async(req,res)=>{
    try {
        let userId = req.params.id
        let data = req.body;
        let params = {
            name:data.name,
            surname:data.surname,
            username:data.username,
            email:data.email,
            phone:data.phone
        }
        let msg = validateData(params);
        if(msg) return res.status(400).send({message: msg});
        let userExist = await User.findOne({_id:userId})
        if(!userExist) return res.send({message:'User not found'})
        if(userExist.role==='ADMIN') return res.send({message:'Cant upgrade admins'})
        if(data.username !== userExist.username){
            let user= await User.findOne({username:data.username});
            if(user) return res.send({message:'Username is in use and can not be updated'})
        }
        if(data.username!==userExist.username){
            let usernameUser = await User.findOne({username:data.username})
            if(usernameUser) return res.send({message:'This username is already in use'})
        }
        if(data.email !== userExist.email){
            let emailUser = await User.findOne({email:data.email})
            if(emailUser) return res.send({message:'This email is already in use'})
        }
        let updateOwnUser = await User.findOneAndUpdate(
            {_id:userId},
            {
            name:data.name,
            surname: data.surname,
            username:data.username,
            phone:data.phone
            },
            {new:true});
        return res.send({message:'User updated sucessfully', updateOwnUser});
            
    } catch (err) {
        console.error(err);
        return res.status(500).send({message:'Error updating Account'})
    }
}