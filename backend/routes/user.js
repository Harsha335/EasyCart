const express = require("express");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");
const Purchase = require("../models/Purchase");
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');

// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });    // use when we send data via "form-data" - separates files from other data with req.file & req.body

// SAVE IMAGE INTO CLOUDINARY ARTICLE 👏 - https://medium.com/@joeeasy_/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54
const convertImageToBase64URL = (buffer, imageType = 'png') => {
    try {
      const base64String = Buffer.from(buffer).toString('base64');
      return `data:image/${imageType};base64,${base64String}`;
    } catch (error) {
      throw new Error(`file ${buffer} no exist `)
    }
}
//UPDATE user with id
router.put("/:id", verifyTokenAndAuthorization, upload.single('profileImg'), async (req,res)=>{
    if(req.body.password){  // TODO : for updating password
        const encryptedPassword = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
        req.body.password = encryptedPassword;
    }
    try{
        let profileImg = req.file;
        if(profileImg){ // profileImg then upload to multer
            const file = convertImageToBase64URL(profileImg.buffer, profileImg.mimetype.split("/")[1]);   //convert buffer to base64
            // console.log("file-base64 : ",file);
            const cloudinary_img = await cloudinary.uploader.upload(file, {
                folder: "easy_cart_profiles",
                // width: 300,
                // crop: "scale"
            });
            profileImg = cloudinary_img.url;
            console.log("profile img url : ",cloudinary_img.url);  //.uri
        }else{
            profileImg = req.body.profile_img_url;
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set : {...req.body, profile_img_url: profileImg}
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

//GET, find user with id - Admin/user
router.get("/find/:id", verifyTokenAndAuthorization,async (req, res)=>{
    // console.log("-------------------------------------------------------------");
    // console.log(req.params);
    try{
        const {id} = req.params;
        if(!id){
            return res.status(400).json({"success": false, "message":`cannot find users id`});
        }
        const user = await User.findById(id);
        if(!user){
            return res.status(404).json({"success": false, "message":`cannot find user with id ${req.params.id}`});
        }
        const {password, ...data} = user._doc;
        res.status(200).json({"success":true, data});
    }catch(err){
        console.log("Error @ find user by Id: ", err);
        res.status(500).json({"success":false, "message": err});
    }
});

//GET, find all users - Admin
router.get("/all", verifyTokenAndAdmin, async (req, res)=>{
    try{        
        const allUsers = await User.find();
        const users = allUsers.map((user) => {
            const {id:_id, user_name, email, isAdmin, createdAt} = user;
            return {id:_id, user_name, email, isAdmin, createdAt};
        });
        console.log("Users : ", users);
        res.status(200).json({"success":true, users});
    }catch(err){
        res.status(500).json({"success":false, "message": err});
    }
});

//GET, ADDRESS
router.get("/address", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({success: false, message: "user not found"});
        }
        // console.log(user);
        res.status(200).json({address: user?.address});
    }catch(err){
        res.status(500).json({success: false, "message": err});
    }
});
// SAVE USER ADDRESS
router.post("/address", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const address = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({success: false, message: "user not found"});
        }
        user.address = address;
        await user.save();
        res.status(200).json({address: user.address});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, "message": err});
    }
});

// GET ORDERS PLACED BY USER
router.get("/orders", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const userId = req.user.id;
        const orders = await Purchase.find({userId});
        console.log("orders : ", orders);
        res.status(200).json({success: true, orders});
    }catch(err){
        console.log("Error @ /orders : ",err);
        res.status(500).json({success: false, "message": err});
    }
});

//  ADMIN DASHBOARD
router.get("/userCount", verifyTokenAndAdmin, async (req, res) => {
    try{
        const date = new Date();
        // past 30 days
        date.setDate(date.getDate() - 30);
        const allUsersCount = (await User.find()).length;
        const recentUsersCount = (await User.find({
            createdAt: {
                $gte: date
            }
        })).length;
        const recentUsersPercentage = (recentUsersCount/allUsersCount)*100;
        res.status(200).json({success: true, usersCount: allUsersCount, userDeltaPer: recentUsersPercentage});
    }catch(err){
        console.log("Error @ /userCount : ",err);
        res.status(500).json({success: false, "message": err});
    }
});

module.exports = router;