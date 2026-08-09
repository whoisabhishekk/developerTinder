import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { createSocketConnections } from '../utils/socket'
import axios from 'axios'
import { BASE_URL } from '../utils/constants'


const Chat = () => {
  
    const {targetUserId} = useParams();
    const [messages,setMessages] = useState([]);
    const [newMessage , setNewMessage] = useState("");
    const user = useSelector(store=>store.user);
    const userId = user?._id;
    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Fetch old messages from DB
    const fetchMessages = async ()=>{
      try{
        const res = await axios.get(BASE_URL + "/chat/" + targetUserId , {
          withCredentials:true
        });
        // map DB messages to our format {text, sender}
        const oldMessages = res.data.messages.map(msg=>({
          text:msg.text,
          sender: msg.senderId._id || msg.senderId
        }));
        setMessages(oldMessages);
      } catch(error){
        console.log("Error fetching messages: " + error);
      }
    }

    const sendMessage = ()=>{
      if(!newMessage.trim() || !socketRef.current) return;
      socketRef.current.emit("sendMessage",{sender:userId , reciever:targetUserId , message:newMessage});
      setNewMessage("");
    }

    useEffect(()=>{
      if(!userId || !targetUserId) return;

      // load old messages first
      fetchMessages();

      const socket = createSocketConnections();
      socketRef.current = socket;

      // Join chat room on every (re)connection
      socket.on("connect", () => {
        socket.emit("joinChat",{userId , targetUserId});
      });

      // If already connected, emit immediately
      if(socket.connected) {
        socket.emit("joinChat",{userId , targetUserId});
      }

      // Listen for incoming messages
      socket.on("messageReceived",({sender, message})=>{
        setMessages(prev => [...prev, {text: message, sender}]);
      });

      return ()=>{
        socket.disconnect();
      }
    },[userId,targetUserId])



  return (
    <div className="flex flex-col items-center my-10 px-4 animate-slide-up">
      
      {/* Chat Container */}
      <div className="w-full max-w-2xl bg-gray-900/40 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
        
        {/* Chat Header */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-white/10 bg-gray-900/60">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 16 16">
                <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
              </svg>
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-400 border-2 border-gray-900 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Chat</h2>
            <p className="text-xs text-gray-400 font-medium">Online</p>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex flex-col gap-3 p-6 overflow-y-auto max-h-[450px] min-h-[300px] scrollbar-thin">
          
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-pink-500/20 flex items-center justify-center mb-4 border border-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="text-gray-500" viewBox="0 0 16 16">
                  <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105"/>
                </svg>
              </div>
              <p className="text-gray-500 text-sm font-medium">No messages yet</p>
              <p className="text-gray-600 text-xs mt-1">Say hello to start the conversation!</p>
            </div>
          )}

          {messages.map((msg, index) => {
            const isOwnMessage = msg.sender === userId;
            return (
              <div 
                key={index} 
                className={`flex items-end gap-2 animate-fade-in ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-md ${
                  isOwnMessage 
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-600" 
                    : "bg-gradient-to-br from-pink-500 to-pink-600"
                }`}>
                  {isOwnMessage ? "Y" : "T"}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md ${
                  isOwnMessage 
                    ? "bg-gradient-to-r from-indigo-600 to-indigo-500 text-white rounded-br-md" 
                    : "bg-gray-800/80 text-gray-200 border border-white/10 rounded-bl-md"
                }`}>
                  {msg.text}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="flex items-center gap-3 p-4 border-t border-white/10 bg-gray-900/60">
          <input 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            onKeyDown={(e) => e.key === "Enter" && sendMessage()} 
            className="flex-1 bg-gray-800/50 text-white text-sm rounded-2xl px-5 py-3 border border-white/10 placeholder-gray-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300" 
            type="text" 
            placeholder="Type a message..." 
          />
          <button 
            onClick={sendMessage} 
            disabled={!newMessage.trim()}
            className="flex items-center justify-center w-11 h-11 rounded-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-indigo-500/30"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
              <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z"/>
            </svg>
          </button>
        </div>

      </div>
    </div>
  )
}

export default Chat