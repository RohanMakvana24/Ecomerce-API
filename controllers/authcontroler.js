import { UserModel } from "../model/UserModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from 'cloudinary'


//ragister controller
export const ragister = async (req, res) => {
  try {
    const { name, email, password, address, city, country, phone, profilePic } =
      req.body;

    //validation of  fields
    if (
      !name ||
      !email ||
      !password ||
      !address ||
      !city ||
      !country ||
      !phone
    ) {
      res.status(500).send({
        success: false,
        message: "The Provide All fields",
      });
    }

    //check existing user
    const is_existing = await UserModel.findOne({ email: email });

    if (is_existing) {
      res.status(409).send({
        success: false,
        message: "The Email is already ragistered try login",
        user: user,
      });
    }

    //stores
    const user = await UserModel.create({
      name,
      email,
      password,
      address,
      city,
      country,
      phone,
      profilePic,
    });

    if (user) {
      res.status(201).send({
        success: true,
        message: "The use ragistered Succesfully",
        user,
      });
    }
  } catch (error) {
    res.status(504).send({
      success: false,
      message: "Somenthing Went Wrong",
      error: error.message,
    });
  }
};

//login controller

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
     return  res.status(400).send.send({
        success: false,
        message: "The Email and Password is Required",
      });
    }

    const user = await UserModel.findOne({ email: email });
    if (!user) {
      return res.status(404).send.send({
        success: false,
        message: "The Email is not ragistered",
      });
    }

    const match_password = await user.comparePassword(password);

    if (!match_password) {
      return res.status(404).send({
        success: false,
        message: "The Password is Wrong",
      });
    }

    //token generates
    const token = await user.TokenGenerates();
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 7);
    return  res
      .status(200)
      .cookie("token", token, {
        secure: process.env.DEV_MODE === "devlopment" ? true : false,
        httpOnly: process.env.DEV_MODE === "devlopment" ? true : false,
        expires: expireDate,
      })
      .send({
        success: true,
        message: "Login Succesfully",
        token: token,
        user: {
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone,
        },
      });
  } catch (error) {
    console.log(error)
    return  res.status(504).send({
      success: false,
      message: "Somenthing Went Wrong",
      error: error,
    });
  }
};

//profile controller

export const profileController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id);
    res.status(200).send({
      success: true,
      message: "Succefully find user profile",
      user,
    });
  } catch (error) {
    res.status(504).send({
      success: false,
      message: "Somenthing Went Wrong",
      error: error.message,
    });
  }
};

//logout controller

export const logoutcontroller = async (req, res) => {
  try {
    res.status(200).clearCookie("token").send({
      success: true,
      message: "Logout Succesfully",
    });
  } catch (error) {
    res.status(504).send({
      success: false,
      message: "Somenthing Went Wrong",
      error: error.message,
    });
  }
};

//update user profile
export const updateUserController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user._id)

    const {name , email , address , city , country , phone} = req.body;

    if(name) user.name = name;
    if(email) user.email = email;
    if(address) user.address = address;
    if(city) user.city = city;
    if(country) user.country = country;
    if(phone) user.phone = phone;

    await user.save();

    res.status(200).send({
        success : true,
        message : "User Updated Succefully"
    })
  } catch (error) {
    res.status(504).send({
      success: false,
      message: "Somenthing Went Wrong",
      error: error.message,
    });
  }
};

//update user password
export const UpdateUserPassword = async (req,res) => {
   try{

    const {oldpassword , newpassword } = req.body;
    const id = req.user._id;
    if(!oldpassword , !newpassword){
      return res.status(400).send({
        success : false,
        message : "The Old Password and New Password is Required"
      })
    }

    const user = await UserModel.findById(id);
    if(!user){
      return res,status(404).send({
          success : false,
          message : "The User Is not found"
      })
    }

    const password_match = await user.comparePassword(oldpassword)
    if(!password_match){
      return  res.status(404).send({
         success : false ,
         message : "The Old Password is Wrong"
      })
    }

    //update password
    user.password = newpassword
    await user.save();

    return   res.status(200).send({
      success : true,
      message : "The User Passwortd Updated Succesfully"
    })


   }catch(error){
   return   res.status(504).send({
      success: false,
      message: "Somenthing Went Wrong",
      error: error.message,
    });
   }
}


//update use profile picture
export const updateProfilePicture = async (req,res)=>{
  try{

    const user = await UserModel.findById(req.user._id);

    const file = await getDataUri(req.file);

    //delete preview image
    await cloudinary.v2.uploader.destroy(user.profilePic.public_id)

    //update
    const cdb = await cloudinary.v2.uploader.upload(file.content)
    user.profilePic = {
      public_id : cdb.public_id,
      url : cdb.secure_url
    }
    //save
     await user.save();
     res.status(200).send({
      success : true,
      message : "Profile Picture Uploaded Sucessfully"
    })

  }catch(error){
    return res.status(504).send({
      success: false,
      message: "Somenthing Went Wrong",
      error: error.message,
    });
  }
}


//FORGOT PASSWORD
export const forgotpassword = async (req,res)=>{
  try{

    const {email , answer , newpassword } = req.body;

    if(!email , !answer , !newpassword){
      return res.status(404).send({
        success : 'false',
        message : "Provide All Fields"
      })
    }

    const user = await UserModel.findOne({email : email , answer : answer});

    if(!user){
      return res.status(404).send({
        success : false ,
        message : "The Email Or Answer is Wrong "
      })
    }

    if(user){
     user.password =  newpassword
     await user.save();
    }
     return res.status(200).send({
        success : true ,
        message : "The User Password Change succesfully "
     })
  }catch(error){
    res.status(504).send({
      success : false ,
      message : error.message
    })
  }
}