const express = require('express');
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
  
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
  

router.post("/add-product", verifyTokenAndAdmin, upload.array("files"), async (req, res) => {
    // console.log("-------------------------------------------------------------------------------------------------");
    const data = req.body;  // multer splits other data from file data
    const imgs = req.files;   // multer splits other data from file data    (for a single image upload -> upload.single("image") , req.file)
    // console.log(req.body,req?.files);
    // res.status(200).json({data, imgs});
    if (!imgs || imgs.length === 0) {
        return res.status(400).json({ error: 'No image file uploaded' });
    }
    // console.log("buffer ",img.buffer);
    try{
        // console.log("features: ", data.features);
        // console.log("tags: ",data.tags);
        // res.status(200).json(data);
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
        const newProduct = new Product({...data,features: data.features, image_url: cloudinary_img_urls});
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    }catch(err){
        console.log("AddProduct Server error : ", err);
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

router.get("/getCategory/:categoryId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {categoryId} = req.params;
        const data = await Category.findById(categoryId);
        res.status(200).json(data);
    }catch(err){
        console.log("get categories error : ", err);
        res.status(500).json(err);
    }
});

router.get("/all-categories", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const data = await Category.find();
        res.status(200).json(data);
    }catch(err){
        console.log("get categories error : ", err);
        res.status(500).json(err);
    }
});

router.get("/category/:categoryId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {categoryId} = req.params;
        let {page,size} = req.query;
        if(!page)   page = 1;
        if(!size)   size = 5;
                                                        //include --> 'title' , notInclude -->'-title'
        const products = await Product.find({categoryId},'title image_url categoryId price rating').skip((page-1)*size).limit(size);
        const totalSize = (await Product.find({categoryId})).length;
        res.status(200).json({products, totalSize});
    }catch(err){
        console.log("get category products error : ", err);
        res.status(500).json(err);
    }
});

router.get("/:productId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {productId} = req.params;
        const product = await Product.findById(productId);
        res.status(200).json({product});
    }catch(err){
        console.log("get category products error : ", err);
        res.status(500).json(err);
    }
});

router.post("/comment", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const userId = req.user.id;
        const {productId,rating,commentTitle,commentData} = req.body;
        const comment = new Comment({userId, productId, rating, title: commentTitle, comment: commentData});
        const newComment = await comment.save();
        const allRatings = await Comment.find({productId},'rating -_id');
        console.log(allRatings);
        const avgRating = allRatings.reduce((sum,ele) => sum + ele.rating, 0)/allRatings.length;
        const product = await Product.findById(productId);
        product.rating = avgRating;
        await product.save();
        res.status(200).json({newComment});
    }catch(err){
        console.log("post comment error : ", err);
        res.status(500).json(err);
    }
});

router.get("/:productId/comment", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {productId} = req.params;
        const comments = await Comment.find({productId});
        res.status(200).json({comments});
    }catch(err){
        console.log("get comment error : ", err);
        res.status(500).json(err);
    }
});




module.exports = router;