import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export async function verifyAccessToken ( req: Request, res: Response, next: NextFunction ) {
    const { accessToken, refreshToken } = req.cookies;

    if (!accessToken) {
      return res.status(401).json({ message: "Unauthorized: No access token provided. Please log in first." });
    }

    try {
        const authorizeUser = await fetch(`http://localhost:3001/auth/verify-token`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accessToken, refreshToken })
            }
        );

        const data = await authorizeUser.json();
        req.body.user = data.data;

        if (!authorizeUser.ok) {
            const error = await authorizeUser.json();
            throw new Error(error.message);
        }

        next();
    } catch (error: any) {
        // next(error);
        res.status(401).json({ message: error.message });
    }
}