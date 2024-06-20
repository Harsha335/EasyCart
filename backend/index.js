const express = require("express");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const paymentRouter = require("./routes/payment");
const adminRouter = require("./routes/admin");
const { mongoose } = require("mongoose");
const bodyParser = require('body-parser');
const cors = require('cors');

const dotenv = require("dotenv");
dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

const corsOptions = {
    origin: process.env.CLIENT_URL
};
app.use(cors(corsOptions));

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());
// -----or------
// Use body-parser middleware(for JSON object)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//CONNECT TO DB
const ConnectDb = async ()=>{
    try{
        const conn = await mongoose.connect(process.env.MONGODB_URL);
        console.log("Mongodb connected : ", conn.connection.host);
    }
    catch(error){
        console.log("Error at db connection ",error);
    }
}
ConnectDb();

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users",userRouter);
app.use("/api/product", productRouter);
app.use("/api/payment", paymentRouter);
app.use("/api/admin", adminRouter);

app.listen(PORT , ()=>{
    console.log("Backend running @ localhost:5000 ...")
});