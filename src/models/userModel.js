const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
   title:{
      type:String,
      trim:true,
      required:true,
      enum:["Mr","Mrs","Miss"]
   },
   name:{
      type:String,
      required:true,
      trim:true
   },
   phone:{
      type:String,
      required:true,
      trim:true,
      unique:true
   },
   email:{
      type:String,
      required:true,
      trim:true,
      unique:true,
      lowercase:true
   },
   password:{
      type:String,
      trim:true,
      required:true,
      minLength:8,
      maxLength:15
   },
   address:{
      street:{type:String,trim:true},
      city:{type:String,trim:true},
      pincode:{type:String,trim:true}
   },


},{timestamps:true});

module.exports = mongoose.model("user",userSchema)
