import express from "express";
import UserController from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.get("/", UserController.handleGetAllUsers);
userRouter.get("/:id", UserController.handleGetUser);
userRouter.post("/", UserController.handleCreateUser);
userRouter.post("/login", UserController.handleLoginUser);
userRouter.delete("/:id", UserController.handleDeleteUser);
userRouter.patch("/:id", UserController.handleUpdateUser);


