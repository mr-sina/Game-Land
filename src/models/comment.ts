import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate';

const Comment: mongoose.Schema = new mongoose.Schema({
    productId: {
        type: mongoose.Types.ObjectId,
        ref: 'Product',
    },
    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    cons: [{
        type: String,
    }],
    pros: [{
        type: String,
    }]
}, { 
    timestamps: true , toJSON: { virtuals: true }
})

Comment.plugin(mongoosePaginate);


export default mongoose.model('Comment', Comment)