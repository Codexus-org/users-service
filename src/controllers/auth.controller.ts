import { Request, Response, NextFunction } from "express";
import AuthServices from "../services/auth.service";
import UserService from "../services/user.services";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const AuthControllers = {
    handleCreateUser: async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password } = req.body;
        const newUser = await UserService.createUser({ name, email, password });

        if (!newUser){
            return res.status(401).json({ message: "Failed Create User" });
        }
        
        try {
            return res.status(201).json({ message: "User created", data: newUser });
        } catch (error) {
            console.log(error);
        }
    },

    handleLogin: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {email, password} = req.body;
            const userLogin = await AuthServices.loginUser({email, password});
            
            const {accessToken, refreshToken} = userLogin as { accessToken: string; refreshToken: string; };
            return res
                    .cookie("accessToken", accessToken, { httpOnly: true })
                    .cookie("refreshToken", refreshToken, { httpOnly: true })
                    .status(200)
                    .json({ message: "User logged in"});
            
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
        }  
    },

    handleLogout: async (req: Request, res: Response, next: NextFunction) => {
      const { refreshToken } = req.cookies;
      
      try {
        await AuthServices.userLogout(refreshToken);

        return res
          .clearCookie("accessToken")
          .clearCookie("refreshToken")
          .status(200)
          .json({ message: "User logged out" });
      } catch (error) {
        next(error);
      }
    },

    handleVerifyAccessToken: async (req: Request, res: Response, next: NextFunction) => {
        const { accessToken, refreshToken } = req.body;   

        try {
            const authorizeUser = await AuthServices.verifyAccessToken(accessToken, refreshToken);
             return res.status(200).json({ message: "User authorized", data: authorizeUser });
        } catch (error) {
            next(error);
        }
    },

    handleUpdateUser: async (req: Request, res: Response) => {
        try {
            const {accessToken} =req.cookies;
            const payload = jwt.decode(accessToken) as { id: string, name: string, email: string };

            const { name, email, password } = req.body;
            
            const hashPassword = await bcrypt.hash(password, 13);

            const updatedUser = await UserService.updateUser(payload.id, { name, email, password: hashPassword });
            return res.status(200).json({ message: "User updated", data: updatedUser });
        } catch (error) {
            console.log(error);
        }
    },
}

export default AuthControllers;