const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req,res,next) =>{

    //ANCHOR - read the token from req.cokkies
    try{

        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please login first..!")
        }
        const decodedObj = await jwt.verify(token , process.env.JWT_SECRET);
        const {_id} = decodedObj;

        const user = await User.findById(_id);
        if(!user){  
            return res.status(401).send("User not found..!");
        }
        req.user = user;
        next();

    } catch(error) {
        res.status(401).json({message: error.message})
    }

};


module.exports = {
    userAuth,
}