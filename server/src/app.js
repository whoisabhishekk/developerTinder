require('dotenv').config();
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser")
const cors = require("cors"); 

//importing api routes
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRequestRouter = require("./routes/request");
const userRouter = require("./routes/user");

// using middlewares
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials:true
}));

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",connectionRequestRouter);
app.use("/",userRouter);

const PORT = process.env.PORT || 8787;

//DB connection 
connectDB()
    .then(() => {
        console.log("Database established");
        app.listen(PORT, () => {
            console.log(`Server is running at port ${PORT}`);
        })
    }).catch(err => {
        console.log("Database not connected");
        console.log("Error:" + err);
    }) 