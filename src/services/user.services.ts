import UserRepository from "../repositories/user.repository"
import { IUser } from "../entities/user.entity";

const UserService = {
    getAllUsers: async () => {
        try {
            const users = await UserRepository.getAllUsers();
            return users;
        } catch (error) {
            console.log(`Error while getting all users: ${error}`);
        }
    },

    getUser: async (id: string) => {
        try {
            const user = await UserRepository.getUser(id);
            return user;
        } catch (error) {
            console.log(`Error while getting user: ${error}`);
        }
    },

    createUser: async (user: IUser) => {
        try {
            const newUser = await UserRepository.createUser(user);
            return newUser;
        } catch (error) {
            console.log(`Error while creating user: ${error}`);
        }
    }
};

export default UserServices;