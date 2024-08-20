import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log('Connected to MongoDB')
    .catch((error) => {
        console.log("Mongodb connection error failed")
        console.log(error)
    }));

const app = express();
app.use(express.json());

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
