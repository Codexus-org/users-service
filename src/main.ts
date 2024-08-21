import express from 'express';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import { userRouter } from './routes/user.route';

dotenv.config();

mongoose
    .connect(process.env.MONGO_URI as string)
    .then(() => console.log("Mongodb connection success"))
    .catch((error)=> {
        console.log("Mongodb connection failed")
        console.log(error);
    });

const app = express();

app.use(express.json());

app.use("/users-services", userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
