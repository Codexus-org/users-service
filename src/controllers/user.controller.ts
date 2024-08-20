import { Request, Response } from "express";
import UserService from "../services/user.services";

const UserController = {
    // Get all users
    handleGetAllUsers: async (req: Request, res: Response) => {
        const users = await UserService.getAllUsers();
        return res.status(200).json({ message: "All users", data: users });
    },

    // Create user
    handleCreateUser: async (req: Request, res: Response) => {
        const { name, city } = req.body;
        const newUser = await UserService.createUser({ name, city });

        if (!newUser){
            return res.status(401).json({ message: "Failed Create User" });
        }
        
        try {
            return res.status(201).json({ message: "User created", data: newUser });
        } catch (error) {
            console.log(error);
        }
    },
};

export default UserController;