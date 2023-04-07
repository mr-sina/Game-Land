import mongoose from "mongoose"
const {ObjectId} = mongoose.Types;
import mongoosePaginate from 'mongoose-paginate';

const Product: mongoose.Schema = new mongoose.Schema({

    seller: {
        type: ObjectId,
        ref: 'Seller'
    },
    title: {
        type: String,
        default: ''
    },
    price:{
        type: Number,
        required:true
    },
    description: {
        type: String,
        default: ''
    },
    discount: {
        type: ObjectId,
        ref: 'Discount'
    },
    imageId: [{
        type: String,
        default:null
    }],

}, {timestamps: true})

Product.plugin(mongoosePaginate);

export default mongoose.model('Product', Product)