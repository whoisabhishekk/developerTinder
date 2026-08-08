const express = require("express")
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


//sendConnectionRequest api
requestRouter.post("/request/send/:status/:toUserId",userAuth,async (req , res)=>{
   
    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["interested","ignore"];

        if(!allowedStatus.includes(status)){
            return res.status(400).json({ 
                message : "Invalid Status type : " + status
            })
        }

        

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(400).json({message:"User not found"});
        }


        // if there is an existing connectionRequest then update that
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });

        
        
        if(existingConnectionRequest){
            return res.status(400).send({message:"Connection request already exists!!"});
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();

        res.json({
            message:req.user.firstName+" is "+status+" in regards to "+toUser.firstName,
            data
        });
    
    } catch(error){
        res.status(400).json({message: error.message});
    }
})

requestRouter.post("/request/review/:status/:requestId",userAuth,async (req , res)=>{
    
    try{
        const loggedInUser = req.user;
        
        // validate the status  
        const allowedStatus = ["accepted","rejected"];
        const {status} = req.params;
        const {requestId} = req.params;

        if(!allowedStatus.includes(status)){
            return res.status(400).json({
                message : "Invalid status" + status
            });
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(404).json({
                message:"connection request not found"
            })
        }
        connectionRequest.status = status;
        const data = await connectionRequest.save();

        res.json({
            message:"Connection request "+status,
            data
        })  

    } catch(error) {
        res.status(400).json({message: error.message});
    }
})
    
module.exports = requestRouter;