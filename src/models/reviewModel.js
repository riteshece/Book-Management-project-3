const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const reviewSchema = new mongoose.Schema({
    bookId: {
        type: ObjectId,
        ref: "book",
        required: true
    },
    reviewedBy: {
        type: String,
        required: true,
        default: "Guest",
        value: { type: String, required: true }
    },
    reviewedAt: { 
        type:Date,
        required:true,
        default:new Date()
    },
    rating: { 
        type:Number,
        required:true,
        min:1, 
        max:5,
    },
    review: { 
        type:String,
        trim:true
    },
    isDeleted: { 
      type:Boolean, 
      default: false 
    },
    deletedAt:{
        type:Date,
    },

},)//{timestamps:true})


module.exports = mongoose.model("review", reviewSchema)