const Purchase = require('../models/Purchase');
const { verifyTokenAndAdmin } = require('./verifyToken');

const router = require('express').Router();

router.get("/totalOrders", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const date = new Date();
        // past 30 days
        date.setDate(date.getDate() - 30);
        // console.log(date);
        const allOrdersCount = (await Purchase.find()).length;
        const recentOrdersCount = (await Purchase.find({
            createdAt: {
                $gte: date
            }
        })).length;
        const recentOrdersPercentage = (recentOrdersCount/allOrdersCount)*100;
        res.status(200).json({success: true, ordersCount: allOrdersCount, ordersDeltaPer: recentOrdersPercentage});
    }catch(err){
        console.log("Error @ admin/totalOrders: ", err);
        res.status(500).json({success: false, message: err});
    }
});
router.get("/totalRevenue", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const date = new Date();
        // past 30 days
        date.setDate(date.getDate() - 30);
        // console.log(date);
        const purchaseRecords = await Purchase.find();
        let totalRevenue = 0;
        let recentRevenue = 0;
        for(const purchaseRecord of purchaseRecords){
            totalRevenue += purchaseRecord.amount;
            if(purchaseRecord.createdAt >= date){
                recentRevenue += purchaseRecord.amount;
            }
        }
        const recentRevenuePercentage = (recentRevenue/totalRevenue)*100;
        res.status(200).json({success: true, totalRevenue, revenueDeltaPer: recentRevenuePercentage});
    }catch(err){
        console.log("Error @ admin/totalRevenue: ", err);
        res.status(500).json({success: false, message: err});
    }
});
router.get("/revenue/month", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const currMinDate = new Date();
        // past 30 days
        currMinDate.setDate(currMinDate.getDate() - 30);
        const currMaxDate = new Date();
        
        const prevMinDate = new Date();
        prevMinDate.setFullYear(prevMinDate.getFullYear() - 1);
        prevMinDate.setDate(prevMinDate.getDate() - 30);
        const prevMaxDate = new Date();
        prevMaxDate.setFullYear(prevMaxDate.getFullYear() -1);

        console.log("current Year: ", currMinDate, currMaxDate);
        console.log("--");
        console.log("previous Year: ", prevMinDate, prevMaxDate);
        console.log("--");

        const currentData = await Purchase.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: currMinDate,
                        $lte: currMaxDate
                    }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from createdAt field
                    month: { $month: "$createdAt" }, // Extract month from createdAt field
                    day: { $dayOfMonth: "$createdAt"}, // Extract day from createdAt field
                    amount: 1,  // include amount
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month", day: "$day" },
                    totalAmount: { $sum: "$amount" }, // Sum of amount for each group
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1}, // Optionally sort by year and month
            }
        ]);  
        const previousData = await Purchase.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: prevMinDate,
                        $lte: prevMaxDate
                    }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from createdAt field
                    month: { $month: "$createdAt" }, // Extract month from createdAt field
                    day: { $dayOfMonth: "$createdAt"}, // Extract day from createdAt field
                    amount: 1,  // include amount
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month", day: "$day" },
                    totalAmount: { $sum: "$amount" }, // Sum of amount for each group
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1}, // Optionally sort by year and month
            }
        ]);  
        console.log("aggregate: ", currentData, previousData);     
        res.status(200).json({success: true, currentData, previousData, currMinDate, currMaxDate, prevMinDate, prevMaxDate});  
    }catch(err){
        console.log("Error @ admin/revenue/month: ", err);
        res.status(500).json({success: false, message: err});
    }
});
router.get("/revenue/halfYear", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const currMinDate = new Date();
        // past 6 months
        currMinDate.setMonth(currMinDate.getMonth() - 6);
        const currMaxDate = new Date();
        
        const prevMinDate = new Date();
        prevMinDate.setFullYear(prevMinDate.getFullYear() - 1);
        prevMinDate.setMonth(prevMinDate.getMonth() - 6);
        const prevMaxDate = new Date();
        prevMaxDate.setFullYear(prevMaxDate.getFullYear() -1);

        console.log("current Year: ", currMinDate, currMaxDate);
        console.log("--");
        console.log("previous Year: ", prevMinDate, prevMaxDate);
        console.log("--");

        const currentData = await Purchase.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: currMinDate,
                        $lte: currMaxDate
                    }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from createdAt field
                    month: { $month: "$createdAt" }, // Extract month from createdAt field
                    day: { $dayOfMonth: "$createdAt"}, // Extract day from createdAt field
                    amount: 1,  // include amount
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month"},
                    totalAmount: { $sum: "$amount" }, // Sum of amount for each group
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1}, // Optionally sort by year and month
            }
        ]);  
        const previousData = await Purchase.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: prevMinDate,
                        $lte: prevMaxDate
                    }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from createdAt field
                    month: { $month: "$createdAt" }, // Extract month from createdAt field
                    day: { $dayOfMonth: "$createdAt"}, // Extract day from createdAt field
                    amount: 1,  // include amount
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month"},
                    totalAmount: { $sum: "$amount" }, // Sum of amount for each group
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1}, // Optionally sort by year and month
            }
        ]);  
        console.log("aggregate: ", currentData, previousData);     
        res.status(200).json({success: true, currentData, previousData, currMinDate, currMaxDate, prevMinDate, prevMaxDate});
    }catch(err){
        console.log("Error @ admin/revenue/halfYear: ", err);
        res.status(500).json({success: false, message: err});
    }
});
router.get("/revenue/year", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const currMinDate = new Date();
        // past 6 months
        currMinDate.setMonth(currMinDate.getMonth() - 12);
        const currMaxDate = new Date();
        
        const prevMinDate = new Date();
        prevMinDate.setFullYear(prevMinDate.getFullYear() - 1);
        prevMinDate.setMonth(prevMinDate.getMonth() - 12);
        const prevMaxDate = new Date();
        prevMaxDate.setFullYear(prevMaxDate.getFullYear() -1);

        console.log("current Year: ", currMinDate, currMaxDate);
        console.log("--");
        console.log("previous Year: ", prevMinDate, prevMaxDate);
        console.log("--");

        const currentData = await Purchase.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: currMinDate,
                        $lte: currMaxDate
                    }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from createdAt field
                    month: { $month: "$createdAt" }, // Extract month from createdAt field
                    day: { $dayOfMonth: "$createdAt"}, // Extract day from createdAt field
                    amount: 1,  // include amount
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month"},
                    totalAmount: { $sum: "$amount" }, // Sum of amount for each group
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1}, // Optionally sort by year and month
            }
        ]);  
        const previousData = await Purchase.aggregate([
            {
                $match: {
                    createdAt: { 
                        $gte: prevMinDate,
                        $lte: prevMaxDate
                    }
                }
            },
            {
                $project: {
                    year: { $year: "$createdAt" }, // Extract year from createdAt field
                    month: { $month: "$createdAt" }, // Extract month from createdAt field
                    day: { $dayOfMonth: "$createdAt"}, // Extract day from createdAt field
                    amount: 1,  // include amount
                }
            },
            {
                $group: {
                    _id: { year: "$year", month: "$month"},
                    totalAmount: { $sum: "$amount" }, // Sum of amount for each group
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1}, // Optionally sort by year and month
            }
        ]);  
        console.log("aggregate: ", currentData, previousData);     
        res.status(200).json({success: true, currentData, previousData, currMinDate, currMaxDate, prevMinDate, prevMaxDate});
    }catch(err){
        console.log("Error @ admin/revenue/year: ", err);
        res.status(500).json({success: false, message: err});
    }
});
router.get("/topProducts", verifyTokenAndAdmin, async (req, res) =>{
    try{
        const {limit} = req.query;
        const topProducts = await Purchase.aggregate([
            { $unwind: "$products" }, // Unwind the products array
            { 
                $group: {
                    _id: "$products.id",
                    title: { $first: "$products.title" },
                    image_url: { $first: "$products.image_url" },
                    totalQuantity: { $sum: "$products.quantity_purchased" },
                }
            },
            { $sort: { totalQuantity: -1 } }, // Sort by totalQuantity in descending order
            { $limit: Number(limit) } // Limit to top 5 products
        ]);

        console.log("Top 5 Products: ", topProducts);
        res.status(200).json({success: true, topProducts})
    }catch(err){
        console.log("Error @ admin/topProducts: ", err);
        res.status(500).json({success: false, message: err});
    }
});

module.exports = router;