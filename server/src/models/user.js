const bcrypt = require("bcrypt")
const mongoose = require("mongoose")
const validator = require("validator")
const jwt = require("jsonwebtoken")


const userSchema = new mongoose.Schema({
    firstName:{
        type : String,
        required : true,
        minlength : 3,
        maxlength : 50
    },
    lastName:{
        type:String,

    },
    emailId:{
        type:String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validate (value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email address : "+ value);
            }
        }
    },
    password:{
        type:String,
        required: true
    },
    age:{
        type:Number,
        min : 18
    },
    gender:{
        type:String,
        enum:{
            values : ["male","female","others"],
            message : `{VALUE} is not a valid gender!`
        }
    },
    photoUrl:{
        type:String,
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo url");
            }
        }

    },
    about:{
        type:String,
        default:"This is a default description of a user"
    },
    skills:{
        type:[String],
        validate: {
            validator: function (v) {
                return v.length <= 10;
            },
            message: 'Skills array cannot exceed 10 items'
        }
    }
},{timestamps:true});

userSchema.index({firstName:1,lastName:1});

// JWT token generation method
userSchema.methods.getJwtToken = async function (){

    const user = this;

   const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET , {expiresIn : '1d'});
   return token;
}

// Password Validation
userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}

module.exports = mongoose.model("User",userSchema);
