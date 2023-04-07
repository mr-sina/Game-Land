import mongoose from "mongoose"
// import uniqueString from 'unique-string';
import mongoosePaginate from 'mongoose-paginate';

const userSchema: mongoose.Schema = new mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart:[ {
        type: String,
        required: false
    }
],
    token : {
        type : String ,
        default : ''
    },
    avatar:{
        type : String ,
        default : null
    },
    resetToken: String,
    resetTokenExp: Date

}, { 
    timestamps: true , toJSON : { virtuals : true}
})


userSchema.plugin(mongoosePaginate);


// userSchema.virtual('comments', {
//     ref : 'Comment',
//     localField : '_id',
//     foreignField : 'userId'
// })

// userSchema.virtual('questions', {
//     ref: 'Question',
//     localField: '_id',
//     foreignField: 'userId'
// })

// userSchema.virtual('answers', {
//     ref: 'Answer',
//     localField: '_id',
//     foreignField: 'userId'
// })

// userSchema.virtual('orders', {
//     ref: 'Order',
//     localField: '_id',
//     foreignField: 'userId'
// })

export default mongoose.model('User', userSchema);