import mongoose from "mongoose";

export const connectDatabase = async (req,res)=>{
    try{

        await mongoose.connect(process.env.MONGODB);
        console.log("The Mongodb is Connected 😁 ")

    }catch(error){
        console.log(error)
    }
}