const express = require('express');
const { verifyTokenAndAdmin, verifyTokenAndAuthorization } = require('./verifyToken');
const Product = require('../models/Product');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../utils/cloudinary');
const Category = require('../models/Category');
const Comment = require('../models/Comment');
const User = require('../models/User');
const { default: mongoose } = require('mongoose');
  
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
        res.status(500).json({success: false, "message": err});
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
        res.status(500).json({success: false, "message": err});
    }
});

router.get("/getCategory/:categoryId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {categoryId} = req.params;
        const data = await Category.findById(categoryId);
        res.status(200).json(data);
    }catch(err){
        console.log("get categories error : ", err);
        res.status(500).json({success: false, "message": err});
    }
});

router.get("/all-categories", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const data = await Category.find();
        res.status(200).json(data);
    }catch(err){
        console.log("get categories error : ", err);
        res.status(500).json({success: false, "message": err});
    }
});

router.get("/category/:categoryId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {categoryId} = req.params;
        let {page,size} = req.query;
        if(!page)   page = 1;
        if(!size)   size = 5;
                                                //include --> 'title' , notInclude -->'-title' (or) {title:1,price: 0} --> include title, notInclude price
        const products = await Product.find({categoryId},'title image_url categoryId price rating').skip((page-1)*size).limit(size);
        const totalSize = (await Product.find({categoryId})).length;
        res.status(200).json({products, totalSize});
    }catch(err){
        console.log("get category products error : ", err);
        res.status(500).json({success: false, "message": err});
    }
});


router.post("/comment", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const userId = req.user.id;
        const {productId,rating,commentTitle,commentData} = req.body;
        const comment = new Comment({userId, productId, rating, title: commentTitle, comment: commentData});
        const newComment = await comment.save();
        const product = await Product.findById(productId);
        const avgRating = (product.rating*product.ratingCount + rating)/(product.ratingCount + 1);
        product.ratingCount = product.ratingCount + 1;
        product.rating = avgRating;
        await product.save();
        res.status(200).json({newComment});
    }catch(err){
        console.log("post comment error : ", err);
        res.status(500).json({success: false, "message": err});
    }
});

router.get("/:productId/comment", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {productId} = req.params;
        const comments = await Comment.find({productId});
        res.status(200).json({comments});
    }catch(err){
        console.log("get comment error : ", err);
        res.status(500).json({success: false, "message": err});
    }
});

router.post("/like", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {productId} = req.body;
        if(!productId){
            return res.status(404).json({message:"no product id is provided"});
        }
        const userId = req.user.id;
        const user = await User.findById(userId);
        // console.log(user.likedProductIds.includes(productId),productId);
        if(user.likedProductIds.includes(productId)){
            return res.status(200).json({message:"already added"});
        }
        user.likedProductIds.push(productId);
        await user.save();
        res.status(200).json({message: "added like successfully"});
    }catch(err){
        console.log("Error @post /like", err);
        res.status(500).json({success: false, "message": err});
    }
});

router.post("/remove-like", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {productId} = req.body;
        const userId = req.user.id;
        const user = await User.findById(userId);
        const index = user.likedProductIds.indexOf(productId);
        console.log(user.likedProductIds.indexOf(productId),productId);
        if(index === -1){
            return res.status(404).json({message:"product not found"});
        }
        user.likedProductIds.splice(index, 1);
        await user.save();
        res.status(200).json({message: "removed like successfully"});
    }catch(err){
        console.log("Error @post /remove-like", err);
        res.status(500).json({success: false, "message": err});
    }
});

router.get("/search/:searchText", async (req, res) => {
    try{
        const {searchText} = req.params;
        const {categoryId,sort,rating,minPrice,maxPrice} = req.query;
        // categoryId = Object(categoryId);
        console.log(req.query);
        // console.log(categoryId,filter,rating,minPrice,maxPrice);
        // console.log(!rating , !minPrice , !maxPrice);
        // Ensure required query parameters are provided
        if (!rating || !minPrice || !maxPrice) {
            return res.status(400).json({ success: false, message: "Rating, minPrice, and maxPrice are required." });
        }
        
        // Create an array of query conditions
        const queryConditions = [
            { tags: { $in: searchText.split(" ") } },
            { rating: { $gte: Number(rating) } },
            { price: { $gte: Number(minPrice) } },
            { price: { $lte: Number(maxPrice) } }
        ];
        
        // Add categoryId condition if provided, else include all categories
        if (categoryId !== 'null') {
            queryConditions.push({ categoryId });
        }
        console.log("queryConditions ",queryConditions);
        // Determine sort criteria
        let sortCriteria = {};
        if (sort === 'LtoH') {  // low to high
            sortCriteria = { price: 1 };
        } else if (sort === 'HtoL') {   // high to low
            sortCriteria = { price: -1 };
        } else if (sort === 'new') {    // latest arrival products
            sortCriteria = { createdAt: -1 };
        }
        console.log("sortCriteria ",sortCriteria);
        const data = await Product.find({$and : queryConditions}).sort(sortCriteria);
        res.status(200).json({data,success: true});
    }catch(err){
        console.log("Error server @/search ",err);
        res.status(500).json({success: false, "message": err});
    }
});

async function getTop5SimilarProducts(currentProductId, currentProductTags) {
    try {
        const top5Products = await Product.aggregate([
            {
                $match: {
                    _id: { $ne: new mongoose.Types.ObjectId(currentProductId) },
                    tags: { $in: currentProductTags }
                }
            },
            {
                $addFields: {
                    matchingTagsCount: {
                        $size: {
                            $setIntersection: ["$tags", currentProductTags]
                        }
                    }
                }
            },
            {
                $sort: { matchingTagsCount: -1 }
            },
            {
                $limit: 5
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    image_url: 1,
                    rating: 1,
                }
            }
        ]);

        return top5Products;
    } catch (error) {
        console.error("Error fetching top 5 similar products:", error);
        throw error;
    }
}

router.get("/similarTo/:productId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {productId} = req.params;
        const product = await Product.findById(productId);
        if(!product){
            return res.status(401).json({success: false,"message": "No product found"});
        }
        const {_id, tags} = product
        const data = await getTop5SimilarProducts(_id, tags);
        res.status(200).json({success: true, data});
    }catch(err){
        console.log("GEt similar products error: ", err);
        res.status(500).json({success: false, "message": err});
    }
});


//  FOR ADMIN DASHBOARD
router.get("/productsCount", verifyTokenAndAdmin, async (req, res) => {
    try{
        const date = new Date();
        // past 30 days
        date.setDate(date.getDate() - 30);
        console.log(date);
        const allProductsCount = (await Product.find()).length;
        const recentProductsCount = (await Product.find({
            createdAt: {
                $gte: date
            }
        })).length;
        console.log(date, allProductsCount, recentProductsCount);
        const recentProductsPercentage = (recentProductsCount/allProductsCount)*100;
        res.status(200).json({success: true, productsCount: allProductsCount, productsDeltaPer: recentProductsPercentage});
    }catch(err){
        console.log("Error @ /productsCount : ",err);
        res.status(500).json({success: false, "message": err});
    }
});

// GET ALL PRODUCTS FOR ADMIN , PROJECT MANAGEMENT
router.get("/allProducts", verifyTokenAndAdmin, async (req, res) => {
    try{
        // _id(optional),image_url[0],title,categoryId(optional),quantity,price,discount,rating
        const products = await Product.aggregate([
            {
              $project: {
                _id: 1,
                title: 1,
                image_url: { $arrayElemAt: ["$image_url", 0] }, // $first can be replaced with $arrayElemAt
                categoryId: { $toObjectId: "$categoryId" }, 
                quantity: 1,
                price: 1,
                discount: 1,
                rating: 1,
              }
            },
            {
              $lookup: {
                from: "categories", // the name of the Category collection
                localField: "categoryId",
                foreignField: "_id",
                as: "categoryDetails"
              }
            },
            {
                $unwind: {
                  path: "$categoryDetails",
                }
            },
            {
              $project: {
                _id: 1,
                title: 1,
                image_url: 1,
                categoryId: 1,
                quantity: 1,
                price: 1,
                discount: 1,
                rating: 1,
                categoryTitle: "$categoryDetails.title"
              }
            }
          ]);
        res.status(200).json({success: true, products});
    }catch(err){
        console.log("Error @ /allProducts : ",err);
        res.status(500).json({success: false, "message": err});
    }
});

//updating product details
router.put("/:productId", verifyTokenAndAdmin, async (req, res) => {
    try{
        const {productId} = req.params;
        const product = await Product.findByIdAndUpdate(productId, {
            $set: req.body
        },{new: true});
        // _id(optional),image_url[0],title,categoryId(optional),quantity,price,discount,rating
        const {_id, title, categoryId, quantity, price, discount, rating} = product;
        res.status(200).json({success: true, product : {_id, image_url: product.image_url[0], title, categoryId, quantity, price, discount, rating}});
    }catch(err){
        console.log("Error @ updating product details : ",err);
        res.status(500).json({success: false, "message": err});
    }
});

//delete product details
router.delete("/:productId", verifyTokenAndAdmin, async (req, res) => {
    try{
        const {productId} = req.params;
        await Product.findByIdAndDelete(productId);
        res.status(200).json({success: true, message: "Product successfully deleted"});
    }catch(err){
        console.log("Error @ updating product details : ",err);
        res.status(500).json({success: false, "message": err});
    }
});

// GET product details by prodId
router.get("/:productId", verifyTokenAndAuthorization, async (req, res) => {
    try{
        const {productId} = req.params;
        if(!productId || productId === "undefined"){
            return res.status(200).json({message: "Failed to fetch product id"});
        }
        // console.log("product-Id : ", productId);
        const product = await Product.findById(productId);
        if(!product){
            return res.status(400).json({message:"product not found"});
        }
        res.status(200).json({product});
    }catch(err){
        console.log("get products by id error : ", err);
        res.status(500).json({success: false, "message": err});
    }
});
module.exports = router;