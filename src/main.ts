import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { userRouter } from './routes/user.route';
import cookieParser from 'cookie-parser';
import { middlewareCheckOrigin } from './middleware/api-gateway.middleware';

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
app.use(cookieParser());

// app.use(middlewareCheckOrigin);

app.use("/forumapp/api/v1/users-services", userRouter);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});
