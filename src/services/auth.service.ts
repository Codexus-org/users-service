import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import AuthRepository from "../repositories/auth.repository";
import UserService from "./user.services";
import { User } from "../models/user.schema";


const AuthServices = {
    loginUser: async (loginData: {email: string, password: string}) => {
        const { email, password } = loginData;

        try {            
            if (!email || password.length < 8) {
                throw new Error("email should be valid and password should have minimum 8 characters");
            }

            // find user
            const user = await UserService.getUser(email);

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

            const userId = user.id;
            
            //save refresh token in db
            await AuthRepository.createAuth(
                user.id,
                refreshToken
            );

            return {userId, accessToken, refreshToken};
        } catch (error) {
            console.log(`Error while login user: ${error}`);
        }
    },

    verifyAccessToken: async (accessToken: string, refreshToken: string) => {
        // Check if access token and refresh token doesn't exist
        if (!accessToken && !refreshToken) {
            throw new Error("accessToken and refreshToken are required");
        }

        // Check if access token exists
        if (accessToken) {
            try {
                console.log('accessToken auth.service: ',accessToken);
                jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);
                const payload = jwt.decode(accessToken) as { id: string, name: string, email: string };
                return { userId: payload.id, refreshToken, accessToken };
            } catch (error) {
                
                // If refresh token doesn't exist, regenerate new access token from refresh token
                if (!refreshToken) {
                    throw new Error("refreshToken is required");
                }
                try {
                    // Check if refresh token valid
                    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);
  
                    // If refresh token valid, verify resfresh token in db
                    const activateRefreshToken = await AuthRepository.getAuth(refreshToken);

                    if (!activateRefreshToken) {
                        throw new Error("refreshToken invalid");
                    }
                    console.log(activateRefreshToken);
                    console.log(refreshToken);
                    const payload = jwt.decode(refreshToken) as { id: string, name: string, email: string };
                    console.log(payload);
                    // Generate new access token
                    const newAccessToken = jwt.sign(
                        { id: payload.id, name: payload.name, email: payload.email },
                        process.env.JWT_ACCESS_SECRET as string,
                        { expiresIn: 300 }
                    );
                    
                    return { userId: payload.id, refreshToken, accessToken: newAccessToken };
                } catch (error) {
                    // If invalid refresh token, return unauthorized
                    throw new Error("Invalid refreshToken");
                }
            }
        }
    },

    userLogout: async (refreshToken: string) => {
        try {
            await AuthRepository.deleteAuth(refreshToken);
        } catch (error) {
            console.log(`Error while logout user: ${error}`);
        }
    }
}

export default AuthServices;