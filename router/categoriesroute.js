import express from 'express'
import { isadmin, isauth } from '../middleware/authMiddleware.js';
import { createcategories, deletecategory, getallcategories, getsinglecategory , updatecategories  } from '../controllers/cateorycontroller.js';


const categoriesroute = express.Router();

//get all products
categoriesroute.get("/get-all" ,  getallcategories)

//get single product
categoriesroute.get("/get-single/:id" , getsinglecategory)

//create a product
categoriesroute.post("/create" , isauth , isadmin ,   createcategories )

//update products details
categoriesroute.put("/:id" , isauth  , isadmin , updatecategories  )

//product delete
categoriesroute.delete("/delete/:id" , isauth , isadmin  , deletecategory )

export default categoriesroute