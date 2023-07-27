import mongoose from 'mongoose';

const Admin: mongoose.Schema = new mongoose.Schema({

  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  role:{
    type: String,
    required: true
  },
  email: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  token : {
    type : String ,
    default : ''
  },
  rememberToken : {
    type : String ,
    default : ''
  },

}, { timestamps: true });

export default mongoose.model('Admin ', Admin);