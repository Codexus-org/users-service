import { Request, Response } from "express";
import UserService from "../services/user.services";

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
        const { email, password } = req.body;
        try {
            const userLogin = await UserService.loginUser({ email, password });

            if ( userLogin === "User not found") {
                return res.status(404).json({ message: userLogin });
            }

            if ( userLogin === "Invalid password") {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            return res.status(200).json({ message: "User logged in", data: userLogin });
        } catch (error) {
            console.log(error);
        }
    }

};

export default UserController;