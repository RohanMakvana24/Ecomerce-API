import express from 'express'
import { isadmin, isauth } from '../middleware/authMiddleware.js';
import { PaymentController, getallordersbyadmin, getmyoders, getsingleoders, ordercreate, orderstatuschangecontroller } from '../controllers/ordercontroller.js';


const orderroute = express.Router();

//ORDERS CREATE
orderroute.post("/create" , isauth , ordercreate)

//MY ORDERS
orderroute.get("/my-oders" , isauth , getmyoders )

//ODERS GET BY ID
orderroute.get("/single-oders/:id" , isauth , getsingleoders)

//ACCEPt PAYMENTS
orderroute.post("/payments" , isauth , PaymentController )

// ADMIN PART //

//GET ALL ORDERS
orderroute.get("/get-all-orders" , isauth , isadmin , getallordersbyadmin )


//Status change of order
orderroute.put("/admin/order/:id" , isauth , isadmin , orderstatuschangecontroller )


export default orderroute