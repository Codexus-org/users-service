import { Request, Response, NextFunction } from "express";
import AuthServices from "../services/auth.service";
import UserService from "../services/user.services";

const AuthControllers = {

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
    }
}

export default AuthControllers;