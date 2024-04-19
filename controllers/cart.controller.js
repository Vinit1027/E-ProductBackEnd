import cartModel from "../models/cart.model"
import productModel from "../models/product.model"
import mongoose from 'mongoose';


export const addToCart = async (req,res)=> {
    try {

        const {userID, productID} = req.body;

        const productData = await productModel.findOne({_id: productID});

        if(productData){

            const cartItem = await cartModel.findOne({ user: userID, product: productID})

            if(cartItem){
                
                const updateCart = await cartModel.updateOne(
                    {_id: cartItem._id},
                    {
                        $set:{
                            quantity: cartItem.quantity + 1
                        }
                    })

                if(updateCart.acknowledged){
                    return res.status(200).json({
                        message:"Quantity Incremented"
                    })
                }
            }
        }

        const cartData = new cartModel({
            user:userID,
            product:productData._id,
            name:productData.name,
            price:productData.price,
            quantity:1,
            image:productData.images[0]
        })

        console.log(cartData);

        cartData.save();

        if(cartData){
            return res.status(200).json({
                data:cartData,
                message:"New data added"
            })
        }


    } catch (error) {
        return res.status(500).json({
            message:error.message
        })
    }
}



export const getCartData = async (req,res)=> {

    try {
        const cartData = await cartModel.find()
        if (cartData) {
            return res.status(200).json({
                data: cartData,
                message: "Success",
                path: "http://localhost:8001/uploads"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}



export const updateCartQuantity = async (req,res)=> {
    try {

        const id = req.params.id;
        const { type } = req.body;
        const cartData = await cartModel.findOne({ _id: id });

        console.log(cartData)

        let quantity = cartData.quantity;

        console.log(quantity)
        if(type === "increment"){
            quantity =  quantity + 1
        }
        if(type === "decrement"){
            quantity = quantity - 1
        }

        if(quantity == 0){
            const deleteCartData = await cartModel.deleteOne({ _id: id});

            if(deleteCartData.acknowledged){
                return res.status(500).json({
                    message: 'Cart Item Deleted'
                })
            }
        }

        if(quantity > 10){
            return res.status(201).json({
                message: " Quantity exceeds 10 item limit"
            })
        }

        const updateQuantity = await cartModel.updateOne(
            {_id: id},
            {
                $set:{
                    quantity: quantity
                }
            })

        if(updateQuantity.acknowledged){
            return res.status(200).json({
                message:"Quantity Incremented"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

export const deleteCartData = async (req,res)=>{
    try {
        const id = req.params.id;

        const deleteCartData = await cartModel.deleteOne({ _id: id})

        if(deleteCartData.acknowledged){
            return res.status(200).json({
                message: "Item deleted"
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}