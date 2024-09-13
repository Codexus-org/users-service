import express from "express";
import AuthControllers from "../controllers/auth.controller";
import { verifyAccessToken } from "../middleware/auth.middleware";

export const authRouter = express.Router();

authRouter.post("/verify-token", AuthControllers.handleVerifyAccessToken);
authRouter.post("/login", AuthControllers.handleLogin);
authRouter.post("/logout", AuthControllers.handleLogout);
authRouter.post("/register", AuthControllers.handleCreateUser);
authRouter.patch("/update/:id", verifyAccessToken,AuthControllers.handleUpdateUser);