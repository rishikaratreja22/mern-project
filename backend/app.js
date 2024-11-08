import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import cors from 'cors';
import userRouter from "./routes/user-routes.js";
import adminRouter from "./routes/admin-routes.js";
import movieRouter from "./routes/movie-routes.js";
import bookingsRouter from "./routes/booking-routes.js";


const app = express();

//middlewares
app.use(cors()); 
app.use(express.json()); //this ensures that our application only communicates with the json data
app.use("/user", userRouter); 
app.use("/admin", adminRouter); 
app.use("/movie", movieRouter); 
app.use("/booking", bookingsRouter);  

app.get('/movie', (req, res) => {
    res.json({ message: 'Movies list' }); 
});

mongoose.connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.fa3mnir.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
.then(() => 
    app.listen(5000, () => 
    console.log("Connected to Database and Server is Running") 
)).catch((e) => console.log(e));  //mongoose.connect returns a promise
