import mongoose from "mongoose";

const Schema = mongoose.Schema;


const userModel = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required:true
    },
    password:{
        type: String,
        required:true
    },
    passwordcrypt : {
        type: String
    },
    contact:{
        type: Number,
    },
    createdAt: {
        type: Date,
        default: Date.now()

    }
})


export default mongoose.model('User', userModel)