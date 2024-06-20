import express from 'express'
import { isadmin, isauth } from '../middleware/authMiddleware.js';
import { singleupload } from '../middleware/multer.js';
import { deleteproduct, deleteproductimage, getallproducts, productcreate, updateProducts, updateproductimage  , getsingleproduct, productReviewAndComment} from '../controllers/productcontroller.js';


const productroute = express.Router();

//get all products
productroute.get("/get-all" ,  getallproducts)

//get single product
productroute.get("/get-single/:id" , getsingleproduct)

//create a product
productroute.post("/create" , isauth , singleupload  , isadmin , productcreate )

//update products details
productroute.put("/:id" , isauth , isadmin , updateProducts )

//product image update
productroute.put("/image/:id" , isauth , isadmin ,singleupload ,  updateproductimage )

//product images delete
productroute.delete("/imagedelete/:id" , isauth , isadmin ,  deleteproductimage )

//product delete
productroute.delete("/delete/:id" , isauth  , isadmin ,  deleteproduct )

//product review and
productroute.put("/:id/review" , isauth , productReviewAndComment)
export default productroute