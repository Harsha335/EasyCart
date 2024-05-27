const express = require('express');
const { verifyTokenAndAdmin } = require('./verifyToken');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const Category = require('../models/Category');
  
// Multer configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });    // use when we send data via "form-data" - separates files from other data with req.file & req.body

// SAVE IMAGE INTO CLOUDINARY ARTICAL 👏 - https://medium.com/@joeeasy_/uploading-images-to-cloudinary-using-multer-and-expressjs-f0b9a4e14c54
const convertImageToBase64URL = (buffer, imageType = 'png') => {
    try {
      const base64String = Buffer.from(buffer).toString('base64');
      return `data:image/${imageType};base64,${base64String}`;
    } catch (error) {
      throw new Error(`file ${buffer} no exist `)
    }
}
  

router.post("/add-product", verifyTokenAndAdmin, upload.array("image"), async (req, res) => {
    // console.log("-------------------------------------------------------------------------------------------------");
    const data = req.body;  // multer splits other data from file data
    const imgs = req.files;   // multer splits other data from file data    (for a single image upload -> upload.single("image") , req.file)
    // console.log(img);
    if (!imgs) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }
    // console.log("buffer ",img.buffer);
    try{
        const cloudinary_img_urls = [];
        for(const img of imgs)
        {
            console.log("img: ", img);
            const file = convertImageToBase64URL(img.buffer, img.mimetype.split("/")[1]);   //convert buffer to base64
            // console.log("file-base64 : ",file);
            const cloudinary_img = await cloudinary.uploader.upload(file, {
                folder: "easy_cart_products",
                // width: 300,
                // crop: "scale"
            });
            console.log("image url : ",cloudinary_img);
            cloudinary_img_urls.push(cloudinary_img.url);
        }
        const newProduct = new Product({...data,features: JSON.parse(data.features), image_url: cloudinary_img_urls});
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }catch(err){
        console.log("Add product error : ", err);
        res.status(500).json(err);
    }
});

router.post("/add-category", verifyTokenAndAdmin, async (req, res) => {
    try{
        const {title} = req.body;
        const category = new Category({
            title
        });
        const data = await category.save();
        res.status(200).json({"status" : "success", "message" : "category added successfully", data});
    }catch(err){
        console.log("Add category error: ", err);
        res.status(500).json(err);
    }
});

router.get("/all-categories", verifyTokenAndAdmin, async (req, res) => {
    try{
        const data = await Category.find();
        res.status(200).json(data);
    }catch(err){
        console.log("get categories error : ", err);
        res.status(500).json(err);
    }
});


module.exports = router;