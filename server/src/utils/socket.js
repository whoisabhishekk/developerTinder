const socket = require("socket.io");
const Chat = require("../models/chat");

const initializeSocket = (server)=>{
    const io = socket(server,{
        cors:{
          origin: process.env.CORS_ORIGIN || "http://localhost:5173",
          credentials:true
        }
    })

    io.on("connection",(socket)=>{
        
        socket.on("joinChat",({userId,targetUserId})=>{
            // Sort IDs so room name is always the same for both users
            const room = [userId,targetUserId].sort().join("-");
            console.log(`user:${userId} has joined the room : ${room}`);
            socket.join(room);
            
        })

        socket.on("sendMessage",async ({sender,reciever,message})=>{
            const room = [sender,reciever].sort().join("-");
            console.log(`Message from ${sender} to ${reciever}: "${message}"`);

            // Save message to the database
            try{
                const participants = [sender,reciever].sort();
                // find existing chat or create new one
                let chat = await Chat.findOne({
                    participants:participants
                });

                if(!chat){
                    chat = new Chat({
                        participants:participants,
                        messages:[]
                    });
                }

                chat.messages.push({
                    senderId:sender,
                    text:message
                });

                await chat.save();

            } catch(error){
                console.log("Error saving message: " + error.message);
            }

            io.to(room).emit("messageReceived",{sender,message})
        })

        socket.on("disconnect",()=>{
            
        })
        
    })
}

module.exports = initializeSocket;