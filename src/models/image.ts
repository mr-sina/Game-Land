import mongoose from "mongoose"


const Image: mongoose.Schema = new mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    alt: {
        type: String,
    },
    meta: {
        type: String,
    }
    
}, { timestamps: true })


export default mongoose.model('Image', Image)