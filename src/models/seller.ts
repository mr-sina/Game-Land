import mongoose from "mongoose"

const Seller: mongoose.Schema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    personalId: {
        type: Number,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    province: {
        type: String,
    },
    shopName: {
        type: String,
    },
    shabaNumber: {
        type: Number,
    },
    token : {
        type : String ,
        default : ''
    },

}, { timestamps: true })


export default mongoose.model("Seller", Seller)
