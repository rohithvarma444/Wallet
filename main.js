import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv"
import authRoutes from "./routes/authRoutes.js";
import transferRoutes from "./routes/transferRoute.js"

dotenv.config()
const app = express();

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB successfully')
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error)
    })


app.use(express.urlencoded({ extended: true })); 
app.use(express.json())


app.use('/auth',authRoutes)
app.use('/wallet',transferRoutes);

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`It is running on Port ${PORT}`)
})
