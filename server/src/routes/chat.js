const express = require("express");
const chatRouter = express.Router();
const {userAuth} = require("../middlewares/auth");
const Chat = require("../models/chat");

// get chat messages between logged in user and target user
chatRouter.get("/chat/:targetUserId" , userAuth , async (req,res)=>{
    try{
        const loggedInUser = req.user;
        const {targetUserId} = req.params;

        const participants = [loggedInUser._id.toString(), targetUserId].sort();

        let chat = await Chat.findOne({participants:participants})
            .populate("messages.senderId","firstName lastName");

        if(!chat){
            return res.json({messages:[]});
        }

        res.json({messages:chat.messages});

    } catch(error){
        res.status(400).json({message:error.message});
    }
});

module.exports = chatRouter;
