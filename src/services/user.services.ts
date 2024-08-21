import UserRepository from "../repositories/user.repository"
import bcrypt from "bcrypt";
import { IUser } from "../entities/user.entity";

const UserService = {
    getAllUsers: async () => {
        try {
            const allUsers = await UserRepository.getAllUsers();
            return allUsers;
        } catch (error) {
            console.log(error);
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
            console.log(error);
        }
    },

    loginUser: async (loginData: {email: string, password: string}) => {
        try {

            const { email, password } = loginData;

            if (!email || password.length < 8) {
                return "email should be valid and password should have minimum 8 characters";
            }

            // find user
            const user = await UserRepository.loginUser(email);

            // check if user exists
            if (!user) {
                return "User not found";
            }

            // compare password
            const isPassMatch = await bcrypt.compare(password, user.password as string);

            // check if password matches
            if (!isPassMatch) {
                return "Invalid password";
            }
            
            return user;
        } catch (error) {
            console.log(`Error while login user: ${error}`);
        }
    }
};

export default UserService;