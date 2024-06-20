
import { ProductModel } from "../model/ProductModel.js";
import { getDataUri } from "../utils/features.js";
import cloudinary from "cloudinary";

//product create
export const productcreate = async (req, res) => {
  try {
    const { name, description, price, stock, category , quantity  } = req.body;

    //validation of fields
    if ((!name, !description, !price, !stock , !quantity )) {
      return res.status(404).send({
        success: false,
        message: "Provide all fields",
      });
    }

    //validation of images
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Image is required ",
      });
    }

    const file = await getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);

    const images = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };
    const product = await ProductModel.create({
      name,
      description,
      price,
      stock,
      category,
      images,
      quantity
    });

    if (product) {
      return res.status(201).send({
        success: true,
        message: "Product Created Succesfully",
      });
    }
  } catch (error) {
    return res.status(504).send({
      success: false,
      message: "The Error in Product create api ",
      error,
    });
  }
};

//product update Controller
export const updateProducts = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).send({
        success: false,
        message: "The Product is not Found",
      });
    }

    const { name, description, price, stock, category } = req.body;

    //validation and Updates
    if (name) product.name = name;
    if (description) product.descriptiostockn = description;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();

    res.status(200).send({
      success: true,
      message: "The Product Upd2ate Succesfully",
    });
  } catch (error) {
    //cast Error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Product ID",
      });
    }
    return res.status(500).send({
      success: false,
      message: "Error in update product API",
      error,
    });
  }
};

//product image upload

export const updateproductimage = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "The Product is not found",
      });
    }

    //validation
    if (!req.file) {
      return res.status(404).send({
        success: false,
        message: "Image is required",
      });
    }

    const file = await getDataUri(req.file);
    const cdb = await cloudinary.v2.uploader.upload(file.content);

    const image = {
      public_id: cdb.public_id,
      url: cdb.secure_url,
    };

    product.images.push(image);
    await product.save();

    res.status(200).send({
      success: true,
      message: "The Product Updated Succefully",
    });
  } catch (error) {
    //cast Error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Product ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update product API",
      error,
    });
  }
};

//DELETE PRODUCT IMAGES
export const deleteproductimage = async (req, res) => {
  try {

     const product = await ProductModel.findById(req.params.id)

     //validation
     if(!product){
        return res.status(400).send({
            success :  false,
            message : "The Product is nt found"
        })
     }
     //image id section
     const imageid = req.query.imageid;
     if(!imageid){
        return res.status(400).send({
            success :  false,
            message : "The Image is not found"
        })
     }

    let exist = -1;
    product.images.forEach((item , index )=>{
        if(item._id.toString() === imageid.toString()){
            exist = index
        }
    })

    if(exist < 0 ){
        return res.status(400).send({
            success :  false,
            message : "The Image is not found"
        })
    }

    await cloudinary.v2.uploader.destroy(product.images[exist].public_id)
    product.images.splice(exist , 1 )
    await product.save();
    return res.status(200).send({
        success : true,
        message : "The Product Image Deleted Succesfully"
    })
  } catch (error) {
    //cast Error
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Product ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update product API",
      error,
    });
  }
};

//DELETE PRODUCT

export const deleteproduct = async (req,res)=>{
  try{

    const product = await ProductModel.findById(req.params.id);

    //Validation
    if(!product){
      return res.status(404).send({
        success : false ,
        message : "The Product Is Not Found"
      })
    }
    //product images delete
    for(let index = 0 ; index<product.images.length ; index++){
         await cloudinary.v2.uploader.destroy(product.images[index].public_id)
    }
    //remove product
    const is_Deleted = await ProductModel.findByIdAndDelete(req.params.id)

    if(is_Deleted){
      return res.status(200).send({
        success : true,
        message : "The Product is deleted Succesfully"
      })
    }
  }catch(error){
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Product ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update product Delete API",
      error,
    });
  }
}


//GET ALL PRODUCTS

export const getallproducts = async (req,res)=>{
  try{

    const { search , page=1 , limit=1 , price } = req.query;

    const product = await ProductModel.find({});
    let FilteredProduct = product


    //searching
    if(search){
      var regex = new RegExp(search , 'i');
      FilteredProduct = product.filter(
        (item) => regex.test(item.name) ||
                  regex.test(item.description) ||
                  regex.test(item.stock)
       )
    }


   //filter products

    //filter by price
    if(price){
       FilteredProduct = product.filter((item) => item.price === parseInt(price))
    }

    //sort products

    //pagination
    const StartIndex = (page - 1 ) * limit ;
    const EndIndex = StartIndex + parseInt(limit)
    const PaginateData = FilteredProduct.splice(StartIndex , EndIndex)

    res.json({
      TotalFiltered: FilteredProduct.length,
      totalPages: Math.ceil(FilteredProduct.length / limit),
      currentPage: parseInt(page),
      results: PaginateData,
    });

  }catch(error){
    console.log(error)
    return res.status(500).send({
      success: false,
      message: "Error in update product Delete API",
      error,
    });
  }
}

export const getsingleproduct =  async (req,res)=>{
  try{

    const product = await ProductModel.findById(req.params.id);

    if(!product){
      return res.status(404).send({
        success : false ,
        message : "The Product is not found"
      })
    }

    res.status(200).send({
      success : true,
      message : "The Product Find Succesfully",
      product : product
    })

  }catch(error){
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Product ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in update product Delete API",
      error,
    });
  }
}


//PRODUCT REVIEW AND COMMENT Controller
export const productReviewAndComment = async (req,res)=>{
  try{

    const {comment , rating} = req.body;

    if(!comment || !rating ){
      return res.status(404).send({
        success : false,
        message : "Provide All Fields"
      })
    }

    const product = await ProductModel.findById(req.params.id);
    if(!product){
      return res.status(400).send({
        success : false,
        message : "The Product is not found "
      })
    }

    //check already commented or rating
    const alreadyreview = await product.review.find((r)=>r.user.toString() === user.user._id.toString())

    if(alreadyreview){
      return res.status(400).send({
        success : false,
        message : "Product Already Reviewed"
      })
    }

    const review = {
      name : req.user.name,
      comment : comment,
      rating : Number(rating),
      user : req.user._id
    }

    product.review.push(review);
    product.numReview = product.review.length;
    product.rating = product.review.reduce((acc, item ) => item.rating + acc , 0 ) / product.review.length
    await product.save();
    return res.status(200).send({
      success : true,
      message : "The Reviewe Added "
    })
  }catch(error){
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Product ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Comment and rating API ",
      error,
    });
  }
}