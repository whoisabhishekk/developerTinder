const socket = require("socket.io");

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

        socket.on("sendMessage",({sender,reciever,message})=>{
            const room = [sender,reciever].sort().join("-");
            console.log(`Message from ${sender} to ${reciever}: "${message}"`);
            console.log(`Broadcasting to room: ${room}`);
            console.log(`Rooms this socket is in:`, Array.from(socket.rooms));
            io.to(room).emit("messageReceived",{sender,message})
        })

        socket.on("disconnect",()=>{
            
        })
        
    })
}

module.exports = initializeSocket;