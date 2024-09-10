import { Request, Response } from "express";
import UserService from "../services/user.services";
import { Auth } from "../models/auth.schema";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import AuthServices from "../services/auth.service";

const UserController = {
    // Get all users
    handleGetAllUsers: async (req: Request, res: Response) => {
        const allUsers = await UserService.getAllUsers();
        return res.status(200).json({ message: "All users", data: allUsers });
    },

    // Create user
    handleCreateUser: async (req: Request, res: Response) => {
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

    // Get user
    handleGetUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserService.getUser(id);
        return res.status(200).json({ message: "User", data: user });
    },

    // handleLoginUser: async (req: Request, res: Response) => {
    //     try {
    //         const {email, password} = req.body;
    //         const userLogin = await AuthServices.loginUser({email, password});
            
    //         const {accessToken, refreshToken} = userLogin as { accessToken: string; refreshToken: string; };
    //         return res
    //                 .cookie("accessToken", accessToken, { httpOnly: true })
    //                 .cookie("refreshToken", refreshToken, { httpOnly: true })
    //                 .status(200)
    //                 .json({ message: "User logged in"});
            
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             return res.status(401).json({ message: error.message });
    //         }
    //     }
    // },

    handleDeleteUser: async (req: Request, res: Response) => {
        try {
            const {accessToken}= req.cookies;
            const payload = jwt.decode(accessToken) as { id: string, name: string, email: string };

            const deletedUser = await UserService.deleteUser(payload.id);
            return res.status(200).json({ message: "User deleted", data: deletedUser });
        } catch (error) {
            console.log(error);
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

    handleLogoutUser: async (req: Request, res: Response) => {
        const { refreshToken } = req.body;

        await AuthServices.userLogout(refreshToken);

        return res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json({ message: "User logged out" });
    }
};

export default UserController;