import express from "express";
import AuthControllers from "../controllers/auth.controller";

export const authRouter = express.Router();

authRouter.post("/verify-token", AuthControllers.handleVerifyAccessToken);
authRouter.post("/login", AuthControllers.handleLogin);
authRouter.post("/logout", AuthControllers.handleLogout);