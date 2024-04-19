import mongoose from "mongoose";


const Schema = mongoose.Schema;


const catergoryModel = new Schema({
    name:{
        type: String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: null
    },
    visible: {
        type : Boolean,
        default: true
    }
})


export default mongoose.model('category', catergoryModel)