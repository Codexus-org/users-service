import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { Auth } from "../models/auth.schema";

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    
    // Check if access token and refresh token doesn't exist
    if (!accessToken || !refreshToken) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if access token exists
    if (accessToken) {
        try {
            console.log(accessToken);
            jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string);
        } catch (error) {
            // If refresh token doesn't exist, regenerate new access token from refresh token
            if (!refreshToken) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            try {
                // Check if refresh token valid
                jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string);

                // If refresh token valid, verify resfresh token in db
                const activateRefreshToken = await Auth.findOne({ refreshToken });

                if (!activateRefreshToken) {
                    return res.status(401).json({ message: "Unauthorized" });
                }

                const payload = jwt.decode(refreshToken) as { id: string, name: string, email: string };

                // Generate new access token
                const newAccessToken = jwt.sign(
                    { id: payload.id, name: payload.name, email: payload.email },
                    process.env.JWT_ACCESS_SECRET as string,
                    { expiresIn: 300 }
                );
                
                return res.cookie("accessToken", newAccessToken, { httpOnly: true }).status(200).json({ message: "bukan disini" });
            } catch (error) {
                // If invalid refresh token, return unauthorized
                return res.status(401).json({ message: "Unauthorized" });
            }
        }
    }
    next();
};

export default authMiddleware;
