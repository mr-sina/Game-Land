import mongoose, { mongo } from "mongoose"


const Category: mongoose.Schema = new mongoose.Schema({

    parentId: {
        type: mongoose.Types.ObjectId,
        ref: 'Category'
    },
    name: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        default:null
    },

}, { timestamps: true })



export default mongoose.model('Category', Category)