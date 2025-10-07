const express=require("express");
const Citizenrouter=express.Router();
const jwt=require("jsonwebtoken");
const { Citizenmodel }=require("../models/Citizens");
const bcrypt=require("bcrypt");
const { JWT_SECRET }=require("../config");
const {citizenregisterSchema}=require("../utils/registervalidation");
const {loginschema}=require("../utils/loginvalidation");
// const { verifyviatoken } = require("../middleware/auth");
// const {loginschema}=require("../utils/registervalidation");
// const Citizentokenverify=require("./complaint").Citizentokenverify;
Citizenrouter.post("/register",async(req,res)=>{ 
    const {success}=citizenregisterSchema.safeParse(req.body);
    if(!success){
        return res.status(400).send({msg:"Invalid input",error:citizenregisterSchema.error});
    }
    const {name,email,password}=req.body;
    try{
        const existingCitizen=await Citizenmodel.findOne({email});
        if(existingCitizen){
            return res.status(400).send({msg:"Citizen already exists"});
        }
        const passwordHash=await bcrypt.hash(password,10);
        const Citizen=new Citizenmodel({name,email,passwordHash});
        await Citizen.save();
        const token=jwt.sign({CitizenId:Citizen._id},JWT_SECRET,{expiresIn:"1h"});
        res.status(201).send({msg:"Citizen registered successfully",Citizen:Citizen,token:token});
    }catch(err){
        res.status(400).send({msg:"Registration failed",error:err.message});
    }
});
Citizenrouter.post("/login",async(req,res)=>{ 
    const {success}=loginschema.safeParse(req.body);
    if(!success){
        return res.status(400).send({msg:"Invalid input",error:loginschema.error});
    }
    const {email,password}=req.body;
    try{
        const Citizen=await Citizenmodel.findOne({email});
        if(!Citizen){
            return res.status(400).send({msg:"Invalid credentials"});
        }
        const isPasswordValid=await bcrypt.compare(password,Citizen.passwordHash);
        if(!isPasswordValid){
            return res.status(400).send({msg:"Invalid credentials"});
        }
        const token=jwt.sign({CitizenId:Citizen._id},JWT_SECRET,{expiresIn:"1h"});
        res.status(200).send({msg:"Login successful",Citizen:Citizen,token:token});
    }catch(err){
        res.status(500).send({msg:"Login failed",error:err.message});
    }
});
module.exports=Citizenrouter;
