import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  name :{
    type : String,
    required : true
  },
  rating : {
    type : Number,
    default : 0,
    max:5,
    min:0
  },
  comment : {
    type : String
  },
  user : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "Users"
  }
},{timestamps : true })
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is Required"],
    },
    description: {
      type: String,
      required: [true, "Description is Required"],
    },
    price: {
      type: Number,
      required: [true, "Price is Required"],
    },
    stock: {
      type: Number,
      required: [true, "Product Stock is Required "],
    },
    quantity: {
      type: Number,
      required: [true, "Product Quantity is Required "],
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    images: [
      {
        public_id: String,
        url: String,
      },
    ],
    review : [ReviewSchema],
    rating : {
      type : Number,
      default : 0
    },
    numReview : {
      type : Number
    }

  },
  { timestamps: true }
);

export const ProductModel = new mongoose.model("Products", ProductSchema);
