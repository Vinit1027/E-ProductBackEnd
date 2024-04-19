import mongoose from "mongoose";
import userModel from "./user.model";
import productModel from "./product.model";

const Schema = mongoose.Schema;

const CartModel = new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:userModel,
        required:true
    },
    product:{
        type:Schema.Types.ObjectId,
        ref:productModel
    },
    name:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    image:{
        type:String,
        required:true
    }

});

export default mongoose.model('cart',CartModel)