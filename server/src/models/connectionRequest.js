const mongoose = require("mongoose");

const connectionReqSchema = new mongoose.Schema({

    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status:{
        type: String,
        enum:{
            values : ["ignore", "accepted", "rejected","interested"],  
            message : `{VALUE} is not a valid status!`,
        },
        default: "interested"
    }
},{timestamps:true});

//connectionRequest.find({fromUserId : X})
connectionReqSchema.index({fromUserId:1 , toUserId:1});

connectionReqSchema.pre("save", async function() {
    const connectionRequest = this;

    //condition to stop duplicate request
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
})

module.exports = mongoose.model("ConnectionRequest" , connectionReqSchema); 