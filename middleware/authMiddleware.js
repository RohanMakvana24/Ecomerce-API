import jwt from 'jsonwebtoken'
import { UserModel } from '../model/UserModel.js';

//USER MIDDLEWARE
export const  isauth = async (req,res , next)=>{
    try{
         const { token } = req.cookies;
         if(!token){
            return res.status(404).send({
                success : false,
                message : "Unauthorize Access"
            })
         }
        const decodeData =  jwt.verify(token , process.env.JWT_SECRET);
        req.user = await UserModel.findById(decodeData._id)
        next();
    }catch(error){
        return res.status(404).send({
            success : false,
            message : "Unauthorize Access",
            error :  error.message
        })
    }
}

//ADMIN MIDDLEWARE
export const isadmin = async (req,res, next)=>{
    try{

        if(req.user.role !== 1 ){
            return res.status(404).send({
                success : false,
            message : "Admin Access Only ",
            error :  error.message
            })
        }
        next();
    }catch(error){
        return res.status(404).send({
            success : false,
            message : "Admin Access Only ",
            error :  error.message
        })
    }
}