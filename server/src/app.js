require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")
const cors = require("cors"); 
const http = require("http");
const initializeSocket = require("./utils/socket");


//importing api routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");

// using middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || function(origin, callback) {
       
        if (!origin || origin.startsWith("http://localhost:")) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials:true
}));

// Health check route
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRequestRouter);
app.use("/",userRouter);
app.use("/",chatRouter);

const server = http.createServer(app);
initializeSocket(server);


// Global error handler
app.use((err, req, res, next) => {
    console.error("Unhandled Error:", err.stack || err);
    res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 8787;

//DB connection 
connectDB()
    .then(() => {
        console.log("Database established");
        console.log("CORS_ORIGIN:", process.env.CORS_ORIGIN);
        server.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        })
    }).catch(err => {
        console.log("Database not connected");
        console.log("Error:" + err);
    }) 