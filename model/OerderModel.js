import mongoose from "mongoose";
const OrderSchema = new mongoose.Schema(
  {
    shippinginfo: {
      address: {
        type: String,
        required: [true, "Address required"],
      },
      city: {
        type: String,
        required: [true, "city required"],
      },
      country: {
        type: String,
        required: [true, "Country required"],
      },
    },

    ordersItems: [
      {
        name: {
          type: String,
          required: [true, "Name required"],
        },
        price: {
          type: Number,
          required: [true, "price required"],
        },
        quantity: {
          type: Number,
          required: [true, "quantity required"],
        },
        image: {
          type: String,
          required: [true, "Image required"],
        },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Products",
          required: true,
        },
      },
    ],

    paymentMethod: {
      type: String,
      enum: ["COD", "ONLINE"],
      default: "COD",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    paidAt: Date,
    paymentinfo: {
      id: String,
      status: String,
    },
    itempprice: {
      type: Number,
      required: true,
    },
    tax: {
      type: Number,
      required: true,
    },
    shippingCharges: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    ordersstatus : {
        type : String,
        enum : ['processing' , 'shipped' , 'delivered']
    },
    deliveryAt : Date
  },
  { timestamps: true }
);

export const OrderModel = new mongoose.model("Oders", OrderSchema);
