import mongoose, { Schema } from 'mongoose';
import categoryModel from './category.model';

const schema = mongoose.Schema;

const productModel = new schema({
    name:{
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: categoryModel,
        required: true
    },
    images:{
        type: [String],
        required:true
    },
    rating:{
        type:String,
        default: 4
    },
    price: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    visible: {
        type: Boolean,
        default: true
    }
})


export default mongoose.model('product', productModel)