const User = require("../models/User");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

router.post("/register",async (req,res)=>{
    // console.log("-----------------");
    // console.log(req.body);
    try{
        const encryptedPassword = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
        const user = new User({
            email : req.body.email,
            password : encryptedPassword
        });
        const isUserExist = User.findOne({email: req.body.email});
        if(isUserExist){
            return res.status(409).json({success: false, message: "User Email already exits"});
        }
        const savedUser = await user.save();
        console.log(savedUser);
        res.status(201).json({"message": "user created successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message:err});
    }
});

//LOGIN
router.post("/login", async (req,res)=>{
    try{
        // console.log("---------------------------------------------------");
        // console.log("user: ", req.body);
        const user = await User.findOne({email: req.body.email});
        if(!user){
            res.status(401).json({message: "Wrong credentials!"});
        }
        const OriginalPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
        if(OriginalPassword !== req.body.password){
            res.status(401).json({message: "Wrong credentials!"});
        }
        const accessToken = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin
        },process.env.JWT_SECRET,{expiresIn: "1d"});

        //  FOR SECURITY REASONS WE ARE NOT GOING TO SEND PASSWORD IN USER OBJECT
        // const {password, ...others} = user._doc;    // IN DB ALL THE USER DATA WOULD BE STORED IN _DOC

        // res.status(200).json({...others, accessToken});
        const {id, email, isAdmin, likedProductIds} = user;
        const data = {id, email, isAdmin, likedProductIds, accessToken};
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false, message:err});
    }
});


module.exports = router;