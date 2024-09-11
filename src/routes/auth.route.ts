import express from "express";
import AuthControllers from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/register", AuthControllers.handleCreateUser);
authRouter.post("/login", AuthControllers.handleLogin);
authRouter.post("/logout", AuthControllers.handleLogout);
authRouter.post("/verify-token", AuthControllers.handleVerifyAccessToken);