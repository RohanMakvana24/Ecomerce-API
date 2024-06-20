import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan';
import cors from 'cors';
import cloudinary from 'cloudinary'
import cookieParser from 'cookie-parser';
import { connectDatabase } from './config/database/connectDB.js';
import authroute from './router/authroute.js';
import productroute from './router/productroute.js';
import categoriesroute from './router/categoriesroute.js';
import orderroute from './router/orderroute.js';
import Stripe  from 'stripe';

//server setup
dotenv.config();
connectDatabase();
const app = express();
const port = process.env.PORT;

//stripe configuration
export const stripe = new Stripe(process.env.STRIPE_API_SECRET);


//cloudinary configure
cloudinary.v2.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET,
})
//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser())

//routes
app.use("/api/v1/auth" , authroute)
app.use("/api/v1/product" , productroute)
app.use("/api/v1/categories" , categoriesroute)
app.use("/api/v1/order" , orderroute)


//server listing
app.listen(port , ()=>{
    console.log(`Server is listing on port : ${port} 🥰 `)
})