import { Request, Response } from "express";
import UserService from "../services/user.services";
import { Auth } from "../models/auth.schema";

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

    handleLoginUser: async (req: Request, res: Response) => {
        const {email, password} = req.body;
        try {
            const userLogin = await UserService.loginUser({email, password});

            if (userLogin && typeof userLogin === 'object') {
                const {accessToken, refreshToken} = userLogin as { accessToken: string; refreshToken: string; };
                // rest of your code
                return res
                    .cookie("accessToken", accessToken, { httpOnly: true })
                    .cookie("refreshToken", refreshToken, { httpOnly: true })
                    .status(200)
                    .json({ message: "User logged in"});
            }
        } catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ message: error.message });
            }
        }
    },

    handleDeleteUser: async (req: Request, res: Response) => {
        const userId = req.params.id;
        
        try {
            const deletedUser = await UserService.deleteUser(userId);
            return res.status(200).json({ message: "User deleted", data: deletedUser });
        } catch (error) {
            console.log(error);
        }
    },

    handleUpdateUser: async (req: Request, res: Response) => {
        const userId = req.params.id;
        
        const userHeader = req.headers.authorization;
        const { name, email, password } = req.body;
        try {
            if (!userHeader) {
                return res.status(401).json({ message: "Unauthorized" });
            };

            const updatedUser = await UserService.updateUser(userId, { name, email, password });
            return res.status(200).json({ message: "User updated", data: updatedUser });
        } catch (error) {
            console.log(error);
        }
    },

    handleLogoutUser: async (req: Request, res: Response) => {
        const { refreshToken } = req.cookies;

        await Auth.findOneAndDelete({ refreshToken });

        return res.clearCookie("accessToken").clearCookie("refreshToken").status(200).json({ message: "User logged out" });
    }
};

export default UserController;