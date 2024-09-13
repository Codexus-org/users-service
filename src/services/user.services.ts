import UserRepository from "../repositories/user.repository"
import bcrypt from "bcrypt";
import { IUser } from "../entities/user.entity";
import jwt from "jsonwebtoken";
import { Auth } from "../models/auth.schema";

const UserService = {
    getAllUsers: async () => {
        try {
            const allUsers = await UserRepository.getAllUsers();
            return allUsers;
        } catch (error) {
            console.log(error);
        }
    },

    getUser: async (email: string) => {
        try {
            const user = await UserRepository.getUser(email);
            return user;
        } catch (error) {
            console.log(`Error while getting user: ${error}`);
        }
    },

    createUser: async (user: IUser) => {
        try {
            const newUser = await UserRepository.createUser(user);

            // create checking logic for user already registered
            if (!user.email){
                throw new Error("email already registered");
            }

            return newUser;
        } catch (error) {
            console.log(error);
        }
    },

    deleteUser: async (id: string) => {
        try {
            const userId = await UserRepository.deleteUser(id);
            return userId;
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (id: string, user: IUser) => {
        try {
            const updatedUser = await UserRepository.updateUser(id, user);
            return updatedUser;
        } catch (error) {
            console.log(error);
        }
    }
};

export default UserService;