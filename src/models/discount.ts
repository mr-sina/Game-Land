import mongoose from "mongoose"


const Discount: mongoose.Schema = new mongoose.Schema({
    reason: {
        type: String
    },
    code: {
        type: String,
        required: true
    },
    maxAmount: {
        type: Number,
    },
    expire: {
        type: Date,
        required: true
    },
    percent: {
        type: Number,
    },
    quantity: {
        type: Number,
        required: false
    },
    active: {
        type: Boolean,
        required: true
    },
}, {timestamps: true})

export default mongoose.model('Discount', Discount)