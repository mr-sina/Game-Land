import mongoose from 'mongoose'
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost/gameLand')
  .then(() => {
    console.log('connected to DB!')
  })
  .catch(err => {
    console.log(err)
  });