const validator = require("validator")
 
// Validating Signup Data
const validateSignupData = (data)=>{
    const {firstName,lastName,emailId,password} = data;

    if(!firstName || !lastName){
        throw new Error("Name is not valid");
    }

    else if(!validator.isEmail(emailId)){
        throw new Error("Invalid emailid")
    }

    else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter a strong password!")
    }
};

// Validate the profile edit data
const validateEditProfileData = (req)=>{
    const allowedEditFields = ["firstName","lastName","about","skills","photoUrl", "age", "gender"];
    const isEditAllowed = Object.keys(req.body).every(field=>allowedEditFields.includes(field));  

    return isEditAllowed;
    
};

module.exports = {validateEditProfileData,validateSignupData}