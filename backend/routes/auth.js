const User = require("../models/User");
const CryptoJS = require("crypto-js");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const passport = require('../utils/passport');
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

router.post("/register", upload.single('profileImg'),async (req,res)=>{
    console.log("-----------------");
    // console.log(req.body);
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
        }
        const encryptedPassword = CryptoJS.AES.encrypt(req.body.password,process.env.SECRET_KEY).toString();
        const user = new User({
            user_name: req.body.userName,
            email : req.body.email,
            password : encryptedPassword,
            profile_img_url: profileImg,
        });
        console.log(user);
        const isUserExist = await User.findOne({email: req.body.email});
        if(isUserExist){
            return res.status(409).json({success: false, message: "User Email already exits"});
        }
        console.log("user do not exist , adding into db");
        const savedUser = await user.save();
        console.log(savedUser);
        res.status(201).json({"message": "user created successfully"});
    }catch(err){
        console.log(err);
        res.status(500).json({success: false, message:err});
    }
});

const generateAccessToken = (user) => {
    return jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
    },process.env.JWT_SECRET,{expiresIn: "5s"});
}
const generateRefreshToken = (user) => {
    return jwt.sign({
        id: user._id,
        isAdmin: user.isAdmin
    },process.env.JWT_REFRESH_SECRET,{expiresIn: "7d"});
}

//REFRESH TOKEN
router.get("/refresh", async (req, res) => {
    try{
        // taken the refresh token from the user
        const {refreshtoken} = req.headers; // -- FOR MORE SECURITY STORE THIS GENERATED REFRESH TOKENS AS A ARRAY IN DB OR REDDIES AND CHECK WHETHER THIS TOKENS ARE PRESENT IN THE DB OR NOT, DELETE THEM IF USER SIGN OUT 
        // send error if there is no token or its invalid
        // console.log(req.headers);
        // console.log(refreshtoken);
        console.log("Refreshing token");
        if(!refreshtoken){
            return res.status(401).json("you are  not authenticated");
        }
        // if everything is ok, create a new access token & refresh token , send to user
        jwt.verify(refreshtoken, process.env.JWT_REFRESH_SECRET, (err, user) => {
            if(err){
                console.log("Error at verifying refreshToken:", err);
                return res.status(401).send({message: "Token is invalid"});
            }
            const accessToken = generateAccessToken({_id:user.id, isAdmin:user.isAdmin});
            const refreshToken = generateRefreshToken({_id:user.id, isAdmin:user.isAdmin});
            res.status(200).json({accessToken, refreshToken});
        });
    }catch(err){
        console.log("Error @ refreshing token: ", err);
        res.status(500).json({success: false, message: err});
    }
})

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

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);
        
        //  FOR SECURITY REASONS WE ARE NOT GOING TO SEND PASSWORD IN USER OBJECT
        // const {password, ...others} = user._doc;    // IN DB ALL THE USER DATA WOULD BE STORED IN _DOC

        // res.status(200).json({...others, accessToken});
        const {id, email, isAdmin, likedProductIds} = user;
        const data = {id, email, isAdmin, likedProductIds, accessToken, refreshToken};
        res.status(200).json(data);
    }
    catch(err){
        console.log(err);
        res.status(500).json({success: false, message:err});
    }
});

//google sign in
router.get('/google', passport.authenticate('google', {scope: ['email', 'profile']}));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
  (req, res) => {
    // Successful authentication, send tokens to the client
    const { user, accessToken, refreshToken } = req.user;
    console.log(req.user);
    const {_id, email, isAdmin, likedProductIds} = user;
    const data = {id: _id, email, isAdmin, likedProductIds, accessToken, refreshToken};
    const query = new URLSearchParams(data).toString();
    res.redirect(`http://localhost:3000/googleSignin-success?${query}`);
    // res.redirect(`http://localhost:3000?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  }
);

module.exports = router;