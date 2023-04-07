import express from 'express'
// import MongoStore from 'connect-mongo'
// const Store = MongoStore(session);
import adminRoutes from '../routes/admin'
import userRoutes from '../routes/user'
import sellerRoutes from '../routes/seller'
// import passport from 'passport'

const app = express()
import  './db'
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
// app.use(passport.initialize());
// app.use(passport.session());

// Routes
app.use('/admin', adminRoutes);
app.use('/user', userRoutes);
app.use('/seller' , sellerRoutes)

//handle error
app.use((error:any, req:any, res:any, next:any) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

export default app