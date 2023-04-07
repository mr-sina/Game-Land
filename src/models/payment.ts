import mongoose from "mongoose"


const Payment: mongoose.Schema = new mongoose.Schema({

    userId: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    },
    resnumber: {
        type: String,
        required: true
    },
    amount : {
        type : Number ,
        required : true
    },
    payment : {
        type : Boolean ,
        default : false 
    }
  
    
}, {timestamps: true})

export default mongoose.model('Payment', Payment)