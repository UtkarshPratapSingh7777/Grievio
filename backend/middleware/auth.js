const {Citizenmodel}=require("../models/Citizens");
const {Adminmodel}=require("../models/Admin");
const {Staffmodel}=require("../models/Staff");
const jwt=require("jsonwebtoken");
const { JWT_SECRET }=require("../config");

async function citizenTokenVerify(req,res,next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ msg: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const citizen=await Citizenmodel.findById(decoded.CitizenId);
        if(!citizen){
            return res.status(401).send({ msg: "Invalid token" });
        }
        req.citizen = citizen;
        next();
    } catch (err) {
        return res.status(401).send({ msg: "Invalid token" });
    }
}
async function adminTokenVerify(req,res,next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ msg: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin=await Adminmodel.findById(decoded.adminId);
        if(!admin){
            return res.status(401).send({ msg: "Invalid token" });
        }
        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).send({ msg: "Invalid token" });
    }
}
async function staffTokenVerify(req,res,next) {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ msg: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const staff=await Staffmodel.findById(decoded.StaffId);
        if(!staff){
            return res.status(401).send({ msg: "Invalid token" });
        }
        req.staff = staff;
        next();

    } catch (err) {
        return res.status(401).send({ msg: "Invalid token" });
    }   
}
async function verifyviatoken(req,res,next){
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).send({ msg: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        if(decoded.adminId){
            const admin=await Adminmodel.findById(decoded.adminId);
            if(!admin){
                return res.status(401).send({ msg: "Invalid token" });
            }
            req.admin = admin;
            res.json({
                "msg":"Valid token ","admin":admin
            })
            next();
        }else if(decoded.StaffId){
            const staff=await Staffmodel.findById(decoded.StaffId);
            if(!staff){
                return res.status(401).send({ msg: "Invalid token" });
            }
            req.staff = staff;
            res.json({
                "msg":"Valid token ","staff":staff
            })
            next();
        }else if(decoded.CitizenId){
            const citizen=await Citizenmodel.findById(decoded.CitizenId);
            if(!citizen){
                return res.status(401).send({ msg: "Invalid token" });
            }
            req.citizen = citizen;
            res.json({
                "msg":"Valid token ","citizen":citizen
            })
            next();
        }else{
            return res.status(401).send({ msg: "Invalid token" });
        }
    } catch (err) {
        return res.status(401).send({ msg: "Invalid token" });
    }   
}   
module.exports={citizenTokenVerify,adminTokenVerify,staffTokenVerify,verifyviatoken};