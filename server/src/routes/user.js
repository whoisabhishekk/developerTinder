const express = require("express");
const userRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_PROJECTION = "firstName lastName photoUrl age gender skills about"

// get all the pending connection requests of the loggedIn user 
userRouter.get("/user/requests" , userAuth , async (req , res) =>{

    try{
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
           toUserId : loggedInUser._id,
           status : "interested"
        }).populate("fromUserId",USER_PROJECTION);

        res.json({
            message : "Data fetched successfully",
            data : connectionRequests
        })
    } catch(error) {
        res.status(400).json({message: error.message});
    }
});

// get all the connections of the loggedIn User
userRouter.get("/user/connections",userAuth , async (req,res)=>{
    try{

        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id , status : "accepted"},
                {fromUserId:loggedInUser._id , status : "accepted"}
            ]
        }).populate("fromUserId",USER_PROJECTION)
          .populate("toUserId",USER_PROJECTION);

        const data = connectionRequest.map((row)=> {
            if(row.toUserId._id.toString() === loggedInUser._id.toString()){
                return row.fromUserId;
            }
            else{
                return row.toUserId;
            }
        });

        res.json({data:data})

    } catch(error) {
        res.status(400).json({message: error.message})
    }
});

// feed api
userRouter.get("/feed" , userAuth , async (req , res)=>{

    try{
        const loggedInUser = req.user;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit > 50 ? 50 : limit;
        let page = parseInt(req.query.page) || 1;
        const skip = (page - 1) * limit;



        const connectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id },
                {fromUserId:loggedInUser._id }
            ]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequest.forEach(connection => {
            hideUsersFromFeed.add(connection.fromUserId.toString());
            hideUsersFromFeed.add(connection.toUserId.toString());
        });

        const users = await User.find({
           $and :[ { _id : { $nin : Array.from(hideUsersFromFeed) } } , 
                   { _id : { $ne : loggedInUser._id } } ]
        }).select(USER_PROJECTION)
          .skip(skip)
          .limit(limit);

        res.json({data:users});
    } catch(error){
        res.status(400).json({message: error.message})
    }
});

module.exports = userRouter;