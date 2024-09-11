import express from "express";
import UserController from "../controllers/user.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

export const userRouter = express.Router();

userRouter.get("/",verifyAccessToken, UserController.handleGetAllUsers);
// userRouter.get("/:id", UserController.handleGetUser);
// userRouter.post("/register", UserController.handleCreateUser);
// // userRouter.post("/login", UserController.handleLoginUser);
// userRouter.post("/logout", authMiddleware, UserController.handleLogoutUser);
// userRouter.delete("/delete/:id", authMiddleware, UserController.handleDeleteUser);
// userRouter.patch("/update/:id", authMiddleware, UserController.handleUpdateUser);


