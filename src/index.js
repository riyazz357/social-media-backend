import dotenv from 'dotenv'
dotenv.config({
    path:"./env",
})
import connectDB from './database/index.js';
import {app} from './app.js';

const PORT =process.env.PORT || 4000;

connectDB
.then(()=>{
    app.listen(PORT, ()=>{
        console.log(`server is running on port: ${PORT}`)
    });
})
.catch((err)=>{
    console.log("mongodb connection failed!!",err)
})
