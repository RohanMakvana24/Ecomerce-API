import express from 'express'
import { UpdateUserPassword, forgotpassword, login, logoutcontroller, profileController, ragister, updateProfilePicture, updateUserController } from '../controllers/authcontroler.js';
import { isauth } from '../middleware/authMiddleware.js';
import { singleupload } from '../middleware/multer.js';
const authroute  = express.Router();

//ragister
authroute.post('/ragister' , ragister)

//login
authroute.post("/login" , login)

//profile
authroute.get("/profile" , isauth , profileController )

//logout
authroute.get("/logout" , isauth , logoutcontroller)

//upadet user
authroute.put("/updateuser" , isauth , updateUserController)

//update user Password
authroute.put("/updateuserpassword" , isauth , UpdateUserPassword)

//profile picture updates
authroute.put("/update-profile" , isauth , singleupload , updateProfilePicture)

//forgot  password
authroute.post("/forgot-password", forgotpassword)
export default authroute