import express from "express";
import UserController from "../controllers/user.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

export const userRouter = express.Router();

userRouter.get("/", UserController.handleGetAllUsers);
userRouter.get("/:id", verifyAccessToken, UserController.handleGetUser);
// userRouter.delete("/delete/:id", authMiddleware, UserController.handleDeleteUser);
// userRouter.patch("/update/:id", authMiddleware, UserController.handleUpdateUser);


