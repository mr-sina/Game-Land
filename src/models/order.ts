import mongoose from "mongoose"
import mongoosePaginate from 'mongoose-paginate';


const Order: mongoose.Schema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    state: {
        type: String,
        enum: ["pending", "in-progress", "delivered", "returned", "canceled"],
        required: true
    },
    deliverMethod: {
        type: String,
        enum: ["express", "post"],
        required: true
    },
    paymentMethod: {
        type: String,
        enum: ["online", "cash"],
        required: true
    },
}, { timestamps: true })

Order.plugin(mongoosePaginate);

export default mongoose.model("Order", Order)