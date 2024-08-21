import express from "express";
import UserController from "../controllers/user.controller";

export const userRouter = express.Router();

userRouter.get("/", UserController.handleGetAllUsers);
userRouter.post("/", UserController.handleCreateUser);
userRouter.get("/:id", UserController.handleGetUser);
userRouter.put("/:id", UserController.handleUpdateUser);
userRouter.delete("/:id", UserController.handleDeleteUser);
