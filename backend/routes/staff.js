const express=require("express");
const Staffrouter=express.Router();
const jwt=require("jsonwebtoken");
const bcrypt=require("bcrypt");
const { JWT_SECRET } = require("../config");
const { Staffmodel }  = require("../models/Staff");
const {Adminmodel}=require("../models/Admin");
const {staffregisterSchema}=require("../utils/registervalidation");
const {loginschema}=require("../utils/loginvalidation");
// const { verifyviatoken } = require("../middleware/auth");
// const Stafftokenverify=require("./complaint").Stafftokenverify;
Staffrouter.post("/register",async(req,res)=>{ 
    const {success}=staffregisterSchema.safeParse(req.body);
    if(!success){
        return res.status(400).send({msg:"Invalid input",error:staffregisterSchema.error});
    }
    const {name,email,password,dept,location}=req.body;
    try{
        const existingStaff=await Staffmodel.findOne({email});
        if(existingStaff){
            return res.status(400).send({msg:"Staff already exists"});
        }
        const admin=await Adminmodel.findOne({dept:dept,location:location});

        const passwordHash=await bcrypt.hash(password,10);
        const Staff=new Staffmodel({name,email,passwordHash,dept,location,adminId:admin._id,taskCount:0});
        await Staff.save();
        const token=jwt.sign({StaffId:Staff._id},JWT_SECRET,{expiresIn:"1h"});
        res.status(201).send({msg:"Staff registered successfully",Staff:Staff,token:token});
    }catch(err){
        res.status(400).send({msg:"Registration failed",error:err.message});
    }
});
Staffrouter.post("/login",async(req,res)=>{ 
    const {success}=loginschema.safeParse(req.body);    
    if(!success){
        return res.status(400).send({msg:"Invalid input",error:loginschema.error});
    }
    const {email,password}=req.body;
    try{
        const Staff=await Staffmodel.findOne({email});
        if(!Staff){
            return res.status(400).send({msg:"Invalid credentials"});
        }
        const isPasswordValid=await bcrypt.compare(password,Staff.passwordHash);
        if(!isPasswordValid){
            return res.status(400).send({msg:"Invalid credentials"});
        }
        const token=jwt.sign({StaffId:Staff._id},JWT_SECRET,{expiresIn:"1h"});
        res.status(200).send({msg:"Login successful",Staff:Staff,token:token});
    }catch(err){
        res.status(500).send({msg:"Login failed",error:err.message});
    }
});
module.exports=Staffrouter;
