const express = require("express")
const authRouter = express.Router();
const {validateSignupData} = require("../utils/validation")
const User = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");

//signup api
authRouter.post("/signup", async (req, res) => {
    try {
        // 1. Validate the data
        validateSignupData(req.body);

        // 2. Encryption of password
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10);

        // 3. Storing user data in DB
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("signup successfull");

    } catch (err) {
        // Agar validation fail hota hai, ya database me koi issue aata hai, 
        // toh server crash nahi hoga balki user ko error response jayega.
        res.status(400).json({message: err.message});
    }
})


//login api
authRouter.post("/login", async (req, res) => {
    try {
        const { emailId, password } = req.body;

        //Check user is availbale in my db or not
        const user = await User.findOne({ emailId });
        if (!user) {
            throw new Error("Invalid credentials");
        }

        //Checking password using bcrypt
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid) {

            //create a jwt token
            const token = await user.getJwtToken();

            //add the token to cookie and send the response to the user
            res.cookie("token", token,{
                expires: new Date(Date.now() + 8*3600000),
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
            res.send(user);

        } else {
            throw new Error("Invalid credentials")
        }

    } catch (error) {
        res.status(400).json({message: error.message});

    }
});

//logout api
authRouter.post("/logout",async(req,res)=>{
    try {
        res.cookie("token",null,{
            expires:new Date(Date.now()),
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        });
        res.send("Logout successful");
    } catch (error) {
        res.status(500).json({message: error.message});
    }
})
module.exports = authRouter;