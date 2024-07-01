const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next)=>{
    // console.log(req);
    // console.log(req.token);
    const authHeader = req.headers.token;

    if(authHeader){
        const token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
            if(err || user === undefined)
            {
                console.log("verifyToken ERROR ",err);
                console.log("in server redirect to : ",`${process.env.CLIENT_URL}/login`);
                return res.status(401).send({message: "Token is invalid"});
            }
            req.user = user;
            console.log("-----------------------------------------");
            console.log("user ",user);
            next();
        });
    }else{
        console.log("no token");
        return res.status(401).json({message: "You are not authenticated"});
    }
};

const verifyTokenAndAuthorization = (req, res, next) =>{
    verifyToken(req, res, ()=>{
        console.log(req.user);
        if(req.user.id === req.headers?.id || req.user.isAdmin)
        {
            next();
        }
        else{
            console.log("user does not match");
            console.log(req.user.id+" != "+req.headers?.id);
            res.status(403).json({message: "You are not allowed to do that!"})
        }
    })
}

const verifyTokenAndAdmin = (req, res, next) =>{
    verifyToken(req, res, ()=>{
        console.log(req.user);
        if(req.user.isAdmin)
        {
            next();
        }
        else{
            console.log("Not a Admin");
            res.status(403).json({message: "You are not allowed to do that!"})
        }
    })
}

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};