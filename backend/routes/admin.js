const express=require("express");
const Adminrouter=express.Router();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { JWT_SECRET } = require("../config");
const { Adminmodel } = require("../models/Admin");
const {adminregisterSchema}=require("../utils/registervalidation");
const {loginschema}=require("../utils/loginvalidation");
// const { verifyviatoken } = require("../middleware/auth");
Adminrouter.post("/register",async(req,res)=>{ 
    const {success}=adminregisterSchema.safeParse(req.body);
    if(!success){
        return res.status(400).send({msg:"Invalid input",error:adminregisterSchema.error});
    }
    const {name,email,password,dept,location}=req.body;
    try{
        const existingAdmin=await Adminmodel.findOne({email});
        if(existingAdmin){
            return res.status(400).send({msg:"Admin already exists"});
        }
        const passwordHash=await bcrypt.hash(password,10);
        const admin=await Adminmodel.create({name,email,passwordHash,dept,location});
        const token=jwt.sign({adminId:admin._id},JWT_SECRET,{expiresIn:"1h"});
        res.status(201).send({msg:"Admin registered successfully",admin:admin,token:token});
    }catch(err){
        res.status(400).send({msg:"Registration failed",error:err.message});
    }
});
Adminrouter.post("/login",async(req,res)=>{ 
    const {success}=loginschema.safeParse(req.body);
    if(!success){
        return res.status(400).send({msg:"Invalid input",error:loginschema.error});
    }
    const {email,password}=req.body;
    try{
        const admin=await Adminmodel.findOne({email});
        if(!admin){
            return res.status(400).send({msg:"Invalid credentials"});
        }
        const isPasswordValid=await bcrypt.compare(password,admin.passwordHash);
        if(!isPasswordValid){
            return res.status(400).send({msg:"Invalid credentials"});
        }
        const token=jwt.sign({adminId:admin._id},JWT_SECRET,{expiresIn:"1h"});
        res.status(200).send({msg:"Login successful",admin:admin,token:token});
    }catch(err){
        res.status(500).send({msg:"Login failed",error:err.message});
    }
});
module.exports=Adminrouter;
