import mongoose from "mongoose";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken'
const UserSchema  =  new mongoose.Schema({
    name : {
        type : String,
        required : [true , "Name is Required"]
    },
    email: {
        type : String,
        required : [true , "Email is Required"],
        unique : [true , 'Email Already Ragistered']
    },
    password: {
        type : String,
        required : [true , "Password is Required"],
        minLength : [6 , 'Password length can be greter 6 charatcter']
    },
    address : {
        type : String,
        required : [true , "Address is Required "]
    },
    city : {
        type : String,
        required : [true , "City Is  Required "]
    },
    country : {
        type : String,
        required : [true , "country Is  Required "]
    },
    phone :{
        type : String,
        required : [true , "Phone Is  Required "]
    },
    role : {
        type : Number,
        enum : [0,1],
        default : 0
    },
    answer : {
        type : String,
        required : true
    },
    profilePic : {
      public_id : {
        type : String
      },
      url : {
        type : String
      }
    }
} , {timestamps : true });

//functions

//password hashing
UserSchema.pre('save' , async function(next){
  if(!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password , 10 )
})

//compare password
UserSchema.methods.comparePassword = async function(plainpassword){
    return await bcrypt.compare(plainpassword , this.password)
}

//token generates
UserSchema.methods.TokenGenerates = async function(){
    return jwt.sign({_id : this._id} , process.env.JWT_SECRET)
}


export const UserModel = new mongoose.model("Users" , UserSchema)