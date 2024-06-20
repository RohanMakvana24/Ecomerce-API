import { stripe } from "../index.js";
import { OrderModel } from "../model/OerderModel.js";
import { ProductModel } from "../model/ProductModel.js";

export const ordercreate = async (req, res) => {
  try {
    const {
      shippinginfo,
      ordersItems,
      paymentMethod,
      paymentinfo,
      itempprice,
      tax,
      shippingCharges,
      totalAmount,
      ordersstatus,
    } = req.body;

    if (
      (!shippinginfo,
      !ordersItems,
      !paymentMethod,
      !paymentinfo,
      !itempprice,
      !tax,
      !shippingCharges,
      !totalAmount,
      !ordersstatus)
    ) {
      return res.status(404).send({
        success: false,
        message: "Provide All Fields",
      });
    }

    const is_inserted = await OrderModel.create({
      user: req.user._id,
      shippinginfo,
      ordersItems,
      paymentMethod,
      paymentinfo,
      itempprice,
      tax,
      shippingCharges,
      totalAmount,
      ordersstatus,
    });

    //update stock
    for (let i = 0; i < ordersItems.length; i++) {
      const product = await ProductModel.findById(ordersItems[i].product);
      product.stock -= ordersItems[i].quantity;
      await product.save();
    }

    if (is_inserted) {
      return res.status(201).send({
        success: true,
        message: "The Order place Succesfully",
      });
    }
  } catch (error) {
    return res.status(504).send({
      success: false,
      message: "The Error in Order Create API",
      error: error,
    });
  }
};

//get my all oders
export const getmyoders = async (req, res) => {
  try {
    const Myoders = await OrderModel.find({ user: req.user._id });

    if (!Myoders) {
      return res.status(404).send({
        success: false,
        message: "No Order Found",
      });
    }
    return res.status(200).send({
      success: true,
      message: "Oders Fetch Succesfully",
      Totaloders: Myoders.length,
      MyOders: Myoders,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Category ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Categories Update API",
      error,
    });
  }
};

//GET SINGLE ODERS

export const getsingleoders = async (req, res) => {
  try {

    const order = await OrderModel.findById(req.params.id);
    if(!order){
        return res.status(404).send({
           success : false,
           message : "The Order is not found"
        })
    }
    res.status(200).send({
        success : true,
        message : "The Oders is find out",
        order : order
    })

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Order ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Order Get API",
      error,
    });
  }
};


//PAYMENT CONTROLLER
export const PaymentController = async (req,res)=>{
try{

     //GET AMOUNT
     const {totalAmount} = req.body

     if(!totalAmount){
      return res.status(404).send({
        success : false ,
        message : "Totl Amount is Required"
      })
     }
     const {client_sercret } =  await stripe.paymentIntents.create({
        amount : Number(totalAmount * 100 ),
        currency : 'usd'
     })

     res.status(201).send({
        success : true,
        client_sercret
     })

}catch(error){
  console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Payment  API",
      error,
    });
}
};

//GET ALL ORDDERS BY ADMIN
export const getallordersbyadmin = async (req,res)=>{
  try{

    const orders = await OrderModel.find({})
    res.status(200).send({
       success : true ,
       totalOrders : orders.length,
       orders : orders
    })

  }catch(error){
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in GET ALL ORDER  API",
      error,
    });
  }
}


export const orderstatuschangecontroller = async (req,res)=>{
  try{

    const order = await OrderModel.findById(req.params.id)

    if(!order){
      return res.status(404).send({
        success : false,
        message : "The Order is not found"
      })
    }

    if(order.ordersstatus === 'processing') order.ordersstatus = 'shipped'
    else if(order.ordersstatus === "shipped"){
       order.ordersstatus = 'delivered'
       order.deliveryAt = Date.now();
    }
    else{
      return res.status(500).send({
        success : false ,
        message : "The Order Already Delivered"
      })
    }

    await order.save();

    return res.status(200).send({
      success : true,
      message :"Order Status Updated"
    })


  }catch(error){
    if (error.name === "CastError") {
      return res.status(500).send({
        success: false,
        message: "Invalid Order ID",
      });
    }
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in Order  API",
      error,
    });
  }
}