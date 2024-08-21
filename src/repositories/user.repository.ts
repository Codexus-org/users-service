import bcrypt from "bcrypt";
import { User } from "../models/user.schema"
import { IUser } from "../entities/user.entity";

const UserRepository = {
    getAllUsers: async () => {
        try {
            const allUsers = await User.find();
            return allUsers;
        } catch (error) {
            console.log(`Error while getting all users: ${error}`);
        }
    },

    getUser: async (id: string) => {
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            console.log(`Error while getting user: ${error}`);
        }
    },

    createUser: async (user: IUser) => {
        try {
            const { name, email, password } = user;
            
            const hashPassword = await bcrypt.hash(password, 13);
            
            const newUser = new User({ name, email, password: hashPassword });

            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            console.log(`Error while creating user: ${error}`);
        }
    },

    loginUser: async (email: string) => {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            console.log(`Error while login user: ${error}`);
        }

    },

    deleteUser: async (id: string) => {
        try {
            const userId = await User.findByIdAndDelete(id);
            return userId;
        } catch (error) {
            console.log(error);
        }
    },

    updateUser: async (id: string, user: IUser) => {
        try {
            const updatedUser = await User.findByIdAndUpdate(id, user);
            return updatedUser;
        } catch (error) {
            console.log(error);
        }
    }
};

export default UserRepository;