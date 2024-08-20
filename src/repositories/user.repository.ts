import { User } from "../models/user.schema"

const UserRepository = {
    getAllUsers: async () => {
        try {
            const users = await User.find();
            return users;
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
            const newUser = new User(user);
            await newUser.save();
            return newUser;
        } catch (error) {
            console.log(`Error while creating user: ${error}`);
        }
    }
};

export default UserRepository;