import mongoose from "mongoose";
const CategorySchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: [true, "Category is Required"],
    },
    status : {
        type : Number,
        default : 1
    }
  },
  { timestamps: true }
);

export const CategoryModel = new mongoose.model("Categories", CategorySchema);
