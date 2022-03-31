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
      unique:true,
      match:[/^[789][0-9]{9}$/, "please enter valid mobile number"]
   },
   email:{
      type:String,
      required:true,
      trim:true,
      unique:true,
      lowercase:true,
      match: [/^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/,"Please fill a valid email address",]
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
