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

    loginUser: async (loginData: {email: string, password: string}) => {
        const { email, password } = loginData;

        try {            
            if (!email || password.length < 8) {
                throw new Error("email should be valid and password should have minimum 8 characters");
            }

            // find user
            const user = await UserRepository.loginUser(email);

            // check if user exists
            if (!user) {
                throw new Error("Invalid credentials");
            }

            // compare password
            const isPassMatch = await bcrypt.compare(password, user.password as string);

            // check if password matches
            if (!isPassMatch) {
                throw new Error("Invalid credentials");
            }

            const payload = {
                id: user.id,
                name: user.name,
                email: user.email
            };

            //create token
            const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, { expiresIn: 300 });
            const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: "7d" });

            const token = { accessToken, refreshToken };
            const userId = user.id;
            //save refresh token in db
            const newRefreshToken = new Auth({
                userId: user.id,
                refreshToken,
            });
            await newRefreshToken.save();
            console.log(userId);
            return token;
        } catch (error) {
            console.log(`Error while login user: ${error}`);
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