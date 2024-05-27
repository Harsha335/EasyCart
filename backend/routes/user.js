const express = require("express");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");
const router = express.Router();

//UPDATE user with id
router.put("/:id", verifyTokenAndAuthorization, async (req,res)=>{
    if(req.body.password){
        const encryptedPassword = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
        req.body.password = encryptedPassword;
    }
    try{
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set : req.body
        },{new: true});//for updated user return
        res.status(200).json(updatedUser);
    }catch(err){
        res.status(500).json(err);
    }
});

//DELETE user with id
router.delete("/:id", verifyTokenAndAuthorization, async (req, res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({"success": true, "message": "User successfully deleted"});
    }catch(error){
        res.status(500).json({"success": false,"message": error});
    }
});

//GET, find user with id - Admin
router.get("/find/:id", verifyTokenAndAdmin,async (req, res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json({"success":true, others});
    }catch(err){
        res.status(500).json({"success":false, "message": err});
    }
});

//GET, find all users - Admin
router.get("/", verifyTokenAndAdmin, async (req, res)=>{
    try{        
        const users = await User.find();
        // const {password, ...others} = user._doc;
        res.status(200).json({"success":true, users});
    }catch(err){
        res.status(500).json({"success":false, "message": err});
    }
});

module.exports = router;