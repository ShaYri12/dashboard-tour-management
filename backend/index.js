import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from 'cors'
import cookieParser from "cookie-parser"
import tourRoute from './routes/tours.js'
import userRoute from './routes/users.js'
import authRoute from './routes/auth.js'
import reviewRoute from './routes/reviews.js'
import bookingRoute from './routes/bookings.js'

dotenv.config();
const app = express();
const port = process.env.PORT ||  8000
const corsOption = {
    origin: true,
    credentials: true,
};


//testing
app.get('/',(req,res)=>{
    res.send("api is working");
})

mongoose.set("strictQuery", false);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB database connected");
    } catch (err) {
        console.log("MongoDB database connection failed", err);
    }
};


//middleware
app.use(express.json())
app.use(cors(corsOption))
app.use(cookieParser())
app.use('/api/auth', authRoute)
app.use('/api/tours', tourRoute)
app.use('/api/users', userRoute)
app.use('/api/review', reviewRoute)
app.use('/api/booking', bookingRoute)


app.listen(port,()=>{
    connect();
    console.log(`server listening on port: ${port}`);
})
