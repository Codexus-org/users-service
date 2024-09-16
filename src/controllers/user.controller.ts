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

    // Get user
    handleGetUser: async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await UserService.getUser(id);
        console.log(user);
        return res.status(200).json({ message: "User", data: user });
    },

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
};

export default UserController;